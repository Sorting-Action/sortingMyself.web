---
id: 50e835e4
title: "DAC Divide and Conquer in Video Anomaly Detection A Comprehensive Review and New Approach"
slug: dac-divide-and-conquer-in-video-anomaly-detection-a-comprehensive-review-and-new-approach
tags: []
draft: false
created: 2024-04-10
---
[[PDF\] Divide and Conquer in Video Anomaly Detection: A Comprehensive Review and New Approach-论文阅读讨论-ReadPaper - 轻松读论文 | 专业翻译 | 一键引文 | 图表同屏](https://readpaper.com/paper/4804612968612364289)

[XiaoJian923/Divide-and-Conquer (github.com)](https://github.com/XiaoJian923/Divide-and-Conquer)

# 综合

# 一

分治：对子问题求解：时间+空间：多种模态，每个模态视为一个子问题，多模态融合求解

人体框架+视频数据分析

# 二

VAD也是多种模态，但是对每种模态的利用单一。需要更精细的利用

![image-20240409162111482](/notes-assets/50e835e4/image-20240409162111482.png)

## 方法

两个子问题

1. 人体骨骼：STG-NF
	- AlphaPose 提取骨骼数据；OSNet获得骨骼运动序列
	- STG-NF建模骨骼序列，给出似然分数
2. 图像数据：Jigsaw：时空拼图自监督学习
	- 时空立方体：帧级对象检测=》固定大小，时间维度堆叠=》时空立方体
	- 解决拼图：时间/空间维度通过全卷积重排序
	- 选择最小的异常分数

## 实验

在除了shanghaitech以外的数据集上，表现不好

因为单模态没有采集特定数据集上的关键数据

![image-20240409172940278](/notes-assets/50e835e4/image-20240409172940278.png)

- 过于依赖骨骼数据：权重问题
- 密集场景不方便骨骼数据追踪
- 模型技术和分治策略需要优化
- STG-NF无法对人类的异常检测不到位