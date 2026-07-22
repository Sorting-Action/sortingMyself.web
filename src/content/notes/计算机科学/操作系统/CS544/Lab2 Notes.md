---
id: 5f133d92
title: "Lab2 Notes"
slug: lab2-notes
tags: []
draft: false
created: 2024-04-04
---
部分lab2新增的文件及其作用：

1. `memlayout.h` 描述了虚拟地址空间的结构。
2. `pmap.h` 和上面的的文件一起定义了`PageInfo` 的结构。
3. `kclock.c`和`kclock.h` 操纵 PC 的电池供电时钟和 CMOS RAM 硬件。
4. `inc/mmu.h` contains a number of definitions.

# Part 1: Physical Page Management

操作系统需要跟踪每一块物理内存以确定他们是否被使用。而JOS的解决方式是使用`page granularity`管理，而后使用MMU来映射和保护每一块内存。

而JOS的物理页分配器通过管理一个`PageInfo`的对象的链表来确定他们是否被使用，一个对象对应一个`physical page`。因此，在本实验中，编写一个`physical page allocator`是实现其他虚拟内存机制的第一步。

在具体的实现中，请看代码注释。

`KERNBASE` 代表了内核在虚拟内存地址中的位置；未分配的地址，也就是`nextfree` 必须大于它。

从`PageInfo`的定义中，我们可以发现这是一个典型的链表。`pp_ref`指向具体`page`的位置，而`pp_link`则指向下一个节点。

```c
struct PageInfo {
	// Next page on the free list.
	struct PageInfo *pp_link; 
	
	// pp_ref is the count of pointers (usually in page table entries)
	// to this page, for pages allocated using page_alloc.
	// Pages allocated at boot time using pmap.c's
	// boot_alloc do not have valid reference count fields.
	uint16_t pp_ref;
};
```

回到`void mem_init(void)`中，我们的目标是分配一个由上文所述`struct`构成的链表，并且分配内存。而根据上文提到的总共的`page`个数是`npages`个，我们可以得知需要内存的大小，于是，有：

```c
pages = (struct PageInfo *) boot_alloc(npages * sizeof( struct PageInfo ));
memset(pages, 0, npages * sizeof( struct PageInfo ));
```

而下一个部分`void page_init(void)`则是对上文创建的链表进行初始化。根据注释所述，前几个0、base memory、IO hole的部分其实没有什么问题，主要在于在最后的 extended memory 中，我们需要根据上文创建的`boot_alloc()`的返回值，来判断空余内存地址的起始位置。而判断的方式则是 `PADDR(boot_alloc(0)) / PGSIZE`，其中`boot_alloc(0)` 返回空余内存地址的起始位置，`PADDR()` 将虚拟内存地址转换为物理内存地址，之后便可以得到 pages 的编号了。

```c
size_t i;
// mark physical page 0
pages[0].pp_ref = 0;
pages[0].pp_link = NULL;

// the rest of base memory
for (i = 1; i < npages_basemem; i++) {
	pages[i].pp_ref = 0;
	pages[i].pp_link = page_free_list;
	page_free_list = &pages[i];
}

// IO hole
for (i=IOPHYSMEM/PGSIZE; i<EXTPHYSMEM/PGSIZE; i++) {
	pages[i].pp_ref = 1;
	pages[i].pp_link = NULL;
}

// extended memory
size_t used_extend_memory = PADDR( boot_alloc(0) ) / PGSIZE;
for (i=EXTPHYSMEM/PGSIZE; i<used_extend_memory; i++) {
	pages[i].pp_ref = 1;
	pages[i].pp_link = NULL;
}
for (i=used_extend_memory; i<npages; i++) {
	pages[i].pp_ref = 0;
	pages[i].pp_link = page_free_list;
	page_free_list = &pages[i];
}
```

做完初始化之后，就是实际分配物理地址了。在提示到的两个方程中，`memset` 同标准库中的一样，而 `page2kva` 则返回一个 `PageInfo` 结构体的虚拟地址。先按照注释所言，检查list是否为空，之后创建一个新指针指向现在的 `PageInfo` 等等，都是常规的链表操作了。

```c
// check null
if (page_free_list == NULL) {
	return NULL;
}

// point to current
struct PageInfo * current = page_free_list;
page_free_list = page_free_list->pp_link;
current->pp_link = NULL;
if (alloc_flags & ALLOC_ZERO) {
	memset(page2kva(current), '\0', PGSIZE);
}

return current;
```

