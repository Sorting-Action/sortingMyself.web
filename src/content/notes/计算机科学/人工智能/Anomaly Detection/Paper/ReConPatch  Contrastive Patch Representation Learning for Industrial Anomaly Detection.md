---
id: 6ebc590c
title: "ReConPatch  Contrastive Patch Representation Learning for Industrial Anomaly Detection"
slug: reconpatch-contrastive-patch-representation-learning-for-industrial-anomaly-detection
tags: []
draft: false
created: 2024-04-07
---
[ReConPatch : Contrastive Patch Representation Learning for Industrial Anomaly Detection (readpaper.com)](https://readpaper.com/pdf-annotate/note?pdfId=4843335175202930689&noteId=2259356323009791488)

# 总结

结构

- 双层网络：师生模型
- 对比学习：使用两种相似性作为伪标签
	- 使用线性更新
	- 综合考虑每对之间的关系和两个特征组之间的关系（成对+上下文相似性）
	- （EMA）缓慢更新：使关系一致，网络稳定
- Memory Bank：存储正样本特征数据，快速检索

对比学习在无监督领域应用较多，用于缩小相似样本的距离，拉大不相似样本的距离，最后分类

# 一

预训练模型中提取的线性调制作为判别特征，学习面相目标的表示空间

对比表示学习收集和分发特征：

- 面相目标的
- 易分离的表示
- 使用成对和上下文两种相似性作为伪标签

架构：

![image-20240407162826969](/notes-assets/6ebc590c/image-20240407162826969.png)

上下两层：

- 上层：训练成对和上下文相似度
- 下层：表示学习

# 二

基于重构图片的方法：

- GANs或者AE
- 预训练模型-->迁移目标域

迁移目标域：

- 学生-教师模型：学生网络来再现教师输出(Uninformed Students: Student-Teacher Anomaly Detection With Discriminative Latent Embeddings)
- 预训练末尾加归一化流
- 我们不用数据增强，上面两个要

对比学习

- 名义实例内的建模变化方面存在弱点
- 使用特征之间的相似度作为伪标签
- 仅通过线性变换来表示，不训练整个网络

## 相关工作

- SVDD: Patch SVDD, Deep SVDD
- 重构：Auto-encoding
- GANs

- DifferNet：预训练特征和名义数据的双向映射
- CFLOW-AD：基于位置编码的条件归一化流：易受训练数据中异常值影响
- PatchCore
- PaDiM

## 方法

![image-20240407162826969](/notes-assets/6ebc590c/image-20240407162826969.png)

双层网络

- 批特征表示训练
	- 特征表示层+投影层
- 计算特征对的成对和上下文相似度
	- 成对：两个之间的关系
	- 上下文：+特征组之间的关系
	- 因为要考虑特征间关系，因此使用松弛对比损失
	- 用exponential moving average (EMA)缓慢更新，快速更新会导致关系不一致，网络不稳定
- 特征经过表示层=》降维=》memory bank

## 实验

### 实现细节

- WideResNet-50
- f 层输出：512，不是越多越好
- coreset降采样：1%
- 120epoch

