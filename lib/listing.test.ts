import assert from "node:assert/strict";
import test from "node:test";
import {
  ARCHIVE_PAGE_SIZE,
  archivePath,
  isArchivedRank,
  isRecommendedRank,
  pageCount,
  pageWindow,
  resolveArchivePage,
} from "./listing";

test("ranks below 1000 stay recommended and 1000 is archive", () => {
  assert.equal(isRecommendedRank(1), true);
  assert.equal(isRecommendedRank(5), true);
  assert.equal(isRecommendedRank(6), true);
  assert.equal(isRecommendedRank(999), true);
  assert.equal(isRecommendedRank(1000), false);
  assert.equal(isRecommendedRank(0), false);
  assert.equal(isRecommendedRank(null), false);
  assert.equal(isArchivedRank(999), false);
  assert.equal(isArchivedRank(1000), true);
  assert.equal(isArchivedRank(1001), true);
  assert.equal(isArchivedRank(null), false);
});

test("archive pages are 12 items and out-of-range requests redirect", () => {
  assert.equal(ARCHIVE_PAGE_SIZE, 12);
  assert.deepEqual(pageWindow(1), { page: 1, from: 0, to: 11 });
  assert.deepEqual(pageWindow(2, ARCHIVE_PAGE_SIZE), { page: 2, from: 12, to: 23 });
  assert.equal(pageWindow(0).page, 1);
  assert.equal(pageCount(0, 12), 1);
  assert.equal(pageCount(12, 12), 1);
  assert.equal(pageCount(13, 12), 2);
  assert.equal(pageCount(25, 12), 3);
  assert.deepEqual(resolveArchivePage(undefined, 25), { page: 1, pages: 3, redirectTo: null });
  assert.deepEqual(resolveArchivePage("1", 25), { page: 1, pages: 3, redirectTo: 1 });
  assert.deepEqual(resolveArchivePage("2", 25), { page: 2, pages: 3, redirectTo: null });
  assert.deepEqual(resolveArchivePage("9", 25), { page: 3, pages: 3, redirectTo: 3 });
  assert.deepEqual(resolveArchivePage("nope", 0), { page: 1, pages: 1, redirectTo: 1 });
  assert.equal(archivePath("chatgpt", 1), "/category/chatgpt/archive");
  assert.equal(archivePath("chatgpt", 2), "/category/chatgpt/archive?page=2");
});