至于下一个释放，也是根据提示来：

```c
if (pp->pp_ref != 0 || pp->pp_link != NULL) {
	panic("page_free: ref is not 0 or link is not null.");
}
pp->pp_link = page_free_list;
page_free_list = pp;
```

# Part 2: Virtual Memory

## Virtual, Linear, and Physical Addresses

在x86体系中，有三种地址表达方式：虚拟、线性、和物理。如下图所示，虚拟地址由两部分组成，分别是段选择子 (selector) 和段内偏移 (offset)。虚拟地址也是一般我们接触的，软件操控的地址。经由段转换机之后得到线性地址，最后经由页地址转换机我们可以得到真实的内存地址。

![image](/notes-assets/5f133d92/image-20231029224157917.png)

在 C 中，指针的值就是 offset 的值。在JOS `boot/boot.S` 中，通过 Global Descriptor Table (GDT) 关闭了分段管理的功能，通过把所有段基址设为0，界限为 0xffffffff 的方式。因此在 JOS 中，线性地址的值已经等于 Offset 的值了。

在 lab1 中的part 3，我们引入了一个简单的页表，使得内核可以运行在 0xf0100000 的虚拟地址空间，尽管它所在的真实位置是物理地址0x00100000处。这个页表仅仅映射了4MB的内存空间。接下来，我们将把这种映射扩展到物理内存的头256MB空间上，并且把这部分物理空间映射到从 0xf0000000 开始的虚拟空间中，以及一些其他的虚拟地址空间中。

正如 code 所展示，当我们进入保护模式，也就是`boot/boot.S`开始运行之后，线性和物理地址就不能再访问，我们所访问到的，只有被 MMU 所翻译的虚拟地址。

| 类型       | 地址 |
| ---------- | ---- |
| T*         | 虚拟 |
| uintptr_t  | 虚拟 |
| physaddr_t | 物理 |

上表中的后两种地址都是一个类型 `uint32_t`，即使如此，`physaddr_t` 也不可以被解引用，因为 MMU 会翻译所有内存引用。而对于`uintptr_t`，解引用需要先转换为 pointer 才行。

当 JOS 需要修改内存，但是只知道物理地址时，因为它**不能绕过虚拟物理地址转换**，因此需要先用`KADDR()`转换物理为虚拟地址。相反，可以用`PADDR()`转换虚拟为物理地址，当然，在 JOS 中，只需要减去`0xf0000000`即可。

## Reference counting

当多个不同的虚拟地址被映射到同一个物理页面上时，`PageInfo`使用`pp_ref`来计算引用的个数。也就是说，当这个值为 0 时，对应的物理页面才能被释放，此时没有任何虚拟地址引用这个物理页面。值得注意的是，当我们使用`page_alloc`时，因为返回的`pp_ref`固定为 0，需要后续加1。

This count should equal to the number of times the physical page appears below `UTOP` in all page tables (the mappings above UTOP are mostly set up at boot time by the kernel and should never be freed, so there’s no need to reference count them).

## Page Table Management

接下来将：

1. 插入与删除线性与物理地址的映射关系。
2. 创建页表。

接下来需要做`pgdir_walk`。贴两张图以便理解：

![image](/notes-assets/5f133d92/image-20231030101759924.png)
![image](/notes-assets/5f133d92/image-20231030101807653.png)

- `PTE_ADDR()`将 page frame 地址转换为物理地址。
- `PDX()`计算 page directory index
- `PTX()`计算 page table index。
- `KADDR()`转换物理地址为虚拟地址。

```c
// 计算 page table 的偏移量
uint32_t ptindex = PTX(va);
// 根据 page dir 的 index，得到对应 page dir 的指针。
pde_t * pdp = &pgdir[PDX(va)];
// 判断对应 page 是否存在。这里和后文的 PTE_P | PTE_U | PTE_W 均为权限判断相关。
if (!pdp & PTE_P) {
	// 尝试新建一个page，如果不允许或者不成功，则返回 NULL。
	if (!create) return NULL;
	struct PageInfo * pi = page_alloc(ALLOC_ZERO);
	if (!pi) return NULL;
	// 根据前文所述，因为 page_alloc 返回的 ref 固定为 0，需要加 1。
	pi->pp_ref = 1;
	*pdp = page2pa(pi) | PTE_P | PTE_U | PTE_W;
}
// 根据 page dir 的地址得到 page table  entry 的地址，最后加上偏移量，得到指针。注意我们最后需要返回一个虚拟地址。
pte_t * pt = KADDR( PTE_ADDR( *pdp ) );
return pt + ptindex;
```

