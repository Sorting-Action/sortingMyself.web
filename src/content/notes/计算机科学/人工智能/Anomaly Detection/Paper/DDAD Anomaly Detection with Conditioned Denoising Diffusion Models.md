---
id: e0512135
title: "DDAD Anomaly Detection with Conditioned Denoising Diffusion Models"
slug: ddad-anomaly-detection-with-conditioned-denoising-diffusion-models
tags: []
draft: false
created: 2024-04-10
---
[[PDF\] Anomaly Detection with Conditioned Denoising Diffusion Models-论文阅读讨论-ReadPaper - 轻松读论文 | 专业翻译 | 一键引文 | 图表同屏](https://readpaper.com/paper/1804251601890458624)

[arimousa/DDAD (github.com)](https://github.com/arimousa/DDAD)

# 总结

# 一

基于重构的检测，去噪扩散

![image-20240408151834551](/notes-assets/e0512135/image-20240408151834551.png)

- 预训练的网络是U-Net[^1]

- 像素和特征两种比较方式

[^1]: U-Net 是一种流行的卷积神经网络（Convolutional Neural Network, CNN）架构，主要用于生物医学图像分割任务。U-Net以其独特的“U”形结构而得名，这种结构使得网络能够在不同的尺度上捕捉图像特征，非常适合于需要高分辨率输出的图像分割任务。**“U”形结构**：U-Net的网络结构由一个收缩路径（contracting path）和一个扩张路径（expanding path）组成，形状类似于字母“U”。收缩路径用于特征提取和下采样，扩张路径用于特征上采样和精细分割。**对称性和跳跃连接**：U-Net在收缩路径和扩张路径之间具有对称性，每个下采样的步骤在扩张路径中都有一个对应的上采样步骤。此外，U-Net使用跳跃连接（skip connections）将下采样路径中的特征图与上采样路径中的特征图连接起来，这有助于保留细节信息并提高分割的准确性。**少量训练数据的有效性**：U-Net特别适用于训练数据有限的情况。通过使用少量的标记图像进行训练，U-Net仍然能够提供高分辨率的分割结果。**应用广泛**：虽然U-Net最初是为了生物医学图像分割而设计的，但它的架构和概念也被广泛应用于其他领域，如自然图像处理、卫星图像分析等。

# 二

## 方法

重构

- 较早的步骤去抽象图像，较晚的步骤看精细度。重建的信息依赖前面，有信噪比

特征域迁移方法

- 从几乎相同的图像中收敛不同的提取层：忽略称名数据，专注于学习目标domain