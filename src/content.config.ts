import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// frontmatter + 文件夹结构共同构成真相。schema 校验 = 系统层面的执法：
// 标签不是数组、缺 id，构建直接失败，不靠自律。
const notes = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/notes',
    // 保留原始相对路径作为 entry id，分类树由文件夹路径推导
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    // 稳定 ID，创建时生成，永不变更；URL 的第一部分
    id: z.string().regex(/^[a-z0-9]+$/),
    title: z.string(),
    // 可选 slug，URL 的可读部分；改了不影响 ID 部分的稳定性
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    // 注意：没有 category 字段。分类 = 文件所在文件夹，唯一真相。
    // 标签仅限领域专业名词，数量不限
    tags: z.array(z.string()).default([]),
    // draft: true 只是发布开关，不是安全机制（仓库公开）
    draft: z.boolean().default(false),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { notes };
