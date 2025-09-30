import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class', // Enable class-based dark mode
	theme: {
		extend: {
			colors: {
				// Colores Principales
				primary: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#19a1e6', // Color principal
					600: '#127ab3', // Primario oscuro
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
					950: '#082f49'
				},

				// Colores Secundarios
				secondary: {
					50: '#fef7ed',
					100: '#feeecb',
					200: '#fdd99c',
					300: '#fcbd5c',
					400: '#f4a261', // Secundario/CTA
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
					950: '#451a03'
				},

				// Estados
				success: {
					50: '#ecfdf5',
					100: '#d1fae5',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#2a9d8f', // Verde lima
					600: '#059669',
					700: '#047857',
					800: '#065f46',
					900: '#064e3b',
					950: '#022c22'
				},
				error: {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#e76f51', // Rojo coral
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d',
					950: '#450a0a'
				},
				warning: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
					950: '#451a03'
				},

				// Colores semánticos
				background: 'var(--color-background)',
				surface: 'var(--color-surface)',
				border: 'var(--color-border)',
				foreground: 'var(--color-foreground)',
				muted: 'var(--color-muted)',
				'muted-foreground': 'var(--color-muted-foreground)',

				// Text colors with CSS variables
				'text-primary': 'var(--color-text-primary)',
				'text-secondary': 'var(--color-text-secondary)',
				'text-tertiary': 'var(--color-text-tertiary)',
				'text-disabled': 'var(--color-text-disabled)',
				'text-inverse': 'var(--color-text-inverse)',
				'text-link': 'var(--color-text-link)',
				'text-link-hover': 'var(--color-text-link-hover)',
				'text-success': 'var(--color-text-success)',
				'text-warning': 'var(--color-text-warning)',
				'text-error': 'var(--color-text-error)',

				// Neutros
				neutral: {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#e5e5e5',
					300: '#d4d4d4',
					400: '#a3a3a3',
					500: '#737373',
					600: '#666666',
					700: '#404040',
					800: '#2f2f2f',
					900: '#171717',
					950: '#0a0a0a'
				}
			},

			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif']
			},

			fontSize: {
				// Display
				'display-2xl': ['4.5rem', { lineHeight: '1.1', fontWeight: '700' }], // 72px
				'display-xl': ['3.75rem', { lineHeight: '1.2', fontWeight: '700' }], // 60px
				'display-lg': ['3rem', { lineHeight: '1.2', fontWeight: '600' }], // 48px

				// Headings
				h1: ['2.25rem', { lineHeight: '1.25', fontWeight: '700' }], // 36px
				h2: ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }], // 30px
				h3: ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }], // 24px
				h4: ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }], // 20px

				// Body
				'body-xl': ['1.25rem', { lineHeight: '1.6', fontWeight: '400' }], // 20px
				'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // 18px
				body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // 16px
				'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px
				caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }], // 12px

				// Button
				button: ['1rem', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0.025em' }]
			},

			spacing: {
				// Espaciado específico para componentes
				'button-sm-x': '0.75rem', // 12px
				'button-sm-y': '0.25rem', // 4px
				'button-md-x': '1rem', // 16px
				'button-md-y': '0.5rem', // 8px
				'button-lg-x': '1.5rem', // 24px
				'button-lg-y': '0.75rem', // 12px
				'card-sm': '1rem', // 16px
				'card-md': '1.5rem', // 24px
				'card-lg': '2rem', // 32px
				'input-x': '0.75rem', // 12px
				'input-y': '0.5rem' // 8px
			},

			borderRadius: {
				'button-sm': '0.25rem', // 4px
				'button-md': '0.375rem', // 6px
				'button-lg': '0.5rem', // 8px
				'card-sm': '0.5rem', // 8px
				'card-md': '0.75rem', // 12px
				'card-lg': '1rem', // 16px
				input: '0.375rem' // 6px
			},

			boxShadow: {
				// Sombras suaves con tinte del color primario
				'soft-xs': '0 1px 2px 0 rgba(25, 161, 230, 0.05)',
				'soft-sm': '0 1px 3px 0 rgba(25, 161, 230, 0.1), 0 1px 2px -1px rgba(25, 161, 230, 0.1)',
				soft: '0 4px 6px -1px rgba(25, 161, 230, 0.1), 0 2px 4px -2px rgba(25, 161, 230, 0.1)',
				'soft-md':
					'0 10px 15px -3px rgba(25, 161, 230, 0.1), 0 4px 6px -4px rgba(25, 161, 230, 0.1)',
				'soft-lg':
					'0 20px 25px -5px rgba(25, 161, 230, 0.1), 0 8px 10px -6px rgba(25, 161, 230, 0.1)',
				'soft-xl': '0 25px 50px -12px rgba(25, 161, 230, 0.25)',
				'soft-2xl': '0 50px 100px -20px rgba(25, 161, 230, 0.25)',

				// Sombras para cards
				card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
				'card-hover':
					'0 10px 15px -3px rgba(25, 161, 230, 0.15), 0 4px 6px -4px rgba(25, 161, 230, 0.15)',

				// Sombras neutrales para modals y dropdowns
				modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
				dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
			},

			ringColor: {
				// Focus rings con estados
				'focus-primary': 'rgba(25, 161, 230, 0.5)',
				'focus-error': 'rgba(231, 111, 81, 0.5)',
				'focus-success': 'rgba(42, 157, 143, 0.5)',
				'focus-warning': 'rgba(244, 162, 97, 0.5)'
			},

			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'scale-in': 'scaleIn 0.2s ease-out'
			},

			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				scaleIn: {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			}
		}
	},
	plugins: []
};

export default config;
