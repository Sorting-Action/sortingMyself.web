---
id: dadc7f35
title: "Adversarial Search"
slug: adversarial-search
tags: []
draft: false
created: 2024-04-04
---
Adversarial search solves the problem in the competitive environment.

## Game Theory

Three stances(立场) for multi-agents environment:

1. Consider aggregate as an economy.
2. As part of the environment: the part that makes the environment nondeterministic.
3. (This Chapter) Explicitly model the agents by game tree search.

### Two-player zero-sum games

Perfect information = fully observable

zero-sum: The outcome is good for one, must bad for another one. (no win-win).

An example of the game problem:

![image](/notes-assets/dadc7f35/image-20230227102242921.png)

## Optimal Decisions in Games

And-Or search fitting the problem gives a binary outcome, but the minimax search could solve multiple outcomes.

Minimax search has two kinds of nodes: min node and max node.  Here are the algorithms:

![image](/notes-assets/dadc7f35/Screenshot%202023-02-27%20at%2020.23.39.png)

After calculating the value of each terminal node, we could know the value of their parents(**back-up value**), until the root. The value of the root is the **minimax decision**.

![image](/notes-assets/dadc7f35/image-20230227213116404.png)

### The minimax search algorithm

Minimax algorithms code.

![image](/notes-assets/dadc7f35/Screenshot%202023-02-27%20at%2020.43.14.png)

According to the code, the minimax algorithms explore the tree depth first. Also, for a tree with depth m and label moves b, the **time** complexity is $O(b^m)$, and **space** complexity is $O(bm)$.

### Optimal decisions in multiplayer games

For games that have more than two players, extend the minimax algorithms.

1. Extending the single value to a vector. For players A, B, and C, the value is $<v_a, v_b, c_c>$.
2. the backed-up value of a node n is the utility vector of the successor state with the highest value for the player choosing at n.

alliances(结盟): some players collaborate for one goal.

In the non-zero-sum two-player game, two players could ally. Ex. they have the same highest goal.

### Alpha–Beta Pruning

Alpha–beta pruning: removing the branch that contains value is independent of the minimax decision.

The general principle is this: consider a node n somewhere in the tree (see Figure 5.6), such that Player has a choice of moving to n. If Player has a better choice either at the same level (e.g. m ′ in Figure 5.6) or at any point higher up in the tree (e.g. m in Figure 5.6), then Player will never move to n.

- Initialization: $(\alpha, \beta) = (-\infty, +\infty)$
- Prune at Min node if its current value $\leq \alpha$.
- Prune at Max node if its current value $\geq \beta$.

![image](/notes-assets/dadc7f35/image-20230227220339917.png)

In this example: ![image](/notes-assets/dadc7f35/image-20230227233943993.png)

In (d), since 2 exist, the function $min(D'successor)\leq 2$ must exist, thus $max(A'successor) = 3> 2$ exist.

Here are the algorithms:![image](/notes-assets/dadc7f35/image-20230227234416176.png)
![image](/notes-assets/dadc7f35/image-20230301205037838.png)
![image](/notes-assets/dadc7f35/image-20230301205222378.png)

### Move ordering

The effectiveness of alpha–beta pruning is highly dependent on the **order** in which the states are examined.

Considering the best case, alpha-beta pruning gives $O(b^{m/2})$ time complexity and gives $O(b^{3m/4})$ averagely.

Improvement method:

- Adding dynamic move-ordering schemes: killer heuristic. Using iterative deepening technology to maintain a moving score set and choose the best move (killer move) order.
- keeping a table of previously reached states: redundant paths to repeated states can cause an exponential increase. Solving by a transposition table that caches the heuristic value of states.

Although we have alpha-beta pruning, go and chess are not fit minimax algorithms since lots of states need to explore. Here are two strategies to solve this:

1. Consider all possible moves to a certain depth in the search tree and uses a heuristic evaluation function to estimate the utility of states at that depth. **wide but shallow**
2. Ignore the bad moves and follow promising branching as far as possible. **deep but narrow**

## Heuristic Alpha–Beta Tree Search

To use the limited computation time, we cut off the search early. Replace `is_terminal` with `is_cutoff` and replace `utility()` with `eval`.

![image](/notes-assets/dadc7f35/image-20230228013847634.png)

### Evaluation functions

`eval()` will return an estimate of the utility of state s to player p. In the terminal state, we have `eval(s, p) = utility(s, p)`. In another case (non-deterministic), we have `UTILITY (loss, p) <= E VAL(s, p) ≤ UTILITY (win, p)`.

