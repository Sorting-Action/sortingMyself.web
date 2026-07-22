import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// frontmatter 即真相。schema 校验 = 系统层面的执法：
// 标签不是数组、缺分类、缺 id，构建直接失败，不靠自律。
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    // 稳定 ID，创建时生成，永不变更；URL 的第一部分
    id: z.string().regex(/^[a-z0-9]+$/),
    title: z.string(),
    // 可选 slug，URL 的可读部分；改了不影响 ID 部分的稳定性
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    // 单分类，按知识本质归属；树由所有笔记的 category 路径聚合而成
    category: z.string(),
    // 标签仅限领域专业名词，数量不限
    tags: z.array(z.string()).default([]),
    // draft: true 只是发布开关，不是安全机制（仓库公开）
    draft: z.boolean().default(false),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { notes };
