---
id: 7fb8b54f
title: "What is Deep Learning"
slug: what-is-deep-learning
tags: []
draft: false
created: 2024-04-04
---
## Artificial intelligence, machine learning, and deep learning

The relationship between artificial intelligence, machine learning, and deep learning follows the below picture:

![image](/notes-assets/7fb8b54f/image-20230329213644094.png)

### Artificial intelligence

Definition: the effort to automate intellectual tasks normally performed by humans.

Old Approach: *symbolic* AI, manipulating knowledge by a set of handcraft rules.

### Machine learning

The new approach takes symbolic AI's place. Change the idea from "How a machine could work according to human working rules" to "Can a machine learn how to work from the current task?" In this case, the ML system is trained rather than explicitly programmed. The change of idea also brings a new paradigm below:

![image](/notes-assets/7fb8b54f/image-20230329221339615.png)

### Learning representations from data

In an ML system, there are three important points:

- Input Data
- Example of Output Data
- Performance Measurement

To help the system quickly and efficiently learn from input data, the central problem of ML is: *meaningfully transforming data*.

Here is an example to show how representation affects learning:

![image](/notes-assets/7fb8b54f/image-20230329223359255.png)

Although we could have a clear linear description for the row data, the representation will be better if we change the coordination. The color could be described as $x>0$, which is more clear.

This process also is machine learning from the data. **Learning** describes an automatic search process for better representations. Since machines do not always create a new representation, they search for powerful representation in a set of operations, which is **hypothesis space**.

### The “deep” in deep learning

