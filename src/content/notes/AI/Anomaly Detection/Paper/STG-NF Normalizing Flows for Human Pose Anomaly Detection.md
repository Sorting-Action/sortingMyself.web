---
id: d35e5e4e
title: "STG-NF Normalizing Flows for Human Pose Anomaly Detection"
slug: stg-nf-normalizing-flows-for-human-pose-anomaly-detection
tags: []
draft: false
created: 2024-04-26
---
[[PDF\] Normalizing Flows for Human Pose Anomaly Detection-论文阅读讨论-ReadPaper - 轻松读论文 | 专业翻译 | 一键引文 | 图表同屏](https://readpaper.com/paper/4692609442210922497)

[orhir/STG-NF: Normalizing Flows for Human Pose Anomaly Detection [ICCV 2023\] (github.com)](https://github.com/orhir/STG-NF)

# 综合

# 一

人体姿态异常检测、轻量模型

人体姿态的时空图表示

缺陷

1. 和物体相关的无法识别：单纯的物体，人拿着异物
2. 摄像头角度、画面质量低导致的识别错误

# 二

## 导论

基于表示和语义，重构有误差

多模态性能好，但是计算量大

有高度语义的时空图卷积块。归一化流在高度语义表示上训练很好，但是在像素数据上表现不佳。

可以无监督也可以监督，在监督时，为已知的异常样本分配低概率；无监督只喂正常数据

![image-20240411100132127](/notes-assets/d35e5e4e/image-20240411100132127.png)