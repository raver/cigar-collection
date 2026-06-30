import { pinyin } from 'pinyin-pro';

const cjkPattern = /[㐀-鿿豈-﫿]/;

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function buildCigarNameSortKey(name: string): string {
  const trimmedName = name.trim();
  if (!trimmedName) return 'cigar-unknown';

  if (!cjkPattern.test(trimmedName)) {
    const normalized = normalizeString(trimmedName);
    return normalized || 'cigar-unknown';
  }

  let result = '';
  let i = 0;

  while (i < trimmedName.length) {
    const char = trimmedName[i];

    if (cjkPattern.test(char)) {
      const j = i;
      while (i < trimmedName.length && cjkPattern.test(trimmedName[i])) {
        i++;
      }
      const cjkText = trimmedName.slice(j, i);
      const cjkPinyin = pinyin(cjkText, { toneType: 'none', type: 'array' })
        .join('-')
        .toLowerCase();
      result += (result ? '-' : '') + cjkPinyin;
    } else {
      const j = i;
      while (i < trimmedName.length && !cjkPattern.test(trimmedName[i])) {
        i++;
      }
      const nonCjkText = trimmedName.slice(j, i);
      const normalized = normalizeString(nonCjkText);
      if (normalized) {
        result += (result ? '-' : '') + normalized;
      }
    }
  }

  return result || 'cigar-unknown';
}
