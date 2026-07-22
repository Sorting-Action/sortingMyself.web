import { getCollection, type CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'notes'>;

/** 只取已发布笔记（draft: false），按创建时间倒序 */
export async function getPublishedNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  return notes.sort((a, b) => b.data.created.getTime() - a.data.created.getTime());
}

/** URL = 稳定 ID + 可选 slug，与分类解耦，重新上传/改分类都不会变 */
export function noteUrl(note: Note): string {
  return `/notes/${note.data.id}${note.data.slug ? `-${note.data.slug}` : ''}/`;
}

export interface CategoryNode {
  name: string;
  /** 从根到本节点的完整路径，如 "计算机科学/操作系统"，用作页面 URL */
  path: string;
  /** 直接挂在本节点下的笔记 */
  notes: Note[];
  children: CategoryNode[];
}

/** 分类树 = 所有已发布笔记的 category 字段聚合，与文件物理位置无关 */
export function buildCategoryTree(notes: Note[]): CategoryNode[] {
  const roots: CategoryNode[] = [];
  for (const note of notes) {
    const parts = note.data.category
      .split('/')
      .map((s) => s.trim())
      .filter(Boolean);
    let level = roots;
    let path = '';
    let node: CategoryNode | undefined;
    for (const part of parts) {
      path = path ? `${path}/${part}` : part;
      node = level.find((n) => n.name === part);
      if (!node) {
        node = { name: part, path, notes: [], children: [] };
        level.push(node);
      }
      level = node.children;
    }
    node?.notes.push(note);
  }
  return roots;
}

/** 拍平树，拿到所有节点（含中间节点），用于生成每个分类的静态页面 */
export function collectCategoryPaths(tree: CategoryNode[]): CategoryNode[] {
  const all: CategoryNode[] = [];
  const walk = (nodes: CategoryNode[]) => {
    for (const n of nodes) {
      all.push(n);
      walk(n.children);
    }
  };
  walk(tree);
  return all;
}

/** 本节点 + 所有后代节点的笔记 */
export function collectNotes(node: CategoryNode): Note[] {
  return [...node.notes, ...node.children.flatMap(collectNotes)];
}

/** 标签 -> 笔记列表 */
export function getAllTags(notes: Note[]): Map<string, Note[]> {
  const map = new Map<string, Note[]>();
  for (const note of notes) {
    for (const tag of note.data.tags) {
      const list = map.get(tag) ?? [];
      list.push(note);
      map.set(tag, list);
    }
  }
  return map;
}
