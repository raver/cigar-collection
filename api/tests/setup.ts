import { vi } from 'vitest';

// ── 可外部覆写的 select 返回值 ──
// 测试文件通过 setSelectResult() 设置下一个 db.select() 的返回值。
// 每次 select() 调用后会**自动重置为 []**，避免测试间泄漏。
let _nextSelectResult: unknown[] = [];
export function setSelectResult(result: unknown[]) {
  _nextSelectResult = result;
}
function consumeSelectResult(): unknown[] {
  const val = _nextSelectResult;
  _nextSelectResult = [];
  return val;
}

function createChainable<T>(resolvedValue: T) {
  const builder: Record<string, any> = {
    then: (onFulfilled: Function) => Promise.resolve(resolvedValue).then(onFulfilled),
    catch: (onRejected: Function) => Promise.resolve(resolvedValue).catch(onRejected),
  };
  builder.from = vi.fn().mockReturnValue(builder);
  builder.where = vi.fn().mockReturnValue(builder);
  builder.orderBy = vi.fn().mockReturnValue(builder);
  builder.limit = vi.fn().mockReturnValue(builder);
  builder.offset = vi.fn().mockResolvedValue(resolvedValue);
  builder.returning = vi.fn().mockResolvedValue(resolvedValue);
  return builder;
}

vi.mock('../src/db/index.js', () => {
  const commentRow = {
    id: 1, cigarId: null, authorName: 'Test',
    authorEmail: 'test@example.com', content: 'Hello',
    quoteId: null, status: 'pending', createdAt: new Date(),
  };

  return {
    db: {
      // 每次 select() 创建一个新 builder，使用当前的 _nextSelectResult 值后自动重置
      select: vi.fn().mockImplementation(() => createChainable(consumeSelectResult())),
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([commentRow]),
        }),
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    },
    schema: {},
  };
});
