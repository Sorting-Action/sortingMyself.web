---
id: 557f803b
title: "Logic"
slug: logic
tags: []
draft: false
created: 2024-04-04
---
knowledge-based agents use a process of **reasoning** over an internal representation of knowledge to decide what actions to take.

## Knowledge-Based Agents

A knowledge base is a set of sentences.

The sentence is expressed in a knowledge representation language and represents some assertion about the world.

Axiom: When the sentence is taken as being given without being derived from other sentences.

- TELL: tell the knowledge base what you percept.
- ASK: the answer should follow from what has been told to the knowledge base previously.

the outline of a knowledge-based agent program: 

![image](/notes-assets/557f803b/image-20230309044817001.png)

## The Wumpus World

- Performance measure: +1000 for climbing out of the cave with the gold, –1000 for falling into a pit or being eaten by the wumpus, –1 for each action taken, and –10 for using up the arrow. The game ends either when the agent dies or when the agent climbs out of the cave.
- Environment: A 4×4 grid of rooms, with walls surrounding the grid. The agent always starts in the square labeled [1,1], facing to the east. The locations of the gold and the wumpus are chosen randomly, with a uniform distribution, from the squares other than the start square. In addition, each square other than the start can be a pit, with probability 0.2.
- Actuators: The agent can move Forward, TurnLeft by 90, or TurnRight by 90. The agent dies a miserable death if it enters a square containing a pit or a live wumpus. (It is safe, albeit smelly, to enter a square with a dead wumpus.) If an agent tries to move forward and bumps into a wall, then the agent does not move. The action Grab can be used to pick up the gold if it is in the same square as the agent. The action Shoot can be used to ﬁre an arrow in a straight line in the direction the agent is facing. The arrow continues until it either hits (and hence kills) the wumpus or hits a wall. The agent has only one arrow, so only the ﬁrst Shoot action has any effect. Finally, the action Climb can be used to climb out of the cave, but only from the square \[1,1\].
- Sensors: The agent has ﬁve sensors, each of which gives a single bit of information:
	- In the squares directly (not diagonally) adjacent to the wumpus, the agent will perceive a Stench.1 
	- In the squares directly adjacent to a pit, the agent will perceive a Breeze.
	- In the square where the gold is, the agent will perceive a Glitter.
	- When an agent walks into a wall, it will perceive a Bump.
	- When the wumpus is killed, it emits a woeful Scream that can be perceived anywhere in the cave.

![image](/notes-assets/557f803b/image-20230309045413223.png)

it is deterministic, discrete, static, and single-agent.

## Logic

Model: each possible world.

Sentence: syntex + truth.

- $\alpha \vDash \beta$ means $\alpha$ include $\beta$. in every model in which α is true, β is also true.

logical inference: the deﬁnition of entailment can be applied to derive conclusions.

![image](/notes-assets/557f803b/image-20230309050851509.png)

- Soundness
	- An inference algorithm that derives only entailed sentences is called sound or truthpreserving.
- Completeness
	- if it can derive any sentence that is entailed.
- Grounding
	- the connection between logical reasoning processes and the real environment in which the agent exists.
	- agent’s sensors create the connection.

learning: General rules are produced by a sentence construction process.

## Propositional Logic: A Very Simple Logic

propositional logic 命题逻辑

### Syntax

![image](/notes-assets/557f803b/image-20230309052151024.png)

### Semantics

Semantic: the rules for determining the truth of a sentence with respect to a particular model.

a model simply sets the truth value—true or false—for every proposition symbol.

![image](/notes-assets/557f803b/image-20230309052233945.png)

### A simple knowledge base

![image](/notes-assets/557f803b/image-20230309052809011.png)

### A simple inference procedure

![image](/notes-assets/557f803b/image-20230309053155828.png)

Time complex: $O(2^n)$, if KB and α contain n symbols in all.

## Propositional Theorem Proving

- logical equivalence![image](/notes-assets/557f803b/image-20230309053342436.png)

- validity
	- A sentence is valid if it is true in all models.
	- the sentence P∨¬P is valid.
- satisﬁability
	- A sentence is satisﬁable if it is true in, or satisﬁed by, some model.

If a sentence is a validity, then it must be satisfiability, but if it is satisfiability, it might not validity.

### Inference and proofs

This section covers inference rules that can be applied to derive a proof—a chain of conclusions that leads to the desired goal.

- Modus Ponens: ![image](/notes-assets/557f803b/image-20230309053730433.png)
- And-Elimination![image](/notes-assets/557f803b/image-20230309053751514.png)
- ![image](/notes-assets/557f803b/image-20230309055124239.png)

monotonicity

![image](/notes-assets/557f803b/image-20230309054153440.png)

### Proof by resolution

resolution![image](/notes-assets/557f803b/image-20230309060327262.png)

factoring: if we have (A∨A), which is reduced to just A by factoring.

#### Conjunctive normal form

A sentence expressed as **a conjunction of clauses** is said to be in conjunctive normal form or CNF (see Figure 7.12).

Clause: **a disjunction of literals**.

![image](/notes-assets/557f803b/image-20230309060726655.png)

REMEMBER: ¬ to appear only in literals.

#### A resolution algorithm

![image](/notes-assets/557f803b/image-20230309061126499.png)

#### Completeness of resolution

ground resolution theorem:

> If a set of clauses is unsatisﬁable, then the resolution closure of those clauses contains the empty clause.

### Horn clauses and deﬁnite clauses

- deﬁnite clause: a disjunction of literals of which exactly one is positive.
- goal clauses: no positive.
- Horn clause: a disjunction of literals of which at most one is positive.

Knowledge bases containing only deﬁnite clauses:

- Every deﬁnite clause can be written as an implication whose premise is a conjunction of positive literals and whose conclusion is a single positive literal.
- Inference with Horn clauses can be done through the forward-chaining and backward-chaining algorithms.
- Deciding entailment with Horn clauses can be done in the time that is linear in the size of the knowledge base.

### Forward and backward chaining

![image](/notes-assets/557f803b/image-20230309062557622.png)

## Eﬀective Propositional Model Checking

In this section, we describe two families of efﬁcient algorithms for general propositional inference based on model checking: one approach based on backtracking search, and one on local hill-climbing search.

![image](/notes-assets/557f803b/image-20230309065516941.png)

![image](/notes-assets/557f803b/image-20230309065527802.png)

