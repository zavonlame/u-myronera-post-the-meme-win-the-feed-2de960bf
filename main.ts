// Post the Meme, Win the Feed — u-myronera-post-the-meme-win-the-feed-2de960bf
//
// What this program does: it hands the grader the meme picture this entry
// was built around. The picture itself lives in the repository as meme.png
// (a 1024x1024 PNG rendered during the build); this program only copies it
// into the output directory the grader points at. No network, no child
// processes, no headless browser at run time — the grader image has no
// Chrome, so everything visual was settled before this program ever runs.
//
// The meme, in one line: a builder says "one quick bounty entry" and the
// agent is still going at 3AM, forty-seven subagents deep. It is aimed at
// people who build agents, which is exactly who this bounty is for.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MEME_FILE = "meme.png";

function repoRoot(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || "/output";
}

function handOverMeme(): void {
  const source = join(repoRoot(), MEME_FILE);
  const targetDir = outputDir();
  mkdirSync(targetDir, { recursive: true });
  const target = join(targetDir, MEME_FILE);
  copyFileSync(source, target);
  // Prove the handover is complete: the grader runs this program twice,
  // so a silent short write must fail loudly here instead of shipping a
  // truncated picture.
  const sent = readFileSync(source);
  const received = readFileSync(target);
  if (!sent.equals(received)) {
    throw new Error("meme copy failed: output bytes differ from meme.png");
  }
}

handOverMeme();
