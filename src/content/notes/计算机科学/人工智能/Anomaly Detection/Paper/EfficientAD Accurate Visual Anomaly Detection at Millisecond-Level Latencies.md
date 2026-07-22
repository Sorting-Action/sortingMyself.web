---
id: 51155c81
title: "EfficientAD Accurate Visual Anomaly Detection at Millisecond-Level Latencies"
slug: efficientad-accurate-visual-anomaly-detection-at-millisecond-level-latencies
tags: []
draft: false
created: 2024-04-10
---
[[PDF\] EfficientAD: Accurate Visual Anomaly Detection at Millisecond-Level Latencies-论文阅读讨论-ReadPaper - 轻松读论文 | 专业翻译 | 一键引文 | 图表同屏](https://readpaper.com/paper/4738277069499154433#ref)

[openvinotoolkit/anomalib: An anomaly detection library comprising state-of-the-art algorithms and features such as experiment management, hyper-parameter optimization, and edge inference. (github.com)](https://github.com/openvinotoolkit/anomalib)

# 综合

# 一

师生模型[^1]

- 学生学习正常情况，测试时看能否匹配
- loss是两个网络的差距：减少训练时间

自编码器全局分析：检查逻辑性错误

PDN[^2]效果很好

学生网络背景模仿好，专注于不同的地方。

自动编码器检测逻辑异常、师生模型看结构异常。细粒度的逻辑异常是问题。

[^1]: 师生模型（Teacher-Student Model）是一种机器学习策略，主要用于知识蒸馏（Knowledge Distillation）的过程中。这种模型通常包含两部分：一个大型、复杂的教师网络（Teacher Network）和一个较小、较简单的学生网络（Student Network）。教师网络通常是预先训练好的，拥有较高的准确率和复杂的结构，而学生网络则试图模仿教师网络的行为和性能。
[^2]: Patch Description Network (PDN) 是一种在计算机视觉领域使用的神经网络架构，它专注于处理和理解图像中的局部区域或“patches”。PDN 的核心思想是将图像分割成多个小块（patches），然后分别对这些小块进行处理和分析。这种方法的优点在于它能够捕捉到图像中的局部特征和细节，这对于许多视觉任务（如物体检测、图像分类和图像分割）非常重要。
