---
id: a8f3c2e1
title: 用 epoll 实现高并发服务器
slug: epoll-server
tags:
  - epoll
  - IO多路复用
  - 高并发
draft: false
created: 2026-07-22
---

## 为什么需要 epoll

`select` 和 `poll` 每次调用都要把全部 fd 集合从用户态拷贝到内核态，且返回后需要 O(n) 遍历找出就绪的 fd。epoll 通过两个设计解决了这个问题：

1. **内核维护就绪列表**：`epoll_ctl` 注册的 fd 由内核持续监听，就绪时加入就绪队列
2. **只返回就绪 fd**：`epoll_wait` 只拷贝就绪的那部分，活跃连接越少优势越大

## 最小示例

```c
int epfd = epoll_create1(0);

struct epoll_event ev = { .events = EPOLLIN, .data.fd = listen_fd };
epoll_ctl(epfd, EPOLL_CTL_ADD, listen_fd, &ev);

struct epoll_event events[MAX_EVENTS];
while (1) {
    int n = epoll_wait(epfd, events, MAX_EVENTS, -1);
    for (int i = 0; i < n; i++) {
        if (events[i].data.fd == listen_fd) {
            // accept 新连接，并注册到 epoll
        } else {
            // 处理已连接 fd 的读事件
        }
    }
}
```

## 边缘触发 vs 水平触发

- **LT（默认）**：fd 可读时重复通知，编程简单，可以和阻塞 IO 混用
- **ET（`EPOLLET`）**：只在状态变化时通知一次，必须配合非阻塞 IO 并循环读到 `EAGAIN`，否则丢事件

## 待深入

- [ ] epoll 内核实现：红黑树 + 就绪链表的具体分工
- [ ] `EPOLLONESHOT` 在多线程下的使用场景
