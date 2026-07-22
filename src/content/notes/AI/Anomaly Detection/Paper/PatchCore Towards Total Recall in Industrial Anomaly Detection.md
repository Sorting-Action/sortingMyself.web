---
id: 849d6440
title: "PatchCore Towards Total Recall in Industrial Anomaly Detection"
slug: patchcore-towards-total-recall-in-industrial-anomaly-detection
tags: []
draft: false
created: 2024-04-04
---
# 一

问题：无监督学习的冷启动（特征域不适配）

使用最大表示记忆库(maximally representative memory bank)

架构：
![image](/notes-assets/849d6440/image-20240401135612425.png)

降采样
- coreset明显好
- 增加了分割的性能

内存池的算法：
![image](/notes-assets/849d6440/image-20240401140605133.png)

# 二

## 导论

PatchCore：
- 最大化测试时可用的称名信息
- 减少ImageNet偏置
- 高推理速度
- 贪婪coreset降维

## 相关工作

SPADE：包含特征结构的内存库

PaDiM：局部约束的特征袋方法，估计补丁级特征分布矩(均值和协方差)用于补丁级马氏距离度量

SPADE和PaDiM的结合更新作