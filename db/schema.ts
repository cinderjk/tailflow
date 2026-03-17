import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	dataJson: text('data_json'),
	htmlContent: text('html_content'),
	userId: text('user_id').notNull(),
	createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at').notNull().default(sql`(strftime('%s', 'now'))`),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;