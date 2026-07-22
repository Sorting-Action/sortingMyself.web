---
id: f07dd72f
title: "Summary"
slug: summary
tags: []
draft: false
created: 2024-04-04
---
异常检测问题

针对异常的检测，三步走

1. 分类
2. 定位
3. 分割（像素）

# 背景

异常：异于一般图像的部分，经验问题。

点异常、上下文异常、集群异常

衍生出的特点：

1. 负样本数量少
2. 未知性大：异常类型多（三种）、细分种类多

遇到的难点：（加上上面两个）

3. 微弱异常的定位
4. 工业实时性

# 数据集

| 名称                                                                                            | 模型                                            | 链接                                                                                                                                                                                        | 数据类型 | 特点                 |
| --------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------ |
| Customizing Visual-Language Foundation Models for Multi-modal Anomaly Detection and Reasoning | Customizing Visual-Language Foundation Models | [Xiaohao-Xu/Customizable-VLM: Customizing Visual-Language Foundation Models for Multi-modal Anomaly Detection and Reasoning (github.com)](https://github.com/Xiaohao-Xu/Customizable-VLM) | 通用   | 通用、多模态、语言模型        |
|                                                                                               | SimpleNet                                     |                                                                                                                                                                                           | 工业   | 无监督、推理速度快、精度高、生成异常 |
|                                                                                               | PatchCore                                     |                                                                                                                                                                                           | 工业   | SPADE+PaDiM        |

# 评价标准

# 解决方案

## SimpleNet

总体是无监督的方法，使用合成和嵌入的方式。

1. 使用 ImageNet 上面训练的 WideResnet50 提取特征
2. 单层全连接特征适配器：调整数据集分布
3. 异常生成器：随机高斯噪点+原始图像
4. 分类器：正态性评分器，2层多层感知器

## PatchCore
