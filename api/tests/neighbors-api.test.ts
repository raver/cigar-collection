import { describe, it, expect, beforeEach } from 'vitest';
import app from '../src/index.js';
import { setSelectResult } from './setup.js';

/**
 * neighbors 端点测试
 *
 * 测试策略：mock db.select() 返回排序后的烟标列表，
 * 验证 prev/next 边界、筛选参数、404 兜底。
 */

const cigarList = [
  { slug: 'cn-ashima',       name: '阿诗玛',   imageWatermarked: 'https://r2.dev/ashima.jpg' },
  { slug: 'cn-bai-hua',      name: '百花',     imageWatermarked: 'https://r2.dev/baihua.jpg' },
  { slug: 'cn-hong-tashan',  name: '红塔山',    imageWatermarked: 'https://r2.dev/hongtashan.jpg' },
  { slug: 'cn-sheng-li',     name: '胜利',     imageWatermarked: 'https://r2.dev/shengli.jpg' },
  { slug: 'cn-yun-yan',      name: '云烟',     imageWatermarked: 'https://r2.dev/yunyan.jpg' },
];

describe('Neighbors API', () => {
  beforeEach(() => {
    setSelectResult([]);
  });

  it('returns prev and next for a middle item', async () => {
    setSelectResult(cigarList);
    const res = await app.request('/api/cigars/cn-hong-tashan/neighbors');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.current).toBe(3);
    expect(body.total).toBe(5);
    expect(body.prev).toEqual({
      slug: 'cn-bai-hua',
      name: '百花',
      imageWatermarked: 'https://r2.dev/baihua.jpg',
    });
    expect(body.next).toEqual({
      slug: 'cn-sheng-li',
      name: '胜利',
      imageWatermarked: 'https://r2.dev/shengli.jpg',
    });
  });

  it('returns null prev for the first item', async () => {
    setSelectResult(cigarList);
    const res = await app.request('/api/cigars/cn-ashima/neighbors');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.current).toBe(1);
    expect(body.total).toBe(5);
    expect(body.prev).toBeNull();
    expect(body.next).toBeDefined();
    expect(body.next.slug).toBe('cn-bai-hua');
  });

  it('returns null next for the last item', async () => {
    setSelectResult(cigarList);
    const res = await app.request('/api/cigars/cn-yun-yan/neighbors');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.current).toBe(5);
    expect(body.total).toBe(5);
    expect(body.prev).toBeDefined();
    expect(body.prev.slug).toBe('cn-sheng-li');
    expect(body.next).toBeNull();
  });

  it('returns null prev and null next for a single-item list', async () => {
    setSelectResult([cigarList[1]]);
    const res = await app.request('/api/cigars/cn-bai-hua/neighbors');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.current).toBe(1);
    expect(body.total).toBe(1);
    expect(body.prev).toBeNull();
    expect(body.next).toBeNull();
  });

  it('returns 404 for a nonexistent slug', async () => {
    setSelectResult(cigarList);
    const res = await app.request('/api/cigars/nonexistent/neighbors');
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  describe('filtering', () => {
    const factoryFilteredList = [
      { slug: 'cn-bai-hua',    name: '百花',   imageWatermarked: '' },
      { slug: 'cn-hong-tashan', name: '红塔山', imageWatermarked: '' },
    ];

    it('respects factory filter — first item in result', async () => {
      setSelectResult(factoryFilteredList);
      const res = await app.request('/api/cigars/cn-bai-hua/neighbors?factory=新郑');
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.total).toBe(2);
      expect(body.current).toBe(1);
      expect(body.prev).toBeNull();
      expect(body.next.slug).toBe('cn-hong-tashan');
    });

    it('respects factory + era filters — last item in result', async () => {
      setSelectResult(factoryFilteredList);
      const res = await app.request('/api/cigars/cn-hong-tashan/neighbors?factory=新郑&era=80年代');
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.total).toBe(2);
      expect(body.current).toBe(2);
      expect(body.prev.slug).toBe('cn-bai-hua');
      expect(body.next).toBeNull();
    });

    it('returns 404 for slug not in the filtered result', async () => {
      setSelectResult([cigarList[0], cigarList[2]]);
      const res = await app.request('/api/cigars/cn-bai-hua/neighbors?factory=新郑');
      expect(res.status).toBe(404);
    });
  });
});