what makes for a good evaluation function?

1. Computation cannot too long.
2. strongly correlated with the actual chances of winning.

weighted linear function: compute each feature separately and combine them to find the total value. Assuming that each feature is **independent**.

### Cutting oﬀ search

quiescent: only the quiescent position could be evaluated. This will quickly resolve the uncertainties in the position.

horizon effect: The computer might make a bad decision since it could only search a little part of the whole problem. For the problem that the result has hugely different after searching the max depth of the search tree, the computer will give misleading advice since the correct advice is beyond their horizon.

mitigate horizon effect:

1. allow singular extensions: moves that are “clearly better” than all other moves in a given position. This makes the tree deeper.

### Forward pruning

forward pruning: prunes moves that **appear to be poor moves**, but might possibly be good ones.

1. beam search: consider n best moves.
2. probabilistic cut: version of alpha-beta search, using statistics gained from prior experience to lessen the chance that the best move and pruning any nodes outside the current (α, β).
3. late move reduction: Assume that the moving order is ready, and delete the depth of those moves that appear later in the score list.

## Monte Carlo Tree Search

Often used to go and solve two challenges:

1. 361 branching factor
2. evaluation function since most of the position is empty until the game end.

In the monte carlo tree search, the value of a state is estimated as the average utility over a number of simulations of complete games starting from the state.

How to choose the move during the playout(simulation)?

2. = selection policy: selectively focuses the computational resources on the important parts of the game tree.
	1. have a balance between states that have a few playouts and have done well in past playouts.
3. from what positions do we start the playouts?
4. how many playouts do we allocate to each position?

Monte Carlo search starts from the **current** state to do **N** steps.

Monte Carlo tree search (MCTS) evaluates states not by applying a heuristic function, but by **playing out the game all the way to the end** and using the rules of the game to see **who won**. Since the moves chosen during the playout may **not have been optimal moves**, the process is **repeated multiple times** and the evaluation is an **average** of the results.

- Selection: Choosing the moves according to the selection policy until moving down to the leaf.
- Expansion: Generating a new node marked with 0/0.
- Simulation: Perform a playout from the newly generated node.
- Back-propagation: Use the above result to update all values of the search tree until the root.

![image](/notes-assets/dadc7f35/image-20230228223352456.png)
![image](/notes-assets/dadc7f35/image-20230228223627826.png)

Example of selection policy: upper conﬁdence bounds applied to trees.

![image](/notes-assets/dadc7f35/image-20230228224021013.png)

- $U(n)$: total utility of all playouts that went through node $n$.
- $N(n)$: the number of the playout through the node $n$.
- $PARENT(n)$: the parent node of $n$ in the tree.
- $\frac{U(n)}{N(n)}$: average utility of node $n$.
- $\sqrt{\frac{log\ N(PARENT(n))}{N(n)}}$: is exploration term. For the new node, since the $N(n)$ will be small, this item will increase.
- $C$: a constant that balances exploitation and exploration

Compare between Monte Carlo and Alpha-beta:

Branching factor: MCS work well for game has big branching factor since it could search more and deeper.

Evaluation function: alpha-beta depedent on it, but MCS not.

Wrong on Single node: AB will make wrong decision if single node computing is wrong; MCS depedent on lots of playout so not.

Single move case huge change: MCS will not detect this information since it might not discover this route, but AB will.

## Stochastic Games

Since the probability, cannot generate a standard game tree like above games. In case, we should:

1. Add `chance node` between max node and min node.
	1. It denote the possible dice rolls.


## Limitations of Game Search Algorithms

1. (alpha-beta) its vulnerability to errors in the heuristic function.
	1. If errors in the evaluation function are not independent, then the chance of a mistake rises.
	2. It is difﬁcult to compensate for this because we don’t have a good model of the dependencies between the values of sibling nodes.
2. (alpha-beta & Monte carlo) they are designed to calculate (bounds on) the values of legal moves.
	1. sometimes there is one move that is obviously best (for example when there is only one legal move), and in that case, there is no point wasting computation time to ﬁgure out the value of the move.
3. (alpha-beta & Monte carlo) do all their reasoning at the level of individual moves.
	1. they can reason at a more abstract level, considering a higher-level goal
4. (alpha-beta & Monte carlo) the ability to incorporate machine learning into the game search process.
	1. Early game programs relied on human expertise to hand-craft evaluation functions, opening books, search strategies, and efﬁciency tricks.