#!/usr/bin/env node
// 一次性导入脚本：把外部 Markdown 仓库导入本站
// 用法: node scripts/import-notes.mjs /path/to/source-repo
//
// 做的事：
// 1. 保留源仓库的文件夹结构（文件夹 = 分类）
// 2. 为每篇笔记生成 frontmatter（id 随机、title 取文件名、created 取 git 首次提交日期）
// 3. 转换两种图片引用（Obsidian ![[...]] 和标准 ![...](...)），
//    图片复制到 public/notes-assets/<id>/，引用重写为绝对路径
import { execSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';

const SRC = process.argv[2];
if (!SRC || !existsSync(SRC)) {
  console.error('用法: node scripts/import-notes.mjs /path/to/source-repo');
  process.exit(1);
}

const NOTES_DIR = 'src/content/notes';
const ASSETS_DIR = 'public/notes-assets';

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === '.git' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

/** git 首次提交日期（ISO，取日期部分）；失败则返回今天 */
function createdDate(file) {
  try {
    const out = execSync(
      `git log --follow --diff-filter=A --format=%aI -- "${relative(SRC, file)}"`,
      { cwd: SRC, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim();
    const first = out.split('\n').filter(Boolean).pop();
    if (first) return first.slice(0, 10);
  } catch {}
  return new Date().toISOString().slice(0, 10);
}

/** 从文件名提取 ASCII slug；提取不出则无 slug */
function makeSlug(name) {
  const slug = name
    .replace(/\.md$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return slug.length >= 3 ? slug : '';
}

let imported = 0;
let images = 0;
const missing = [];

for (const file of walk(SRC)) {
  const rel = relative(SRC, file); // 如 AI/CV/Paper/AlexNet.md
  const category = dirname(rel) === '.' ? '' : dirname(rel);
  const filename = basename(rel);
  const title = filename.replace(/\.md$/, '');
  const id = randomBytes(4).toString('hex');
  const slug = makeSlug(filename);
  const created = createdDate(file);

  let content = readFileSync(file, 'utf8');

  // 剥离已有 frontmatter（如果有）
  content = content.replace(/^---\n[\s\S]*?\n---\n*/, '');

  const noteAssetsDir = join(ASSETS_DIR, id);
  const copyAsset = (refPath) => {
    // 去掉 ./ 前缀，URL 解码
    const decoded = decodeURIComponent(refPath.replace(/^\.\//, ''));
    const noteDir = join(SRC, dirname(rel));
    const base = basename(decoded);
    // 解析链：直接路径 → Typora <笔记名>.assets → 共享 assets → Obsidian assets/<笔记名>
    const candidates = [
      join(noteDir, decoded),
      join(noteDir, `${title}.assets`, base),
      join(noteDir, 'assets', base),
      join(noteDir, 'assets', title, base),
    ];
    const abs = candidates.find((p) => existsSync(p));
    if (!abs) {
      missing.push(`${rel} -> ${decoded}`);
      return null;
    }
    mkdirSync(noteAssetsDir, { recursive: true });
    cpSync(abs, join(noteAssetsDir, basename(decoded)));
    images++;
    return `/notes-assets/${id}/${encodeURIComponent(basename(decoded))}`;
  };

  // Obsidian 图片: ![[path]]
  content = content.replace(/!\[\[([^\]]+)\]\]/g, (m, p) => {
    const url = copyAsset(p.split('|')[0].trim()); // 去掉 Obsidian 尺寸语法 |300
    return url ? `![image](${url})` : m;
  });

  // 标准图片: ![alt](path)，跳过网络图片和已处理的绝对路径
  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, p) => {
    if (/^https?:\/\//.test(p) || p.startsWith('/')) return m;
    const url = copyAsset(p.trim());
    return url ? `![${alt}](${url})` : m;
  });

  const frontmatter = [
    '---',
    `id: ${id}`,
    `title: ${JSON.stringify(title)}`,
    slug ? `slug: ${slug}` : null,
    'tags: []',
    'draft: false',
    `created: ${created}`,
    '---',
    '',
  ]
    .filter((l) => l !== null)
    .join('\n');

  const targetDir = join(NOTES_DIR, category);
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(join(targetDir, filename), frontmatter + content);
  imported++;
}

console.log(`导入笔记: ${imported} 篇`);
console.log(`复制图片: ${images} 张`);
if (missing.length) {
  console.log(`\n⚠️  ${missing.length} 个图片引用在源仓库中找不到文件：`);
  missing.forEach((m) => console.log(`  ${m}`));
}
