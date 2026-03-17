import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import {
	deleteDevProject,
	getDevProject,
	updateDevProject,
	upsertDevProject,
} from '../../../lib/projects-dev-store';
import { projects } from '../../../../db/schema';

export const prerender = false;

interface SaveProjectPayload {
	name?: string;
	dataJson?: unknown;
	htmlContent?: string;
	userId?: string;
}

type UpdateProjectPayload = {
	name?: string;
	dataJson?: unknown;
	htmlContent?: string | null;
	userId?: string;
};

const getDbFromLocals = (locals: App.Locals) => {
	const dbBinding = locals.runtime?.env?.tailflowdb;

	if (!dbBinding) {
		return null;
	}

	return drizzle(dbBinding);
};

export const GET: APIRoute = async ({ params, locals }) => {
	const projectId = params.id;

	if (!projectId) {
		return new Response(JSON.stringify({ error: 'Project id is required.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const db = getDbFromLocals(locals);

	if (!db) {
		const project = getDevProject(projectId);

		if (!project) {
			return new Response(JSON.stringify({ error: 'Project not found.' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		let parsedDataJson: unknown = null;
		if (project.dataJson) {
			try {
				parsedDataJson = JSON.parse(project.dataJson);
			} catch {
				parsedDataJson = null;
			}
		}

		return new Response(
			JSON.stringify({
				success: true,
				project: {
					...project,
					dataJson: parsedDataJson,
				},
				mode: 'memory',
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	}

	const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

	if (!project) {
		return new Response(JSON.stringify({ error: 'Project not found.' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	let parsedDataJson: unknown = null;
	if (project.dataJson) {
		try {
			parsedDataJson = JSON.parse(project.dataJson);
		} catch {
			parsedDataJson = null;
		}
	}

	return new Response(
		JSON.stringify({
			success: true,
			project: {
				...project,
				dataJson: parsedDataJson,
			},
		}),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		},
	);
};

export const POST: APIRoute = async ({ params, request, locals }) => {
	const projectId = params.id;

	if (!projectId) {
		return new Response(JSON.stringify({ error: 'Project id is required.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	let payload: SaveProjectPayload;

	try {
		payload = (await request.json()) as SaveProjectPayload;
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON payload.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const name = payload.name?.trim() || `Project ${projectId}`;
	const userId = payload.userId?.trim() || 'demo-user';
	const dataJson = payload.dataJson ? JSON.stringify(payload.dataJson) : null;
	const htmlContent = payload.htmlContent ?? null;
	const timestamp = Math.floor(Date.now() / 1000);
	const db = getDbFromLocals(locals);

	if (!db) {
		const existing = getDevProject(projectId);
		const project = upsertDevProject({
			id: projectId,
			name,
			dataJson,
			htmlContent,
			userId,
			createdAt: existing?.createdAt ?? timestamp,
			updatedAt: timestamp,
		});

		return new Response(JSON.stringify({ success: true, project, mode: 'memory' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	await db
		.insert(projects)
		.values({
			id: projectId,
			name,
			dataJson,
			htmlContent,
			userId,
			updatedAt: timestamp,
		})
		.onConflictDoUpdate({
			target: projects.id,
			set: {
				name,
				dataJson,
				htmlContent,
				userId,
				updatedAt: timestamp,
			},
		});

	const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

	return new Response(JSON.stringify({ success: true, project }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};

export const PATCH: APIRoute = async ({ params, request, locals }) => {
	const projectId = params.id;

	if (!projectId) {
		return new Response(JSON.stringify({ error: 'Project id is required.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	let payload: UpdateProjectPayload;

	try {
		payload = (await request.json()) as UpdateProjectPayload;
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON payload.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const hasAnyField =
		'name' in payload || 'dataJson' in payload || 'htmlContent' in payload || 'userId' in payload;

	if (!hasAnyField) {
		return new Response(JSON.stringify({ error: 'No fields provided for update.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const timestamp = Math.floor(Date.now() / 1000);
	const set: Partial<typeof projects.$inferInsert> = {
		updatedAt: timestamp,
	};

	if ('name' in payload) {
		set.name = payload.name?.trim() || `Project ${projectId}`;
	}

	if ('userId' in payload) {
		set.userId = payload.userId?.trim() || 'demo-user';
	}

	if ('dataJson' in payload) {
		set.dataJson = payload.dataJson == null ? null : JSON.stringify(payload.dataJson);
	}

	if ('htmlContent' in payload) {
		set.htmlContent = payload.htmlContent ?? null;
	}

	const db = getDbFromLocals(locals);

	if (!db) {
		const project = updateDevProject(projectId, {
			...(set.name ? { name: set.name } : {}),
			...(set.userId ? { userId: set.userId } : {}),
			...(Object.prototype.hasOwnProperty.call(set, 'dataJson') ? { dataJson: set.dataJson ?? null } : {}),
			...(Object.prototype.hasOwnProperty.call(set, 'htmlContent')
				? { htmlContent: set.htmlContent ?? null }
				: {}),
			updatedAt: timestamp,
		});

		if (!project) {
			return new Response(JSON.stringify({ error: 'Project not found.' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({ success: true, project, mode: 'memory' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}
	const [existingProject] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

	if (!existingProject) {
		return new Response(JSON.stringify({ error: 'Project not found.' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	await db.update(projects).set(set).where(eq(projects.id, projectId));
	const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

	return new Response(JSON.stringify({ success: true, project }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};

export const DELETE: APIRoute = async ({ params, locals }) => {
	const projectId = params.id;

	if (!projectId) {
		return new Response(JSON.stringify({ error: 'Project id is required.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const db = getDbFromLocals(locals);

	if (!db) {
		const deleted = deleteDevProject(projectId);

		if (!deleted) {
			return new Response(JSON.stringify({ error: 'Project not found.' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({ success: true, deletedId: projectId, mode: 'memory' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}
	const [existingProject] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

	if (!existingProject) {
		return new Response(JSON.stringify({ error: 'Project not found.' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	await db.delete(projects).where(eq(projects.id, projectId));

	return new Response(JSON.stringify({ success: true, deletedId: projectId }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};