来看后面一个方程`boot_map_region`，需要将连续的虚拟页映射到连续的物理页，因此有：

```c
// 遍历所有页。
// 获得一个 page table 的指针并检查是否合法。
pte_t * ptpointer = NULL;
for (size_t i=0; i < size/PGSIZE; i++, va+=PGSIZE, pa+=PGSIZE) {
	ptpointer = pgdir_walk(pgdir, (void *)va, 1);
	if (ptpointer == NULL) {
		panic("boot_map_region: page pointer equal null");
	}
	*ptpointer = pa | perm | PTE_P; // 判断权限部分。
}
```

接下来需要做的是查询，找到对应虚拟地址的 PageInfo 地址：

```c
// 获得虚拟地址，注意不需要新建。
pte_t * pt_va = pgdir_walk(pgdir, va, 0);
// 检查合法性并存储
if (pt_va == NULL || !(*pt_va & PTE_P)) return NULL;
if (pte_store != 0) *pte_store = pt_va;
// 返回虚拟地址。
return pa2page(PADDR(*pt_va));
```

之后是取消映射，大体和前面说的差不多：

```c
// 获得指针
pte_t * pt_va = NULL;
struct PageInfo * pi = page_lookup(pgdir, va, &pt_va);

// 按照提示说的做
if (pi == NULL || (*pt_va & PTE_P) == 0) return ;
page_decref(pi);
*pt_va = 0;
tlb_invalidate(pgdir, va);
```

下一个是插入，只有一个难点，就是注释中所说的 corner case。

```c
// 获得对应指针，如果需要，可以创建。
pte_t * pt_pointer = pgdir_walk(pgdir, va, 1);

if (pt_pointer == NULL) return -E_NO_MEM;
// 这里提前加一的目的是避免 corner case，当 ppref 为 1 时，直接 remove 将会释放内存。而此时 ref 的值永远大于等于 2，因此内存永不会释放。
pp->pp_ref++;
if (*pt_pointer & PTE_P) page_remove(pgdir, va);
*pt_pointer = page2pa(pp) | perm | PTE_P;
return 0;
```

# Part 3: Kernel Address Space

JOS 将处理器的 32bits 线性地址空间分为两部分，用户环境和内核环境。用户地址空间占据低地址的部分，而内核占据高的。而我们上一个 lab 需要给定一个高地址的缘故，则是因为内核的虚拟地址空间中需要有足够的空间来映射到其下方的用户环境。而两者的分界则是由`inc/memlayout.h`中的`ULIM`来决定的，它给内核大概留了 256M 的地址空间。

## Permissions and Fault Isolation

因为这种设计上的分隔，我们保证用户程序无法访问内核地址空间的方法就是页表中的访问权限位(Permission Bits)。否则一旦用户程序中的 bug 可以访问内核，可能造成内核崩溃。

| 内存地址     | 权限               | 用途                       |
| ------------ | ------------------ | -------------------------- |
| [0, UTOP]    | UWR                | 用户使用                   |
| [UTOP, ULIM] | Read only for both | 暴露只读内核数据结构给用户 |
| [ULIM, ...]  | Kernel             | 内核使用                   |

## Initializing the Kernel Address Space

现在我们需要设定的，就是 UTOP 之上的部分。

```c
boot_map_region(kern_pgdir, UPAGES, PTSIZE, PADDR(pages), PTE_U | PTE_P);
boot_map_region(kern_pgdir, KSTACKTOP-KSTKSIZE, KSTKSIZE, PADDR(bootstack), PTE_W | PTE_P);
boot_map_region(kern_pgdir, KERNBASE, -KERNBASE, 0, PTE_W | PTE_P);
```

### Q2

> What entries (rows) in the page directory have been filled in at this point? What addresses do they map and where do they point? In other words, fill out this table as much as possible:

