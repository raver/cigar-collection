import { pgTable, serial, varchar, text, timestamp, integer, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const eraEnum = pgEnum('era', ['80年代', '90年代', '2000年以后', '不详']);
export const commentStatusEnum = pgEnum('comment_status', ['pending', 'approved', 'rejected', 'hidden', 'deleted']);

// 管理员表
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
});

// 烟标表
export const cigars = pgTable('cigars', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  nameSortKey: varchar('name_sort_key', { length: 255 }),
  factory: varchar('factory', { length: 100 }).notNull(),
  era: eraEnum('era').notNull(),
  theme: varchar('theme', { length: 50 }).notNull(),
  imageOriginal: varchar('image_original', { length: 255 }).notNull(),
  imageWatermarked: varchar('image_watermarked', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  nameSortKeyIdx: index('cigars_name_sort_key_idx').on(table.nameSortKey, table.id),
}));

// 留言表
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  cigarId: integer('cigar_id').references((): any => cigars.id, { onDelete: 'cascade' }),
  authorName: varchar('author_name', { length: 50 }).notNull(),
  authorEmail: varchar('author_email', { length: 100 }),
  content: text('content').notNull(),
  quoteId: integer('quote_id').references((): any => comments.id, { onDelete: 'set null' }),
  status: commentStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const cigarsRelations = relations(cigars, ({ many }) => ({
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  cigar: one(cigars, { fields: [comments.cigarId], references: [cigars.id] }),
  quote: one(comments, { fields: [comments.quoteId], references: [comments.id], relationName: 'quote' }),
}));

// Type exports
export type Cigar = typeof cigars.$inferSelect;
export type NewCigar = typeof cigars.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Admin = typeof admins.$inferSelect;
