---
id: 4d690698
title: "Query Optimization"
slug: query-optimization
tags: []
draft: false
created: 2024-04-04
---
In the DBMS architecture, this part is connected with query rewriter and query optimizer.

# Basic Concept

## Query Plans

When received the SQL query, the system compile the query to logic query plan, and then convert physical plans.

![image](/notes-assets/4d690698/Screenshot%202023-06-07%20at%2010.06.30%20PM.png)![image](/notes-assets/4d690698/Screenshot%202023-06-07%20at%2010.06.51%20PM.png)

There are many different algorithms for each logical operator:

- Table-scan versus Index-scan
- Block nested loops versus Index nested loops

And multiple order of executing operators:

![image](/notes-assets/4d690698/Screenshot%202023-06-07%20at%2010.08.40%20PM.png)

**Query Optimizer** aims at picking fastest plan.

## Cost-based optimization (System-R style)

- Predict the cost of each plan
- Search the plan space to find the fastest one
- Do it efficiently
	- optimization itself should be fast!

### Components

- Plan space
- Cost estimator
- Search Algorithm

# Cost-based Optimization

## Plan Space

This section consider the to reduce the plan space.

- Multiple logical plans for a SQL query
- Eliminate logical plans that are sub-optimal
- Faster search of the plan space

### Push the selection down

To reduce number of tuples and fewer I/O access

![image](/notes-assets/4d690698/Screenshot%202023-06-07%20at%2010.15.31%20PM.png)

### Push projection down

To reduce the number of columns and fewer I/O access, but less effective than pushing down selection

![image](/notes-assets/4d690698/Screenshot%202023-06-07%20at%2010.19.27%20PM.png)

### Avoid plans with Cartesian product

Cartesian products are larger than joins, If cannot avoid Cartesian products, delay them.

For join of R(A,B), S(B,C), U(C,D), but (R ⋈ U) ⋈ S has a Cartesian product, Pick (R ⋈ S) ⋈ U instead.

System-R style considers only left-deep joins. numerous plans for joining n relations: O(n!)

![image](/notes-assets/4d690698/Screenshot%202023-06-07%20at%2010.22.18%20PM.png)

## Predicting the Running Times

This section focus on Cost estimator.

- how to estimate cost of each plan without executing it?
- we would like to have accurate estimation

Goal of cost estimation are:

1. Maximize relative accuracy
2. Compare plans, not to predict exact costs

For the cost of a plan:

1. Find the input of each operator, and estimate the cost based on the input.
2. Sum the cost of all operators.

## Searching For the Fastest Query Plan

## Nested Queries