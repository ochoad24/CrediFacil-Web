import { writable, derived } from 'svelte/store';
import type { Credit, CreditRequest } from '$lib/types/credit';

interface CreditsState {
	credits: Credit[];
	currentCredit: Credit | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: CreditsState = {
	credits: [],
	currentCredit: null,
	isLoading: false,
	error: null
};

function createCreditsStore() {
	const { subscribe, set, update } = writable<CreditsState>(initialState);

	return {
		subscribe,

		// Actions
		fetchCredits: async () => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await fetch('/api/credits');
				if (!response.ok) throw new Error('Failed to fetch credits');

				const credits = await response.json();
				update((state) => ({
					...state,
					credits,
					isLoading: false
				}));
			} catch (error) {
				update((state) => ({
					...state,
					error: error.message,
					isLoading: false
				}));
			}
		},

		createCredit: async (creditRequest: CreditRequest) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await fetch('/api/credits', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(creditRequest)
				});

				if (!response.ok) throw new Error('Failed to create credit');

				const newCredit = await response.json();
				update((state) => ({
					...state,
					credits: [...state.credits, newCredit],
					isLoading: false
				}));

				return newCredit;
			} catch (error) {
				update((state) => ({
					...state,
					error: error.message,
					isLoading: false
				}));
				throw error;
			}
		},

		updateCredit: async (id: string, updates: Partial<Credit>) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await fetch(`/api/credits/${id}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updates)
				});

				if (!response.ok) throw new Error('Failed to update credit');

				const updatedCredit = await response.json();
				update((state) => ({
					...state,
					credits: state.credits.map((credit) => (credit.id === id ? updatedCredit : credit)),
					currentCredit: state.currentCredit?.id === id ? updatedCredit : state.currentCredit,
					isLoading: false
				}));

				return updatedCredit;
			} catch (error) {
				update((state) => ({
					...state,
					error: error.message,
					isLoading: false
				}));
				throw error;
			}
		},

		setCurrentCredit: (credit: Credit | null) => {
			update((state) => ({ ...state, currentCredit: credit }));
		},

		clearError: () => {
			update((state) => ({ ...state, error: null }));
		}
	};
}

export const creditsStore = createCreditsStore();

// Derived stores
export const activeCredits = derived(creditsStore, ($credits) =>
	$credits.credits.filter((credit) => credit.status === 'active')
);

export const pendingCredits = derived(creditsStore, ($credits) =>
	$credits.credits.filter((credit) => credit.status === 'pending')
);
