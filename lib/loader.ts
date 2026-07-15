import fs from "fs";
import path from "path";
import type { Chapter, Shloka } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");

let chaptersCache: Chapter[] | null = null;
let shlokasCache: Shloka[] | null = null;

export function loadChapters(): Chapter[] {
  if (chaptersCache) return chaptersCache;
  const dir = path.join(DATA_DIR, "chapters");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const chapters: Chapter[] = files.map((f) => {
    const content = fs.readFileSync(path.join(dir, f), "utf-8");
    return JSON.parse(content);
  });
  chapters.sort((a, b) => a.chapter_number - b.chapter_number);
  chaptersCache = chapters;
  return chapters;
}

export function loadShlokas(): Shloka[] {
  if (shlokasCache) return shlokasCache;
  const dir = path.join(DATA_DIR, "slok");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const shlokas: Shloka[] = files.map((f) => {
    const content = fs.readFileSync(path.join(dir, f), "utf-8");
    return JSON.parse(content);
  });
  shlokas.sort((a, b) => {
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.verse - b.verse;
  });
  shlokasCache = shlokas;
  return shlokas;
}

export function loadShlokasByChapter(chapterNum: number): Shloka[] {
  return loadShlokas().filter((s) => s.chapter === chapterNum);
}

export function loadShloka(chapterNum: number, verseNum: number): Shloka | undefined {
  return loadShlokas().find((s) => s.chapter === chapterNum && s.verse === verseNum);
}

export function getChapterByNumber(num: number): Chapter | undefined {
  return loadChapters().find((c) => c.chapter_number === num);
}
