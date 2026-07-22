#!/usr/bin/env node
// 用法: npm run new -- "笔记标题"
// 生成 draft: true 的新笔记；写完内容、填好分类后把 draft 改为 false 即发布
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const title = process.argv[2] ?? '未命名';
const id = randomBytes(4).toString('hex'); // 稳定 ID，生成后永不修改
const date = new Date().toISOString().slice(0, 10);
const filename = `${date}-${id}.md`;

const template = `---
id: ${id}
title: ${title}
slug:
category: 未分类
tags: []
draft: true
created: ${date}
---

## 

`;

writeFileSync(join('src/content/notes', filename), template);
console.log(`已创建 src/content/notes/${filename}`);
console.log(`当前为 draft: true；填好 category/tags 后改为 false 发布`);
