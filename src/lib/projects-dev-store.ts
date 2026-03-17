export type DevProject = {
	id: string;
	name: string;
	dataJson: string | null;
	htmlContent: string | null;
	userId: string;
	createdAt: number;
	updatedAt: number;
};

type DevProjectStore = Map<string, DevProject>;

declare global {
	var __tailflowProjectStore__: DevProjectStore | undefined;
}

const getStore = (): DevProjectStore => {
	if (!globalThis.__tailflowProjectStore__) {
		globalThis.__tailflowProjectStore__ = new Map<string, DevProject>();
	}

	return globalThis.__tailflowProjectStore__;
};

export const listDevProjects = (): DevProject[] => {
	return [...getStore().values()].sort((a, b) => b.updatedAt - a.updatedAt);
};

export const getDevProject = (id: string): DevProject | null => {
	return getStore().get(id) ?? null;
};

export const createDevProject = (project: DevProject): DevProject => {
	getStore().set(project.id, project);
	return project;
};

export const upsertDevProject = (project: DevProject): DevProject => {
	getStore().set(project.id, project);
	return project;
};

export const updateDevProject = (
	id: string,
	updates: Partial<Omit<DevProject, 'id' | 'createdAt'>>,
): DevProject | null => {
	const existing = getStore().get(id);
	if (!existing) {
		return null;
	}

	const next: DevProject = {
		...existing,
		...updates,
	};

	getStore().set(id, next);
	return next;
};

export const deleteDevProject = (id: string): boolean => {
	return getStore().delete(id);
};
