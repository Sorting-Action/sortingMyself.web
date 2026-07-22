---
id: 9d7ba630
title: "ResNet"
slug: resnet
tags: []
draft: false
created: 2024-04-04
---
[Deep Residual Learning for Image Recognition (arxiv.org)](https://arxiv.org/abs/1512.03385)

[Deep Residual Learning for Image Recognition-ReadPaper](https://readpaper.com/paper/2949650786)

# 总结



# 一

问题：深度神经网络难以训练

方法：残差模块

ImageNet 152层深

退化现象：更深的网络上面，没法训练

![退化](/notes-assets/9d7ba630/b4cab4ca09e53763d13eb6541fcb2211_0_Figure_1.png)

残差的作用：

![对比](/notes-assets/9d7ba630/b4cab4ca09e53763d13eb6541fcb2211_4_Figure_4.png)

# 二

随着网络的变深，梯度爆炸或者消失，一般初始化权重的时候注意，或者中间加正则。

上面的方法能收敛，但是性能差。这不是过拟合，因为训练误差也变高了。

深度网络中，无法达到恒等变换（identity mapping），SGD找不到好的解。

残差模块：改变优化的目标

- 学习的是$H(x)$
- 新加的层学习$F(x)=H(x)-x$
- 只学习学到的东西和真实的东西之间的残差
- 学到的东西是x，真实的东西是H(x)
- 最后的输出是$F(x)+x$

![残差模块](/notes-assets/9d7ba630/b4cab4ca09e53763d13eb6541fcb2211_1_Figure_2.png)

- ResNet一般高宽减半，深度翻倍

## 实验

![img](/notes-assets/9d7ba630/b4cab4ca09e53763d13eb6541fcb2211_4_Table_1.png)

架构，每个卷积有多少层，是可以调的

34-50层的时候没有翻倍，做了特殊架构

![对比](/notes-assets/9d7ba630/b4cab4ca09e53763d13eb6541fcb2211_4_Figure_4-1712145000561-15.png)

- 一开始训练的误差比较高，因为用了数据增强，噪音大
- 误差骤降的地方是调了学习率
	- 现在大家一般不跳了
	- 如果跳的太早，容易收敛无力
	- 数据上宏观无法判断是否降的早
- 残差链接加速收敛
- 输入输出不一样的时候，如何作残差链接？
	- 两种方法：填 0、作投影、全部投影（一样的时候也做）
	- 填 0 简单，效果不好；做投影计算量大，但效果好
	- 因此：在输入输出不同的时候做投影，用$1\times1$​的卷积作
- ResNet 就是为 SGD 提供了梯度。从数学的角度解释：
	- $\frac{\partial f(g(x))}{\partial x} · \frac{\partial g(x)}{\partial x} + \frac{\partial g(x)}{\partial x}$ 深度变大会导致左边变小，但是右边残差是不会的，因此不管左边多小，右边都能继续。

- SGD 的精髓就是一直有梯度，梯度够大，一直跑得动，反正一直有噪音。如果停下来了，就没了。收敛是没意义的，只是跑不动了（只能在局部优化了）
- 在小数据集上的过拟合不明显：模型内在的复杂度不高，虽然层数很深。
	- 模型复杂度：能更方便的找到一个不那么复杂的模型去拟合数据
- gradient boosting 在数据标号上面作 residue，这里在特征层面作 residue。

