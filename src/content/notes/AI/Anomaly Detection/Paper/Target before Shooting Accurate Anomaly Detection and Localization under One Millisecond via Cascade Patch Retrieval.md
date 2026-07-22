---
id: 2e43742c
title: "Target before Shooting Accurate Anomaly Detection and Localization under One Millisecond via Cascade Patch Retrieval"
slug: target-before-shooting-accurate-anomaly-detection-and-localization-under-one-millisecond-via-cascade-patch-retrieval
tags: []
draft: false
created: 2024-04-10
---
[[PDF\] Target before Shooting: Accurate Anomaly Detection and Localization under One Millisecond via Cascade Patch Retrieval-论文阅读讨论-ReadPaper - 轻松读论文 | 专业翻译 | 一键引文 | 图表同屏](https://readpaper.com/paper/4789030552489426945)

[flyinghu123/CPR: The implement for paper : "Target before Shooting: Accurate Anomaly Detection and Localization under One Millisecond via Cascade Patch Retrieval" (github.com)](https://github.com/flyinghu123/cpr)

# 总结

架构

- 级联检索：先快速确定一个大范围，再仔细找：速度快、准确率高
- 对比学习：拉开不同个体的距离，拉进类似个体的具体：图文无监督、半监督学习
	- 使用对比损失
- Foreground Filter：排除背景干扰

训练

- 学习机器码而不是实值，使用hash加速

# 一

级联补丁检索：由粗到细检索样本的最近邻居（直方图--》精心训练的局部变量）

![image-20240408092841703](/notes-assets/2e43742c/image-20240408092841703.png)

进步：

- 参考数据集的选择和度量特征的学习
- hash加速

![image-20240408093800930](/notes-assets/2e43742c/image-20240408093800930.png)

架构

- 通过global找出的相似图片找大体轮廓
- local做卷积
- foreground filter匹配出具体的异常

分割方法GT很精确

# 二

![image-20240408092841703](/notes-assets/2e43742c/image-20240408092841703.png)

- 级联检索策略：高召回率
- 小样本导致的过拟合
	- 定制对比损失
	- 保守学习策略
- 智能简化后提高FPS

## 相关工作

### Patch Matching

coreset降维+Memory Bank

### 图像检索

一般都在找更好的语义特征

在大型数据集上学习机器码而不是实值，使用hash加速检索。

[[PDF\] Supervised Learning of Semantics-Preserving Hash via Deep Convolutional Neural Networks-论文阅读讨论-ReadPaper - 轻松读论文 | 专业翻译 | 一键引文 | 图表同屏](https://readpaper.com/paper/2586937979)

为什么使用级联检索？

- 图像检索做的最好的是rerank
- 先找top-k，然后再重排序

## Method

四个子网络

- DenseNet201 backbone
- Global Retrieval Branch
	- 基于统计的特征生成、K-means聚类
	- 将测试特征分成不同子网络，用类似词袋的方法做特征提取，Kullback-Leibler散度排序
- Local Retrieval Branch
	- 四个卷积通道分别处理，最后融合
	- 对比损失
	- 训练
		- 随机找查询和参考图像；随机生成缺陷图像
		- 特征张量扁平化
		- 对三种特征图对进行采样
- Foreground Estimation Branch：去除背景干扰
	- 对选定的深度特征做伪标签

![image-20240408111814679](/notes-assets/2e43742c/image-20240408111814679.png)

训练

- 320 × 320图像
- 两个backbone，只有local都用，global和foreground只用1
- k=10
- sub tensor=5
- AdamW
- lr=0.001
- wd=0.01

场景

- 无监督：合成缺陷
- 拓展异常：[Prototypical Residual Networks for Anomaly Detection and Localization-论文阅读讨论-ReadPaper - 轻松读论文 | 专业翻译 | 一键引文 | 图表同屏](https://readpaper.com/paper/4310827333)

结构不变，减小参数