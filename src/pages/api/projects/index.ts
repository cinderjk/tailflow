import type { APIRoute } from 'astro';
import { desc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { createDevProject, listDevProjects } from '../../../lib/projects-dev-store';
import { projects } from '../../../../db/schema';

export const prerender = false;

interface CreateProjectPayload {
	name?: string;
	userId?: string;
}

const getDbFromLocals = (locals: App.Locals) => {
	const dbBinding = locals.runtime?.env?.tailflowdb;

	if (!dbBinding) {
		return null;
	}

	return drizzle(dbBinding);
};

export const GET: APIRoute = async ({ locals }) => {
	const db = getDbFromLocals(locals);

	if (!db) {
		const items = listDevProjects().map((item) => ({
			id: item.id,
			name: item.name,
			userId: item.userId,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
		}));

		return new Response(JSON.stringify({ success: true, items, mode: 'memory' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const items = await db
		.select({
			id: projects.id,
			name: projects.name,
			userId: projects.userId,
			createdAt: projects.createdAt,
			updatedAt: projects.updatedAt,
		})
		.from(projects)
		.orderBy(desc(projects.updatedAt));

	return new Response(JSON.stringify({ success: true, items }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};

export const POST: APIRoute = async ({ request, locals }) => {
	let payload: CreateProjectPayload = {};

	try {
		payload = (await request.json()) as CreateProjectPayload;
	} catch {
		payload = {};
	}

	const timestamp = Math.floor(Date.now() / 1000);
	const id = crypto.randomUUID();
	const name = payload.name?.trim() || `Project ${id.slice(0, 8)}`;
	const userId = payload.userId?.trim() || 'demo-user';
	const db = getDbFromLocals(locals);

	if (!db) {
		const project = createDevProject({
			id,
			name,
			userId,
			dataJson: null,
			htmlContent: null,
			createdAt: timestamp,
			updatedAt: timestamp,
		});

		return new Response(
			JSON.stringify({
				success: true,
				project,
				editorUrl: `/editor/${id}`,
				mode: 'memory',
			}),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	}

	await db.insert(projects).values({
		id,
		name,
		userId,
		createdAt: timestamp,
		updatedAt: timestamp,
	});

	return new Response(
		JSON.stringify({
			success: true,
			project: { id, name, userId, createdAt: timestamp, updatedAt: timestamp },
			editorUrl: `/editor/${id}`,
		}),
		{
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		},
	);
};