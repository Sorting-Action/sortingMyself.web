---
id: 6da8005a
title: "SimpleNet A Simple Network for Image Anomaly Detection and Localization"
slug: simplenet-a-simple-network-for-image-anomaly-detection-and-localization
tags: []
draft: false
created: 2024-04-04
---
[中文]([CVPR2023:SimpleNet:一个简单的图像异常检测和定位网络 - 水木清扬 - 博客园 (cnblogs.com)](https://www.cnblogs.com/shuimuqingyang/p/17721580.html))
[SimpleNet: A Simple Network for Image Anomaly Detection and Localization](https://readpaper.com/paper/4738279512727371777)
[DonaldRR/SimpleNet (github.com)](https://github.com/DonaldRR/SimpleNet)

# 综合

架构
- 全连接层作为适配器转移目标域
- 鉴别器简单效率高
	- 复杂降低性能：可能过拟合，降低泛化
- 生成器：在特征空间内加噪音；AlexNet 卷积的最后一层特征空间内的语义表示好

参数
- 生成器噪音尺度
	- 大尺度导致决策界宽松，高假阴性
	- 小尺度泛化性差

训练
- 推理时不适用特征生成器，剩下的可以堆到端到端网络中

实现
- 如何做适配？
# 一

标题：检测和定位

## ABS

架构
1. 特征提取器：生成局部特征
2. 特征适配器：转移目标域
3. 生成器：添加随机高斯噪声生成异常图片
4. 鉴别器：区分

所得
1. 使用适配器避免域偏差
2. 在特征空间而不是图像空间中合成异常，因为在图像空间中共性不多。
3. 简单鉴别器效率高、实用

优势
1. 总体良好
2. 快
3. 单类新颖性任务优势

## 结论

简单易用工业适配

## 图表

![image](/notes-assets/6da8005a/image-20240401093543186.png)
架构

![image](/notes-assets/6da8005a/image-20240401100640837.png)
算法的伪代码

# 二

无监督：重建、综合、嵌入。三种方法

- 重建：会不会把重构误差当做异常
	- 异常和正常如果有相同的组成模式；或者解码器太强
- 合成：合成异常，但不够真实，导致正态特征空间边界松散
- 嵌入：性能好，但是特定领域是否适用
	- PaDiM：预训练模型，多元高斯分布嵌入异常
	- PatchCore：最大限度代表补丁特征的内存库

推理时不适用特征生成器，剩下的可以堆到端到端网络中。

## 训练

数据集
- MVTec AD：裁剪为256 or 224，没有增强
- 新颖性（通用性）：CIFAR10

参数
- 实验中使用的所有骨干网均使用ImageNet进行预训练，当骨干网为ResNet-like架构时，用于特征提取器。默认情况下，我们的实现使用WideResnet50作为主干，并且来自特征提取器的特征维度设置为1536。后面的特性适配器本质上是一个完全连接的层，没有偏置，适配器中FC层的输入和输出特征的尺寸是相同的。异常特征生成器添加id。高斯噪声N (0， σ2)，σ默认设置为0.015。随后的鉴别器由线性层、批量归一化层、relu(0.2斜率)和线性层组成。式7中，th+和th -均设为0.5。使用Adam优化器，将特征适配器和鉴别器的学习率分别设置为0.0001和0.0002，权重衰减为0.00001。每个数据集的训练epoch设置为160,batchsize为4。
- 生成器噪声尺度
	- 大尺度导致决策界宽松，高假阴性
	- 小尺度泛化性差

架构
- 复杂特征适配器降低性能：可能过拟合，降低泛化
- 简单鉴别器加速推理