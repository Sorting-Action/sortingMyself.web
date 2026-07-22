# sortingMyself.web

存放个人学习记录的静态网站：读书笔记、计算机学习笔记、代码片段与做题总结。

## 设计原则（决策已锁定，勿轻易改动）

| 项目 | 决策 |
|---|---|
| 内容源 | Git 仓库内 Markdown，**文件夹即分类**，frontmatter 管元数据 |
| 分类 | 单分类，按知识本质归属；分类树 = 文件夹结构聚合，唯一真相 |
| 标签 | 数量不限，仅限领域专业名词 |
| URL | 稳定 ID + 可选 slug，与分类解耦，移动文件/改分类 URL 不变 |
| 私密控制 | `draft: true` = 不发布的草稿；仓库公开，真正私密的东西不进此仓库 |
| 渲染 | Astro content collections（MD 渲染用成熟方案，其余自己写） |
| 部署 | Vercel，push 到 main 自动部署 |

## 常用命令

```bash
npm install          # 首次安装
npm run dev          # 本地开发
npm run build        # 构建（frontmatter 写错会在这里报错）
npm run new -- "计算机科学/操作系统" "标题" # 在对应文件夹下新建笔记（自动 draft: true）
```

## 发布一篇笔记的流程

1. `npm run new -- "计算机科学/操作系统" "标题"` 生成草稿（自动建文件夹）
2. 写内容，填 `tags`
3. `draft` 改为 `false`
4. `git add . && git commit && git push` → Vercel 自动部署（约 2 分钟）

改分类 = `git mv` 移动文件到别的文件夹，URL 不受影响。

## 目录结构

```
src/content/notes/   # 所有笔记，文件夹结构 = 分类树
src/content.config.ts# frontmatter schema（写错构建即报错）
src/lib/notes.ts     # 分类树 / 标签 / URL 的核心逻辑
src/pages/           # 首页、笔记页、分类页、标签页、关于页
docs/WORKFLOW.md     # AI 协作日志（每次会话后必写）
```
