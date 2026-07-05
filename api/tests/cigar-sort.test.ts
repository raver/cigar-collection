import { describe, expect, it } from 'vitest';
import { buildCigarNameSortKey } from '../src/services/cigar-sort.js';

function rebuildSlug(oldSlug: string, newNameSortKey: string): string {
  const lastDashIndex = oldSlug.lastIndexOf('-');
  const nanoidPart = lastDashIndex >= 0 ? oldSlug.slice(lastDashIndex) : `-${Math.random().toString(36).slice(2, 8)}`;
  return newNameSortKey + nanoidPart;
}

describe('Slug regeneration', () => {
  it('preserves nanoid when rebuilding slug with new sort key', () => {
    const oldSlug = 'sheng-li-v-i-c-t-o-r-y-5Sh9zM';
    const newSortKey = 'sheng-li-victory';
    const newSlug = rebuildSlug(oldSlug, newSortKey);
    expect(newSlug).toBe('sheng-li-victory-5Sh9zM');
  });

  it('handles empty slug by generating new nanoid', () => {
    const oldSlug = '';
    const newSortKey = 'hong-shuang-xi';
    const newSlug = rebuildSlug(oldSlug, newSortKey);
    expect(newSlug).toMatch(/^hong-shuang-xi-[a-z0-9]{6}$/);
  });
});

describe('buildCigarNameSortKey', () => {
  describe('中文烟标名', () => {
    it('converts Chinese names into stable pinyin keys', () => {
      expect(buildCigarNameSortKey('阿诗玛')).toBe('cn-a-shi-ma');
      expect(buildCigarNameSortKey('中华')).toBe('cn-zhong-hua');
      expect(buildCigarNameSortKey('红双喜')).toBe('cn-hong-shuang-xi');
    });

    it('handles mixed Chinese-latin names', () => {
      expect(buildCigarNameSortKey('红塔山')).toBe('cn-hong-ta-shan');
      expect(buildCigarNameSortKey('玉溪')).toBe('cn-yu-xi');
      expect(buildCigarNameSortKey('胜利-Victory')).toBe('cn-sheng-li-victory');
    });
  });

  describe('英文/拉丁烟标名', () => {
    it('normalizes spaces and latin characters', () => {
      expect(buildCigarNameSortKey('  Camel  Blue  ')).toBe('en-camel-blue');
      expect(buildCigarNameSortKey('hope')).toBe('en-hope');
      expect(buildCigarNameSortKey('Hilton')).toBe('en-hilton');
      expect(buildCigarNameSortKey('Camel Blue')).toBe('en-camel-blue');
    });

    it('handles multiple spaces and special chars', () => {
      expect(buildCigarNameSortKey('Marlboro  Red')).toBe('en-marlboro-red');
      expect(buildCigarNameSortKey('Davidoff   Gold')).toBe('en-davidoff-gold');
    });
  });

  describe('边界情况', () => {
    it('returns fallback for empty string', () => {
      expect(buildCigarNameSortKey('')).toBe('cigar-unknown');
    });

    it('returns fallback for whitespace-only input', () => {
      expect(buildCigarNameSortKey('   ')).toBe('cigar-unknown');
      expect(buildCigarNameSortKey('\t\n')).toBe('cigar-unknown');
    });

    it('returns fallback for special characters only', () => {
      expect(buildCigarNameSortKey('!!!')).toBe('cigar-unknown');
      expect(buildCigarNameSortKey('@@@')).toBe('cigar-unknown');
      expect(buildCigarNameSortKey('###')).toBe('cigar-unknown');
    });

    it('normalizes names with mixed special characters', () => {
      expect(buildCigarNameSortKey('  @@@Test@@@  ')).toBe('en-test');
      expect(buildCigarNameSortKey('Hello!!!World')).toBe('en-hello-world');
    });
  });

  describe('中英文分组排序', () => {
    it('中文组排在英文组前', () => {
      const cnKey = buildCigarNameSortKey('中华');
      const enKey = buildCigarNameSortKey('Camel Blue');
      expect(cnKey).toBe('cn-zhong-hua');
      expect(enKey).toBe('en-camel-blue');
      expect(cnKey < enKey).toBe(true);
    });

    it('中文组内部按拼音排序', () => {
      const a = buildCigarNameSortKey('阿诗玛');
      const b = buildCigarNameSortKey('中华');
      expect(a < b).toBe(true); // cn-a-shi-ma < cn-zhong-hua
    });

    it('英文组内部按字母排序', () => {
      const a = buildCigarNameSortKey('Camel Blue');
      const b = buildCigarNameSortKey('Hilton');
      expect(a < b).toBe(true); // en-camel-blue < en-hilton
    });
  });

  describe('稳定排序保证', () => {
    it('produces consistent output for same input', () => {
      const name = '红双喜';
      const result1 = buildCigarNameSortKey(name);
      const result2 = buildCigarNameSortKey(name);
      expect(result1).toBe(result2);
    });
  });
});