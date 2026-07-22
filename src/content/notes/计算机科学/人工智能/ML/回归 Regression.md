---
id: bf225077
title: "回归 Regression"
slug: regression
tags: []
draft: false
created: 2024-04-04
---

# 线性回归

## Introduction

回归是监督学习的一种，其目标是根据输入预测连续的数值（continuous numerical values）。它将输入特征和输出值的关系用直线或者曲线的形式概括。

## 线性回归

顾名思义，这里的线性就是说明预测是基于输入特征的线性组合的。比如下面房屋大小和面积的关系：

$$ y = w\cdot s + b$$

![image](/notes-assets/bf225077/image-20231114130522730.png)

而一般的，我们有：

$$ y = w_1 \cdot s + w_2 \cdot r + b$$

这里的 $w$ 是权重，而 $b$ 则是截距项（intercept term）。

## 增强空间（Augmented Space）

和感知器算法中增强空间一样的，我们有：

$$
\begin{align}
y &= w_1 \cdot s + w_2 \cdot r + w_0 \cdot 1\\
y &= (w_0, w_1, w_2) \cdot (1, s, r)\\
\end{align}
$$

因此，假设有 $d$ 个输入特征，在 $d+1$ 空间中，我们有：

$$
\begin{align}
\mathbf{x} &= (x_0, x_1, x_2, \ldots, x_d)\\
\mathbf{w} &= (w_0, w_1, w_2, \ldots, w_d)
\end{align}
$$

而最后，我们可以通过下式预测：

$$
\begin{align}
\hat{y} &= \mathbf{w} \cdot \mathbf{x}\\
f_{\mathbf{w}}(\mathbf{x}) &= \mathbf{w} \cdot \mathbf{x}\\
\end{align}
$$

# 正则化 Regularization

## 成本函数 Cost Function

根据上文，回归的目的是使预测值和实际值之间的距离最小化，那么必须有公式描述其距离，而这就是成本函数：

在训练数据集 $D = \{(\mathbf{x}^{(i)}, y^{(i)}) \mid i = 1 \ldots |D|\}$ ，以及其中的输入特征 $\mathbf{x}=(1, x_1, \ldots, x_d)$ 和标签 $y \in \mathbb{R}$。我们的目标是让 $f(x)$ 接近 $y$。因此，成本函数为：

$$J(\mathbf{w}) = \frac{1}{2}\sum_{(\mathbf{x}, y)\in D} \big(f_{\mathbf{w}}(\mathbf{x})-y\big)^2$$

## 过拟合和欠拟合

分别发生在模型太过复杂或者太过简单的情况下。因为模型太过简单，无法捕获潜在的规律，因此不能拟合。而如果模型太过复杂，可以完美的嵌合输入的特征，可能对新数据表现不佳。

## 正则化

是一种防止过拟合的方法。原理是向函数试图最小化的成本函数中添加基于模型中权重大小的惩罚项，以此鼓励小权重的使用，使模型更加简单。

而常用的正则化有两种，分别是 $l_1$ 和 $l_2$。公式如下，$\lambda$ 为正则化强度（regularization strength）超参数，用于确定惩罚项的权重。

$$
\begin{align}
J(\mathbf{w}) = \frac{1}{2}\sum_{(\mathbf{x}, y)\in D} \big(f_{\mathbf{w}}(\mathbf{x})-y\big)^2 + \lambda\Vert\mathbf{w}\Vert_2^2\\
J(\mathbf{w}) = \frac{1}{2}\sum_{(\mathbf{x}, y)\in D} \big(f_{\mathbf{w}}(\mathbf{x})-y\big)^2 + \lambda\Vert\mathbf{w}\Vert_1
\end{align}
$$

# 梯度下降 Gradient Descent

## 迭代优化

一般的，我们先得到一系列的 $J(\mathbf{w})$ ，然后找到最大的那一个 $\min_{\mathbf{w}}~J(\mathbf{w})$ 。对于一系列答案 $\mathbf{w}^{(0)}, \mathbf{w}^{(1)}, ..., \mathbf{w}^{(k)}, ...$ ，我们希望 $J(\mathbf{w}) \rightarrow J(\mathbf{w}^\star) \rightarrow p^\star$ 当 $k \rightarrow \infty$ ；而 $\mathbf{w}^\star$ 是最佳答案，而 $p^\star$ 是最佳值。

## 梯度下降

梯度下降是最受欢迎的线性回归迭代优化算法之一。其基本思想是沿着成本函数负梯度方向，也是成本函数下降最快的方向，来更新模型。以下面公式描述：

$$ \mathbf{w}' \leftarrow \mathbf{w} - \alpha \frac{\partial}{\partial \mathbf{w}} J(\mathbf{w})$$

$\alpha$ 是学习率（Learning rate），顾名思义，是学习步伐大小的程度。而下一步就是知道右边的偏导数项是什么，假设只有一个输入，我们有：

