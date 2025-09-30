<script lang="ts">
	import { themeStore, currentTheme } from '$lib/stores/cookies';
	import { Button } from '$lib/components/ui';

	function toggleTheme() {
		const themes = ['light', 'dark', 'auto'] as const;
		const currentIndex = themes.indexOf($currentTheme);
		const nextIndex = (currentIndex + 1) % themes.length;
		themeStore.set(themes[nextIndex]);
	}

	function getThemeIcon(theme: string): string {
		switch (theme) {
			case 'light':
				return 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z';
			case 'dark':
				return 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z';
			case 'auto':
			default:
				return 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
		}
	}

	function getThemeLabel(theme: string) {
		switch (theme) {
			case 'light':
				return 'Claro';
			case 'dark':
				return 'Oscuro';
			case 'auto':
				return 'Auto';
			default:
				return 'Auto';
		}
	}
</script>

<Button
	variant="outline"
	size="sm"
	on:click={toggleTheme}
	className="flex items-center gap-2"
	title="Cambiar tema: {getThemeLabel($currentTheme)}"
	aria-label="Cambiar tema: {getThemeLabel($currentTheme)}"
>
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d={getThemeIcon($currentTheme)}
		/>
	</svg>
	<span class="hidden sm:inline">{getThemeLabel($currentTheme)}</span>
</Button>
