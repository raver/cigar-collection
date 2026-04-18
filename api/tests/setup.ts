import { vi } from 'vitest';

// Mock the db module so tests don't require a real database connection
vi.mock('../src/db/index.js', () => {
  // Track how many times select has been called to return different results
  let selectCallIndex = 0;

  const createChainable = (resolvedValue: unknown) => {
    const builder: Record<string, any> = {
      then(onFulfilled: Function) {
        return Promise.resolve(resolvedValue).then(onFulfilled);
      },
      catch(onRejected: Function) {
        return Promise.resolve(resolvedValue).catch(onRejected);
      },
    };
    builder.from = vi.fn().mockReturnValue(builder);
    builder.where = vi.fn().mockReturnValue(builder);
    builder.orderBy = vi.fn().mockReturnValue(builder);
    builder.limit = vi.fn().mockReturnValue(builder);
    builder.offset = vi.fn().mockResolvedValue(resolvedValue);
    builder.returning = vi.fn().mockResolvedValue([{
      id: 1,
      cigarId: null,
      authorName: 'Test',
      authorEmail: 'test@example.com',
      content: 'Hello',
      quoteId: null,
      status: 'pending',
      createdAt: new Date(),
    }]);
    return builder;
  };

  const mockSelect = vi.fn().mockImplementation(() => {
    selectCallIndex++;
    // First select in guestbook handler is the count query
    // It expects [{ total: <number> }]
    if (selectCallIndex % 2 === 1) {
      // Odd call: could be count query or regular query
      // We return a builder that resolves to an array with a total field
      return createChainable([{ total: 0 }]);
    }
    return createChainable([]);
  });

  const mockInsert = vi.fn().mockImplementation((table: any) => {
    // Return different data based on which table is being inserted into
    const commentRow = {
      id: 1,
      cigarId: null,
      authorName: 'Test',
      authorEmail: 'test@example.com',
      content: 'Hello',
      quoteId: null,
      status: 'pending',
      createdAt: new Date(),
    };
    const cigarRow = {
      id: 1,
      name: 'Test Cigar',
      factory: 'Test Factory',
      era: '80年代',
      theme: 'classic',
      imageOriginal: 'originals/test-cigar-abc123.jpg',
      imageWatermarked: 'watermarked/test-cigar-abc123.jpg',
      slug: 'test-cigar-abc123',
      createdAt: new Date(),
    };
    // Default to commentRow for backward compatibility
    const row = commentRow;
    return {
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([row]),
      }),
    };
  });

  const mockUpdate = vi.fn().mockReturnValue({
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    }),
  });

  const mockDelete = vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(undefined),
  });

  return {
    db: {
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    },
    schema: {},
  };
});