$$ \begin{aligned}
\frac{\partial}{\partial \mathbf{w}} J(\mathbf{w}) & =\frac{\partial}{\partial \mathbf{w}} \frac{1}{2}\big(f_{\mathbf{w}}(\mathbf{x})-y\big)^2 \\
& =2 \cdot \frac{1}{2}\big(f_{\mathbf{w}}(\mathbf{x})-y\big) \cdot \frac{\partial}{\partial \mathbf{w}}\big(f_{\mathbf{w}}(\mathbf{x})-y\big) \\
& =\big(\mathbf{w}\cdot \mathbf{x}-y\big) \cdot \frac{\partial}{\partial \mathbf{w}}\big(\mathbf{w}\cdot \mathbf{x} - y\big) \\
& =\left(\mathbf{w}\cdot \mathbf{x}-y\right) \mathbf{x}
\end{aligned}$$

因此，对于单一样例，我们有：

$$ \mathbf{w}' \leftarrow \mathbf{w} + \alpha (y - \mathbf{w}\cdot \mathbf{x})\mathbf{x}$$

这种更新规则叫做最小均方（LMS least mean squares），明显的，其中对应了欧几里得距离。而对多个样例，我们可以把他们加起来：

$$ \mathbf{w}' \leftarrow \mathbf{w} + \alpha \sum_{(\mathbf{x}, y)\in D} (y - \mathbf{w}\cdot \mathbf{x})\mathbf{x}$$

我们其实可以看到，最小均方的公式和感知器算法中的更新规律很像，只不过感知器算法是更新权重和特征的乘积，这里更新预测差和特征的乘积。

虽然一般梯度下降容易受到局部最小的影响，但由于成本函数是凸二次函数（convex），只有一个全局最优，因此只要学习率不是太大，算法总是会收敛到最小值。其几何空间形状和收敛过程可以参考下二图。

![image](/notes-assets/bf225077/image-20231115100338354.png)

![image](/notes-assets/bf225077/image-20231115100348490.png)

## 随机梯度下降 Stochastic Gradient Descent

在对大样本进行学习时，普通梯度下降需要扫描每一个样本，因此有不够高效的问题。而随机梯度下降先在数据集中随机选择样本，计算每一个样本后更新权重；因此在大数据集训练时，效率很高，会更快收敛。然而，因为它的更新相对噪音更多，因此也更难收敛。

$$
\mathbf{w}' \leftarrow \mathbf{w} + \alpha (y^{(i)} - \mathbf{w}\cdot \mathbf{x}^{(i)})\mathbf{x}^{(i)}
$$

## 小批量梯度下降 Mini-Batch Gradient Descent

小批量梯度下降算法融合了批量和随机两种梯度下降算法的优点：每次循环中，使用一个小批量的数据子集进行训练。

$$ \mathbf{w}' \leftarrow \mathbf{w} + \alpha \sum_{(\mathbf{x}, y)\in D_m} (y - \mathbf{w}\cdot \mathbf{x})\mathbf{x} $$

其中 $D_m$ 就是数据集 $D$ 的子集，而 $m$ 则是批量大小，重要的超参数。

在实践中，作为平衡了准确性和效率的小批量梯度下降常常作为首选，而超参数批量大小的选择至关重要。大批量注重准确性而牺牲效率；小批量则反之。

## 正则化梯度下降

在上文中，我们知道线性回归通常是有正则化的，而只要正则化项是可微的，就可以将其应用到梯度下降中，比如著名的岭回归，就是最小化成本函数与 l2 正则化的产物：

$$\mathbf{w}' \leftarrow \mathbf{w} + \alpha \sum_{(\mathbf{x}, y)\in D} (y - \mathbf{w}\cdot \mathbf{x})\mathbf{x} - \lambda \mathbf{w}$$

与前文相同，L2 的惩罚项可以防止过拟合。

# 正规方程 Norm Equation

是除了梯度下降以外的另一种最小化成本函数的方法，涉及到取成本函数对权重求导。

## 成本函数的矩阵表示

其输入可以表示为矩阵 X，标签为矩阵 y：

$$
\mathbf{X}=\left[\begin{array}{c}
-\left(\mathbf{x}^{(1)}\right)^\top- \\
-\left(\mathbf{x}^{(2)}\right)^\top- \\\vdots\\
-\left(\mathbf{x}^{(n)}\right)^\top-\end{array}\right]
$$

$$\mathbf{y}=\left[\begin{array}{c}y^{(1)} \\y^{(2)} \\\vdots \\y^{(n)}\end{array}\right]$$

因此，我们有：

$$ J(\mathbf{w}) = \frac{1}{2} \Vert \mathbf{y}-\mathbf{X} \mathbf{w}\Vert_2^2$$

## 正规方程

![image](/notes-assets/bf225077/image-20231115103240422.png)

## L2 正则

![image](/notes-assets/bf225077/image-20231115103310652.png)

## 比较

两种方法各有优劣。计算矩阵需要 $O(n^3)$ 时间复杂度和高额内存，而梯度下降所需内存甚少。但是，其性能常常依赖于超参数的选择，比如学习率和批量大小。具体还是根据情况来定。

# 非线性回归

线性回归难以描述非线性关系，同样的，在感知器算法中提到的特征图（Feature Map）可以帮助我们解决这个问题。而下面这个特征图几乎可以帮助我们生成所有单项式：

$$\mathbf{\Phi}(\mathbf{x})=\left[\begin{array}{c} 1 \\ x_1 \\ x_2 \\ x_1x_2 \\ x_1^2 \\ x_2^2 \\ \end{array}\right] \in \mathbb{R}^6 .$$

下面是一个例子：

![image](/notes-assets/bf225077/image-20231115104442126.png)

