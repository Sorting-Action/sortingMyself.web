---
id: 85ae2b03
title: "Lab3 Notes"
slug: lab3-notes
tags: []
draft: false
created: 2024-04-04
---
参考
https://qiita.com/kagurazakakotori/items/334ab87a6eeb76711936
https://ypl.coffee/6-828-2018-lab3/
https://www.cnblogs.com/gatsby123/p/9838304.html
https://github.com/LancelotGT/JOS/blob/master/answers-lab3.txt

新增文件及其作用：

|       |             |                                                                          |
| ----- | ----------- | ------------------------------------------------------------------------ |
| inc/  | env.h       | Public definitions for user-mode environments                            |
|       | trap.h      | Public definitions for trap handling                                     |
|       | syscall.h   | Public definitions for system calls from user environments to the kernel |
|       | lib.h       | Public definitions for the user-mode support library                     |
| kern/ | env.h       | Kernel-private definitions for user-mode environments                    |
|       | env.c       | Kernel code implementing user-mode environments                          |
|       | trap.h      | Kernel-private trap handling definitions                                 |
|       | trap.c      | Trap handling code                                                       |
|       | trapentry.S | Assembly-language trap handler entry-points                              |
|       | syscall.h   | Kernel-private definitions for system call handling                      |
|       | syscall.c   | System call implementation code                                          |
| lib/  | Makefrag    | Makefile fragment to build user-mode library,obj/lib/libuser.a           |
|       | entry.S     | Assembly-language entry-point for user environments                      |
|       | libmain.c   | User-mode library setup code called from entry.S                         |
|       | syscall.c   | User-mode system call stub functions                                     |
|       | console.c   | User-mode implementations of I/O putchar and getchar, providing console  |
|       | exit.c      | User-mode implementation of exit                                         |
|       | panic.c     | User-mode implementation of panic                                        |
| user/ | *           | Various test programs to check kernel lab 3 code                         |

# Part A: User Environments and Exception Handling

本文这里的用户环境和 Unix 的进程是一个概念，只不过为了明确提供的接口不同，使用了不同的词汇。这里的 environment 和 process 一样，结合了线程（thread）和地址空间（address space）的概念，线程主要由保存的寄存器（也就是下文的 env_tf）定义，而地址空间主要由 env_pgdir 指向的页目录定义。

lab3 里面会创造一个用户环境，lab4 里面有多个。在`kern/env.c`中，有：

```c
struct Env *envs = NULL; // 指向存储所有环境结构体的数组 all environment
struct Env *curenv = NULL; // current environment
static struct Env *env_free_list; // 空闲环境的链表
```

## Environment State

![image](/notes-assets/85ae2b03/image-20231114172610765.png)

- `env_tf`：寄存器的快照，通常用于错误恢复。里面存储的是现在的用户环境没有运行时的寄存器的值。
- `env_type`：一般为 `ENV_TYPE_USER` 后面有特殊的。
- `env_status`：ENV_FREE、ENV_RUNNABLE（等待运行的）、ENV_RUNNING（正在运行的）、ENV_NOT_RUNNABLE（active 但是没有准备好运行，比如需要等待其他进程完成）、ENV_DYING（lab4）

## Allocating the Environments Array

主要是和上文的分配 `gh_pages` 的过程一样：

```c
envs = (struct Env *) boot_alloc(NENV * sizeof( struct Env ));
memset(envs, 0, NENV * sizeof( struct Env ));
...
boot_map_region(kern_pgdir, UENVS, PTSIZE, PADDR(envs), PTE_U | PTE_P);
```

## Creating and Running Environments

这里由于我们没有文件系统，因此需要把用户的程序内嵌入系统内核中。而执行这步的就是 `kern/Makefrag` ，它在 `obj/kern/kernel.sym` 输出了很多 `_binary_obj_user_hello_start`、`_binary_obj_user_hello_end` 类似的符号，他们就是程序的起始和终止线性地址。

### Exercise 2.

env_init：

```cpp
env_free_list = NULL;
for (int i=NENV-1; i>=0; i--) {
	envs[i].env_id = 0;
	envs[i].env_status = ENV_FREE;
	envs[i].env_runs = 0;
	envs[i].env_link = env_free_list;
	env_free_list = &envs[i];
}
```

region_alloc:

```cpp
void * start = ROUNDDOWN( va, PGSIZE );
void * end = ROUNDUP( va+len, PGSIZE );

for ( ; start<end; start+=PGSIZE ) {
	struct PageInfo * p = page_alloc(0);
	if (p == NULL) panic("cannot alloc page.");
	int r = page_insert( e->env_pgdir, p, start, PTE_U | PTE_W );
	if (r != 0) panic("region alloc: %e", r);
}
```

截止目前，我们还无法成功运行env run 的代码，因为 JOS 目前无法从 UserEnv 切换倒 kernel，会给出一个 triple fault。

## Handling Interrupts and Exceptions

现在，当我们试图从 user space 切换到 kernel 时，会陷入一个无法返回的死循环。因此我们需要加入处理中断和异常的机制。

## Basics of Protected Control Transfer

中断和异常都是受保护的控制转换器（Protected Control Transfer），他们允许代码从用户模式转换到内核模式。在 Intel 语境下，不同的是，中断通常由外部因素引起，比如外部设备通知（an interrupt is a protected control transfer that is caused by an asynchronous event usually external to the processor, such as notification of external device I/O activity.）；但异常是由正在运行的代码自身引起的，比如除以 0（An exception, in contrast, is a protected control transfer caused synchronously by the currently running code, for example due to a divide by zero or an invalid memory access.）。

为了确保中断不能决定内核的代码从哪里开始运行或者如何运行，Intel 使用了两种机制：

1. 中断描述符表（The Interrupt Descriptor Table）：用于确保中断发生时，处理器只会跳转到由内核定义的地址运行。x86允许256种不同的中断或异常进入点，每一个都有一个向量号，从0到255。CPU使用向量号作为IDT的索引，取出一个IDT描述符，根据IDT描述符可以获取中断处理函数cs和eip的值，从而进入中断处理函数执行。
2. 任务状态段（The Task State Segment）：当x86 异常发生且从用户切换到内核模式时，处理器也需要切换栈，而 TSS 用于指定栈的位置。TSS是一个很大的数据结构，由于JOS中内核模式就是指权限0，所以处理器只使用TSS结构的ESP0和SS0两个字段来定义内核栈，其它字段不使用。

## 异常和中断类型 Types of Exceptions and Interrupts

x86处理器产生的所有同步中断都位于 0-31，缺页中断是 14。而在 31 以上都只会被用于软件中断。

具体看https://pdos.csail.mit.edu/6.828/2018/readings/i386/c09.htm

这里有一个总结页：https://pdos.csail.mit.edu/6.828/2018/readings/i386/s09_09.htm

