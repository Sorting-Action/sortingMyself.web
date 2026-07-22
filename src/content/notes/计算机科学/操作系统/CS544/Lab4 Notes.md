---
id: 134a1c15
title: "Lab4 Notes"
slug: lab4-notes
tags: []
draft: false
created: 2024-04-04
---
非原创
https://qiita.com/kagurazakakotori/items/917cd94a726fee491071#exercise-1
https://ypl.coffee/6-828-2018-lab4/
https://www.cnblogs.com/gatsby123/p/9930630.html
https://github.com/LancelotGT/JOS/blob/master/answers-lab4.txt#LL13

# Part A: Multiprocessor Support and Cooperative Multitasking

1. JOS 的多处理器系统运行
2. 用户进程可创造新的进程
3. 协作式进程调度

## Multiprocessor Support

我们将使JOS支持"symmetric multiprocessing" (SMP)，这是一种所有CPU共享系统资源的多处理器模式。在启动阶段这些CPU将被分为两类：

1. 启动CPU（BSP）：负责初始化系统，启动操作系统。
2. 应用CPU（AP）：操作系统启动后由BSP激活。那一个 CPU是BSP由硬件和BISO决定，到目前为止所有JOS代码都运行在BSP上。在SMP系统中，每个CPU都有一个对应的local APIC（LAPIC），负责传递中断。CPU通过内存映射IO (memory-mapped I/O) 访问它对应的APIC，这样就能通过访问内存达到访问设备寄存器的目的。LAPIC从物理地址0xFE000000开始，JOS将通过MMIOBASE虚拟地址访问该物理地址。

### Exercise 1

`lapic_init()` calls `mmio_map_region()` at first to map 4K memory at physical address `lapicaddr` to the MMIO area of virtual memory. So we need to use `boot_map_region()` to implement the `mmio_map_region()` in `kern/pmap.c`.

## Application Processor Bootstrap

在启动AP之前，BSP需要搜集多处理器的信息，比如总共有多少CPU，它们的LAPIC ID以及LAPIC MMIO地址。mp_init()函数从BIOS中读取这些信息。该函数会在进入内核后被i386_init() 调用，主要作用就是读取 mp configuration table 中保存的CPU信息，初始化cpus数组，ncpu（总共多少可用CPU），bootcpu 指针（指向BSP对应的CpuInfo结构）。

真正启动AP的是在 boot_aps() 中，该函数遍历 cpus 数组，一个接一个启动所有的AP，当一个AP启动后处于实模式中，会执行 kern/mpentry.S 中的 Entry 代码。经过一些简单的 setup 后，AP 将会处于保护模式，跳转到mp_main()中，该函数为当前AP设置GDT，TTS，最后设置cpus数组中当前CPU对应的结构的cpu_status为CPU_STARTED。

## Per-CPU State and Initialization

```cpp
struct CpuInfo {
	uint8_t cpu_id; // Local APIC ID; index into cpus[] below
	volatile unsigned cpu_status; // The status of the CPU 
	struct Env *cpu_env; // The currently-running environment. 
	struct Taskstate cpu_ts; // Used by x86 to find stack for interrupt 
};
```

`CpuInfo` 是描述一个 CPU 的结构，上面说明了三项 CPU 私有的信息：

1. 系统寄存器（`cpu_status`）：类似 CR3，GDT 之类的寄存器。
2. 进程指针（`cpu_env`）：指向当前的进程（也就是 JOS 中的环境）。
3. TTS 描述符（`cpu_ts`）：使用 TTS 描述符找到 CPU 对应的内核栈。
4. 内核栈：内核代码中的数组`percpu_kstacks[NCPU][KSTKSIZE]`为每个CPU都保留了KSTKSIZE大小的内核栈。从内核线性地址空间看CPU 0的栈从KSTACKTOP开始，CPU 1的内核栈将从CPU 0栈后面KSTKGAP字节处开始，以此类推，参见inc/memlayout.h。

## 锁

和使用多个 CPU 相对应的，是处理竞争情况。因此，这一步来实现锁。在课件中，已经给出了几种锁的原理和实现。这里使用的是一种名为 big kernel lock 的锁。

### Exercise 5

JOS 已经在 `unlock_kernel` 和 `lock_kernel` 等函数中做了封装，这里直接调用即可。

