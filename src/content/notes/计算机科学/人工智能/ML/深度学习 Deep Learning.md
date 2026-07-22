---
id: 48b3e6f9
title: "深度学习 Deep Learning"
slug: deep-learning
tags: []
draft: false
created: 2024-04-04
---
# 多层神经网络 Multilayer Neural Network

多层神经网络，也叫人工或者深度神经网络，是之前单层感知器的推广。

## Multilayer Neural Network Architecture

是由多层的，层层之间相互连接的节点组成的。每个节点如同一个感知器，计算加权的输入的和，经过激活函数后输出，而节点一共分为三种，输入（输入层）、隐藏（输入和输出中间，在神经网络中被隐藏）、输出（输出层，最后一层）。而下图为一个前馈（feed-forward）神经网络。

![image](/notes-assets/48b3e6f9/image-20231128160645227.png)

## 神经元和激活函数 Neurons and Activation Functions

神经元就是神经网络中的一个节点，其作用如上文所说。而激活函数提供的非线性特性使其可以学习复杂关系。例如：

1. Sigmoid: $\sigma(x) = \frac{1}{1+e^{-x}}$, 输出为 0-1，常用于二元分类问题。
2. Hyperbolic Tangent (tanh): $tanh(x) = \frac{e^x-e^{-x}}{e^x+e^{-x}}$，输出为 -1-1，其分布中心为 0，可加速收敛。
3. Rectified Linear Unit (ReLU): $ReLU(x) = max(0, x)$，只输出正数。

![image](/notes-assets/48b3e6f9/image-20231128161738449.png)

## 正向传播 Forward Propagation

描述的是计算输出的过程。因为数据在神经网络中是层层计算的，每个神经元计算输入值并给出输出。

1. 在输入层，特征数等于节点数。
2. 在隐藏和输出层，计算上层给出输出的加权和并应用激活函数。

## 损失函数 Loss Function

和之前一样，用于衡量输出和真实输出之间的损失，我们的目标是将损失最小化。

1. MSE(Mean Squared Error)：用于回归任务，有一种 log 形式的演化，适合真实输出彼此差距大时。

$$ \ell(\mathbf{y}, \hat{\mathbf{y}}) = \frac{1}{N} \sum_{i=1}^N (y_i - \hat{y}_i)^2$$

2. 交叉熵损失（Cross-Entropy Loss）：用于分类任务。计算每个类别的负对数似然，而后将所有类别平均，数学表示为，$C$ 是类别的数量。

$$ \ell(\mathbf{y}, \hat{\mathbf{y}}) = -\sum_{i=1}^C y_i \log(\hat{y}_i)$$

## 反向传播 Back Propagation

正如其名，和正向传播不同的是，其中引入了权重的反向更新。在正向传播过程结束后，程序计算损失函数相对于某个权重的梯度，之后使用梯度反向更新网络中的权重参数。

1. 正向传播先行。
2. 输出层的每个神经元，计算损失对应其输出的梯度。
3. 隐藏层的每个神经元，使用链式法则计算损失对应其输出的梯度，以及为下一层的神经单元计算的梯度。
4. 使用计算后的梯度和学习率更新权重。

## 训练多层神经网络

1. 初始化权重和偏差
2. 正向传播计算输出
3. 用真结果计算损失
4. 反向传播计算梯度
5. 加学习率更新权重
6. 重复训练直至结束

## 过拟合和正则化 Overfitting and Regularization

过拟合说明神经网络学习到了数据中的噪音而不是潜在的模式，将会导致泛化性能的下降。这里介绍的正则方法有以下几种：

1. $l_1, l_2$ 正则化：通过添加一个惩罚项来鼓励小权重的使用，前文已经介绍过
2. Dropout：训练期间随机丢弃（将一部分神经元设置为 0），防止过于依赖某一个神经元，鼓励更稳健的表示。推理时，不丢弃但权重按照 dropout 率缩放。
3. 提前停止：训练时实时监控模型在验证数据集上的表现，如果有下降，则停止防止过拟合。

# NLP 词嵌入 Word Embeddings

词嵌入是单词的连续向量表示，体现了单词的词义、句法关系。

## 从 One-Hot 到连续表示

One-Hot 的表示法会给每一个词语编号，然后用 1 和 0 表示他们是否存在。但问题在于，这种方法不能表示词语的词义，需要使用连续向量表达一个词语。

![image](/notes-assets/48b3e6f9/image-20231129113116953.png)

## 词嵌入的特点

### 相似的词表达相近

