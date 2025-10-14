import { requireAuth } from '$lib/utils/auth-guard';
import { requirePermission } from '$lib/utils/permission-guard';

export const load = async () => {
	await requireAuth();
	requirePermission({
		permission: 'users.read',
		redirectTo: '/users'
	});
	return {};
};
