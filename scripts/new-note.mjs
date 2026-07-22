#!/usr/bin/env node
// 用法: npm run new -- "计算机科学/操作系统" "笔记标题"
//       npm run new -- "笔记标题"   （归入根目录，显示为「未分类」）
// 生成 draft: true 的新笔记；写完内容后把 draft 改为 false 即发布
import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const hasCategory = args.length >= 2;
const category = hasCategory ? args[0].replace(/^\/+|\/+$/g, '') : '';
const title = hasCategory ? args[1] : (args[0] ?? '未命名');

const id = randomBytes(4).toString('hex'); // 稳定 ID，生成后永不修改
const date = new Date().toISOString().slice(0, 10);
const filename = `${date}-${id}.md`;

const dir = join('src/content/notes', ...(category ? category.split('/') : []));
mkdirSync(dir, { recursive: true });

const template = `---
id: ${id}
title: ${title}
slug:
tags: []
draft: true
created: ${date}
---

## 

`;

writeFileSync(join(dir, filename), template);
console.log(`已创建 ${join(dir, filename)}`);
console.log(`分类：${category || '未分类'}（由文件夹决定，移动文件即可改分类）`);
console.log(`当前为 draft: true；写完后改为 false 发布`);
