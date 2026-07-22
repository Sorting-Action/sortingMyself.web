---
id: 8b0c67a0
title: "Transactions & Concurrency Control"
slug: transactions-concurrency-control
tags: []
draft: false
created: 2024-04-04
---
# Transaction

Here is an example of concurrent access:

```
Database: seats 22A and 22B are available.

1. John checks for availability and gets seat 22A
2. Mary checks for availability and gets seat 22A
3. John books seat 22A
4. Mary books seat 22A
```

## Transaction Operation

In this case, for a program of database operations, it should be **Atomic unit** of database programming.

```sql
START TRANSACTION
SQL-statement 1;
SQL-statement 2;
…
SQL-statement n;
COMMIT;
```

### Rollback or Abort

If happened, Undoes all transaction’s operations. Transaction might be aborted by the system, e.g., power failure.

```sql
START TRANSACTION
SQL-statement 1;
SQL-statement 2;
if (condition) ROLLBACK;
…
SQL-statement n;
COMMIT;
```

## The ACID properties

- Atomicity: All actions in the Xact happen, or none happen.
- Consistency: If each Xact is consistent, and the DB starts consistent, it ends up consistent.
- Isolation: Execution of one Xact is isolated from that of other Xacts.
- Durability: If a Xact commits, its effects persist.

In this module, we talk about isolation.

# Serializability

Database systems detect conflicts between concurrent transactions using a data structure called **serialization graph**.  We explain how to create a serialization graph for a set of concurrent transactions. We also explain how to use a serialization graph to detect whether the transactions in the graph interfere with each other's logic and return inconsistent results.

## Transaction Interleaving

Here is an example, we have two transaction, T1 and T2. Before the transaction, A=0 and B=0.

![image](/notes-assets/8b0c67a0/Screenshot%202023-06-14%20at%204.01.06%20PM.png)

We can see that two transactions are serial in schedule 3, and the result is correct. The schedule 1 is interleaved(more concurrent) but not serial.

Schedule 1 provides consistency and isolation. It impacts DB like a serial schedule.

## Serializable schedule

Like schedule 1, Concurrent schedule that impacts DB like a serial schedule. How to check if a concurrent schedule is serializable? We use conflicting operations.

We denote operations of transaction i as $write_i$ or $read_i$. For conflicting operations like write and read in different transactions, we have:

- Two **write** operating of the **same data item**: $write_i(A); write_j(A)$.
- A **pair** of conflicting operations of **same data item**: $read_i(A); write_j(A)$.

Then, we can check whether 

Change the relative order of conflicting operators => change the final state of DB

A serializable schedule has the same order of conflicting operators as a serial schedule.

## Serialization graph

- Define dependencies between transactions with conflicting operations
- Serialization (precedence) graph: Ti --> Tj for a dependency from Ti to Tj
- Serializable if serialization graph does not have any cycle.

![image](/notes-assets/8b0c67a0/Screenshot%202023-06-14%20at%204.15.57%20PM.png)

# 2PL

**Two phase locking** (_**2PL**_) is the most well-known and widely used locking protocol. It is mainly due to its simplicity and strong isolation guarantees. We will describe 2PL and explain why it guarantees isolation.

## Guaranteeing isolation

Scheduler guarantees serializability

- restricts the access of transactions on data items.
- enforces some order on conflicting operations.

Here are two approaches, in this section, we focus on pessimistic approach.

1. pessimistic: There are many conflicting transactions.
2. optimistic: There are a few conflicting transactions.

## Locking Protocol

A protocol for accessing data. The transactions lock/unlock “data units” before/after using them, and the lock manager grants the locks.

The goals of locking protocol are ensure the **serializability** and preserve high **concurrency**.

### Parameters

- What **modes** of locks to provide?
- How to **obtain** and **hold** locks?
	- in what sequence?
	- how long to hold?
- What **units** to lock?

### Lock modes and compatibility

- Shared lock = read lock= S
	- multiple transactions hold a shared lock over a data item.
- Exclusive lock = write lock = X
	- at most one transaction holds an exclusive lock over a data item.

Lock manager gives locks based on compatibility matrix:

![image](/notes-assets/8b0c67a0/Screenshot%202023-06-14%20at%204.30.22%20PM.png)

### Motivation: a “simple” protocol

- Lock modes:
	- S for shared and X for exclusive access
	- compatibility: (S, S) = Y, otherwise N
- Behavior:
	- lock (the maximum mode) before access
	- release lock immediately after
- Unit:
	- attribute values

## 2 Phase Locking (2PL)

### Simple Protocol

![image](/notes-assets/8b0c67a0/Screenshot%202023-06-14%20at%204.32.54%20PM.png)

It not provides serial.

### 2 Phase Locking (2PL)

In this method, Each transaction has two phases:

**Transactions do not get any new lock after giving up one.**

1. Getting locks (growing)
	- acquire lock of the required mode (S or X)
	- can only lock data items during this phase, may also upgrade the locks (from S-lock to X-lock).
	- read/ write the locked data items.
	- **no** release-lock in this phase
2. Releasing locks (shrinking)
	- can only release locks on the data items, may also downgrade the locks (from X-lock to S-lock).
	- the phase starts with the first release-lock.
	- no locking after the first release-lock.

![image](/notes-assets/8b0c67a0/Screenshot%202023-06-14%20at%204.41.28%20PM.png)

### Why serializable?

- Locks of conflicting operations are not compatible.
- 2PL does not allow the swap of conflicting operations.
	- serial order between conflicting operations
	- all conflicting operations of T1 before T2.
- It is possible to swap non-conflicting operations.

### Other schedules

2PL schedules are a subset of all serializable schedules. 2PL does not provide the ideal degree of concurrency.

# Locking Granularity

# Degrees of Consistency in Locking Protocols

Cascading rollback

![image](/notes-assets/8b0c67a0/Screenshot%202023-06-14%20at%209.11.15%20PM.png)

If T2 abort, we cannot submit T1.

## How long to hold a lock?

End of transaction:

- unlock (to make data accessible) at xact commit
- strict 2PL
- avoids cascading rollback
- reduces concurrency!

## How to increase concurrency?

- Multiple degrees of consistency for transactions
- Sacrificing semantic guarantees for performance
- Pick a level based on application

## Degree of consistency 0

T does not overwrite dirty data of other xacts

Dirty-data: modified data not yet written to DB

It will Set short X locks on dirty data ( on w ). Short lock: held for the duration of a single operation.

## Degree of consistency 1

T does not commit any writes until EOT, Provides higher level of consistency than degree 0.

Set long X locks (2P/EOT on w), Long lock: held for the duration of transaction (till EOT).

## Degree of consistency 2

T does not read dirty data from other xacts, Higher level of consistency than 0 and 1.

Set long X and short S locks.

T1: w(A) abort
T2:                    S.lock(A) r(A) S.release(A)

## Degree of consistency 3

other xacts do not dirty any data read by T before T completes, Highest level of consistency: serializable schedules.

Degree 3 can ensure repeated reads will be consistent.

Set long X and S locks (2PL/EOT on w and r)

## Example of a control system

- The transaction that reads a gauge and writes values in the database
	- degree 0, for performance reasons.
- The transaction that reads the data and computes mean and var.
	- degree 1, because mean and var. should be consistent.
- The transaction that reads the mean and prints it.
	- degree 2, we do not show an “undone” mean
- The transaction that reads both mean and var.
	- degree 3, ensures that mean and var. are consistent
