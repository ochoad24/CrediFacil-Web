<script lang="ts">
	import { userPreferencesStore } from '$lib/stores/cookies';
	import { Card, CardContent, Button, Input, Select, selectHelpers } from '$lib/components/ui';

	// Reactive reference to preferences
	$: preferences = $userPreferencesStore;

	function updateNotifications(event: Event) {
		const target = event.target as HTMLInputElement;
		userPreferencesStore.updatePartial({ notifications: target.checked });
	}

	function updateLanguage(event: CustomEvent) {
		userPreferencesStore.updatePartial({ language: event.detail.value });
	}

	function updateCurrency(event: CustomEvent) {
		userPreferencesStore.updatePartial({ currency: event.detail.value });
	}

	function resetPreferences() {
		userPreferencesStore.reset();
	}

	const languages = [
		{ value: 'es', label: 'Español' },
		{ value: 'en', label: 'English' },
		{ value: 'pt', label: 'Português' }
	];

	const currencies = [
		{ value: 'COP', label: 'Peso Colombiano (COP)' },
		{ value: 'USD', label: 'Dólar Americano (USD)' },
		{ value: 'EUR', label: 'Euro (EUR)' }
	];
</script>

<Card className="max-w-lg">
	<CardContent className="p-6">
		<h3 class="text-lg font-semibold mb-4">Preferencias de Usuario</h3>

		<div class="space-y-4">
			<!-- Notifications -->
			<div class="flex items-center justify-between">
				<label for="notifications" class="text-sm font-medium"> Notificaciones </label>
				<label class="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						id="notifications"
						class="sr-only peer"
						checked={preferences.notifications}
						on:change={updateNotifications}
					/>
					<div
						class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
					></div>
				</label>
			</div>

			<!-- Language -->
			<div>
				<Select
					label="Idioma"
					value={preferences.language}
					items={languages}
					getValue={(item) => item.value}
					getLabel={(item) => item.label}
					on:change={updateLanguage}
					className="w-full"
				/>
			</div>

			<!-- Currency -->
			<div>
				<Select
					label="Moneda"
					value={preferences.currency}
					items={currencies}
					getValue={(item) => item.value}
					getLabel={(item) => item.label}
					on:change={updateCurrency}
					className="w-full"
				/>
			</div>

			<!-- Actions -->
			<div class="flex gap-2 pt-4">
				<Button variant="outline" size="sm" on:click={resetPreferences}>Restablecer</Button>
			</div>
		</div>

		<!-- Debug info (remove in production) -->
		<details class="mt-6">
			<summary class="cursor-pointer text-xs text-gray-500"> Debug: Preferencias actuales </summary>
			<pre class="text-xs bg-gray-100 p-2 mt-2 rounded overflow-auto">
				{JSON.stringify(preferences, null, 2)}
			</pre>
		</details>
	</CardContent>
</Card>