我们常用余弦相似 (cosine similarity) 来表达两个单词（向量）之间的相似性。而含义相近的单词之间余弦相似度也高：

![image](/notes-assets/48b3e6f9/image-20231129113409839.png)

### 类比

同样的，词嵌入也能捕获类比关系。它们之间词义有类比关系，对应在几何空间中，则两组单词之间的位置关系相近。

![image](/notes-assets/48b3e6f9/image-20231129113718455.png)

### 可视化

使用 PCA 或者 t-SNE 可以将词嵌入投影到低维（一般是二维）空间中用以理解他们之间的关系。

![image](/notes-assets/48b3e6f9/image-20231129113905262.png)

## 模型与训练

### Word2Vec

不是一个而是一家族模型架构，用以学习大数据集的词嵌入。其中有两种方法，分别为连续词袋模型 (Continuous bag-of-words) 和 Continuous Skip-Gram 模型。

- CSG：根据一个单词预测上下文（之前和之后）。

$$ J(\mathbf{\theta}) =
\frac{1}{n}\sum_{t=1}^{n}\sum_{-m\leq j \leq m, j \neq 0} \log p(w_{t+j}
\mid w_t; \mathbf{\theta})$$ $$p(w_{t+j} \mid w_t; \mathbf{\theta}) =
\frac{\exp(\mathbf{v}_{w_{t+j}} \cdot \mathbf{v}_{w_t})}{\sum_{w'=1}^W
\exp(\mathbf{v}_{w'} \cdot \mathbf{v}_{w_t})}$$

在这里，我们通常用 softmax 计算概率。

- CBOW：根据上下文（之前和之后的单词）预测中间词。上下文中单词的顺序并不重要。

$$ J(\mathbf{\theta}) = \frac{1}{n}\sum_{t=1}^{n}
\log p(w_t \mid w_{t-m}, ..., w_{t-1}, w_{t+1}, ..., w_{t+m};
\mathbf{\theta})$$$$ p(w_t \mid w_{t-m}, ..., w_{t-1}, w_{t+1}, ...,
w_{t+m}; \mathbf{\theta}) = \frac{\exp(\mathbf{v}_{w_t} \cdot
\overline{\mathbf{v}}_c)}{\sum_{w'=1}^W \exp(\mathbf{v}_{w'} \cdot
\overline{\mathbf{v}}_c)} $$ $$ \overline{\mathbf{v}}_c = \frac{1}{2m} \sum_{-m\leq j
\leq m, j \neq 0} \mathbf{v}_{w_{t+j}} $$

$\overline{\mathbf{v}}_c$ 是上下文单词输入向量的评价值。

![image](/notes-assets/48b3e6f9/image-20231129115351021.png)

### GloVe

Glove（单词表示的全局向量）是一种通过分解单词共现矩阵 (co-occurrence matrix) 来学习单词嵌入的模型。 其主要思想是单词之间的关系可以按照它们的共现概率的比率进行编码。 它可以最小化词向量的点积与其共现概率的对数之间的差异。 

### FastText

是 word2Vec 的一种拓展，将单词表示为其字符 n 元语法的总和。可以学习词汇表之外的词嵌入，加强了对拼写错误的鲁棒性。同样也可以用 CSG 和 CBOW 架构训练。

## 预训练词嵌入

直接使用预训练的词嵌入或者针对任务进行微调。

1. [Google’s Word2Vec](https://code.google.com/archive/p/word2vec/): Pre-trained on the Google News dataset, containing 100 billion words and resulting in a 300-dimensional vector for 3 million words and phrases.
    
2. [Stanford’s GloVe](https://nlp.stanford.edu/projects/glove/): Pre-trained on the Common Crawl dataset, containing 840 billion words and resulting in 300-dimensional vectors for 2.2 million words.
    
3. [Facebook’s FastText](https://fasttext.cc/): Pre-trained on Wikipedia, containing 16 billion words and resulting in 300-dimensional vectors for 1 million words.

## 任务中使用预训练词嵌入

1. 用于输入特征：将原始输入编码作为输入使用。
2. 微调的初始化：对某种类型的任务做微调。
3. 和其他词嵌入结合：比如字母层级的嵌入等等，以得到一个更好地表示。

## 语境化的词嵌入 Contextualized Word Embeddings

传统的词嵌入模型不能很好的表示多义词，因此，EKMo、BERT、GPT 等模型根据语境动态的为单词赋予含义，在大模型中常用。

![image](/notes-assets/48b3e6f9/image-20231129214858280.png)