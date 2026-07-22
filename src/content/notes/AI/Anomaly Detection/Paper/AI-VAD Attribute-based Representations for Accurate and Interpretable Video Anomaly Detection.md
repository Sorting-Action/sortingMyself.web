---
id: 3c7b5975
title: "AI-VAD Attribute-based Representations for Accurate and Interpretable Video Anomaly Detection"
slug: ai-vad-attribute-based-representations-for-accurate-and-interpretable-video-anomaly-detection
tags: []
draft: false
created: 2024-04-10
---
[[PDF\] Attribute-based Representations for Accurate and Interpretable Video Anomaly Detection-论文阅读讨论-ReadPaper - 轻松读论文 | 专业翻译 | 一键引文 | 图表同屏](https://readpaper.com/paper/4696233547535499265)

[talreiss/Accurate-Interpretable-VAD: Attribute-based Representations for Accurate and Interpretable Video Anomaly Detection (github.com)](https://github.com/talreiss/Accurate-Interpretable-VAD)

[openvinotoolkit/anomalib: An anomaly detection library comprising state-of-the-art algorithms and features such as experiment management, hyper-parameter optimization, and edge inference. (github.com)](https://github.com/openvinotoolkit/anomalib)

# 综合

架构

- 速度：低维数据：用光流图高斯混合模型算
- 姿态：高维：基于对象建模，AlphaPose提取姿态
- 深度：预训练模型，关注速度和姿态之外的残差，高维
	- 高维数据用KNN表示好，k-means更快
	- 使用图像编码器；视频的泛化能力不够
- 校准：上面三个minmax

基于速度和姿态的解释性

# 一

基于属性的表征

速度和姿态两个维度

基于密度计算异常分数

![image-20240409094417752](/notes-assets/3c7b5975/image-20240409094417752.png)

1. 提取光流图和边界框
2. 切分图像

## 二

以前的方法

- 先验知识+自监督学习
- 特征提取+标准密度估计

问题在于可解释性

利用**速度和姿态**的可解释性

## 相关研究

传统：手工特征提取：光流直方图

深度学习：重构、自监督辅助任务、检测对象（而不是帧）

## 方法

预处理

- 光流图
- 对象检测

特征提取

- 速度：异常相关属性：帧级光流图
- 姿势：异常相关：归一化位置大小不变，AlphaPose提取动作
- 隐式深度：其他未表示的残差属性：预训练CLIP编码器

密度估计

- 速度（低维）：高斯混合模型
- 姿态深度（高维）：用kNN表示很好
- 校准：min-max归一化

## 实现

- 置信度：.5/.8
- ResNet50 Mask-RCNN on MS-COCO
- FlowNet2.0
- AlphaPose

## 讨论

- k-means取代kNN加速
- 预训练的数据集拥有速度和姿态之外的属性，可互相补充
- 图像而不是视频编码器：视频编码器泛化能力不够