|   |   |   |
|---|---|---|
|Entry|Base Virtual Address|Points to (logically)|
|1023|?|Page table for top 4MB of phys memory|
|1022|?|?|
|.|?|?|
|.|?|?|
|.|?|?|
|2|0x00800000|?|
|1|0x00400000|?|
|0|0x00000000|[see next question]|

Use `info pg` 输出 PDE 的结果，如下所示：

```txt
VPN range     Entry         Flags        Physical page
[ef000-ef3ff]  PDE[3bc]     -------UWP
  [ef000-ef3ff]  PTE[000-3ff] -------U-P 00119-00518
[ef400-ef7ff]  PDE[3bd]     -------U-P
  [ef7bc-ef7bc]  PTE[3bc]     -------UWP 003fd
  [ef7bd-ef7bd]  PTE[3bd]     -------U-P 00118
  [ef7bf-ef7bf]  PTE[3bf]     -------UWP 003fe
  [ef7c0-ef7df]  PTE[3c0-3df] ----A--UWP 003ff 003fc 003fb 003fa 003f9 003f8 ..
  [ef7e0-ef7ff]  PTE[3e0-3ff] -------UWP 003dd 003dc 003db 003da 003d9 003d8 ..
[efc00-effff]  PDE[3bf]     -------UWP
  [efff8-effff]  PTE[3f8-3ff] --------WP 0010d-00114
[f0000-f03ff]  PDE[3c0]     ----A--UWP
  [f0000-f0000]  PTE[000]     --------WP 00000
  [f0001-f009f]  PTE[001-09f] ---DA---WP 00001-0009f
  [f00a0-f00b7]  PTE[0a0-0b7] --------WP 000a0-000b7
  [f00b8-f00b8]  PTE[0b8]     ---DA---WP 000b8
  [f00b9-f00ff]  PTE[0b9-0ff] --------WP 000b9-000ff
  [f0100-f0105]  PTE[100-105] ----A---WP 00100-00105
  [f0106-f0113]  PTE[106-113] --------WP 00106-00113
  [f0114-f0114]  PTE[114]     ---DA---WP 00114
  [f0115-f0116]  PTE[115-116] --------WP 00115-00116
  [f0117-f0118]  PTE[117-118] ---DA---WP 00117-00118
  [f0119-f0119]  PTE[119]     ----A---WP 00119
  [f011a-f011a]  PTE[11a]     ---DA---WP 0011a
  [f011b-f0158]  PTE[11b-158] ----A---WP 0011b-00158
  [f0159-f03bd]  PTE[159-3bd] ---DA---WP 00159-003bd
  [f03be-f03ff]  PTE[3be-3ff] --------WP 003be-003ff
[f0400-f7fff]  PDE[3c1-3df] ----A--UWP
  [f0400-f7fff]  PTE[000-3ff] ---DA---WP 00400-07fff
[f8000-fffff]  PDE[3e0-3ff] -------UWP
  [f8000-fffff]  PTE[000-3ff] --------WP 08000-0ffff
```

| entry | base virtual address | points to         |
| ----- | -------------------- | ----------------- |
| 1023  | 0xffc00000           | page table last   |
| ...   | ...                  | ...               |
| 992   | 0xf8000000           | page table        |
| ...   | ...                  | ...               |
| 961   | 0xf0400000           | page table second |
| 960   | 0xf0000000           | page table first  |
| 959   | 0xefc00000           | bookstack         |
| 957   | 0xef400000           | kern page dir     |
| 956   | 0xef000000           | page structure    |
| ...   | ...                  | ...               |
| 1     | 0x00400000           | unmapped          |
| 0     | 0x00000000           | unmapped          |

### Q3

> We have placed the kernel and user environment in the same address space. Why will user programs not be able to read or write the kernel’s memory? What specific mechanisms protect the kernel memory?

### Q4

> What is the maximum amount of physical memory that this operating system can support? Why?

### Q5

> How much space overhead is there for managing memory, if we actually had the maximum amount of physical memory? How is this overhead broken down?

### Q6

> Revisit the page table setup in `kern/entry.S` and `kern/entrypgdir.c`. Immediately after we turn on paging, EIP is still a low number (a little over 1MB). At what point do we transition to running at an EIP above KERNBASE? What makes it possible for us to continue executing at a low EIP between when we enable paging and when we begin running at an EIP above KERNBASE? Why is this transition necessary?

## Address Space Layout Alternatives

