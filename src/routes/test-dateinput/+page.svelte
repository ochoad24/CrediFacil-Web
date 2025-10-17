<script lang="ts">
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let dateValue = '';
	let datetimeValue = '';
	let dateWithError = '';
	let dateWithLabel = '';

	function handleSubmit() {
		console.log('Date (ISO 8601 UTC):', dateValue);
		console.log('DateTime (ISO 8601 UTC):', datetimeValue);
		console.log('Date with Error:', dateWithError);
		console.log('Date with Label:', dateWithLabel);

		alert(
			`Valores enviados:\n\nFecha: ${dateValue}\nFecha-Hora: ${datetimeValue}\nFecha con Error: ${dateWithError}\nFecha con Label: ${dateWithLabel}`
		);
	}

	function clearValues() {
		dateValue = '';
		datetimeValue = '';
		dateWithError = '';
		dateWithLabel = '';
	}

	function setTestValues() {
		// Set to current date/time in ISO format
		const now = new Date();
		dateValue = now.toISOString();
		datetimeValue = now.toISOString();
		dateWithLabel = new Date('2025-12-25T18:00:00Z').toISOString(); // Christmas example
	}
</script>

<div class="min-h-screen bg-background p-8">
	<div class="max-w-4xl mx-auto space-y-8">
		<div class="bg-surface p-6 rounded-lg border border-border">
			<h1 class="text-3xl font-bold text-foreground mb-2">DateInput Component Test</h1>
			<p class="text-muted-foreground mb-4">
				Componente de fecha para Guatemala (formato visual DD/MM/YYYY, retorno ISO 8601 UTC)
			</p>
		</div>

		<!-- Test Cases -->
		<div class="bg-surface p-6 rounded-lg border border-border space-y-6">
			<h2 class="text-xl font-semibold text-foreground mb-4">Casos de Prueba</h2>

			<!-- Basic Date Input -->
			<div>
				<h3 class="text-lg font-medium text-foreground mb-2">1. Fecha Simple (mode="date")</h3>
				<DateInput bind:value={dateValue} mode="date" placeholder="Selecciona una fecha" />
				<p class="mt-2 text-sm text-muted-foreground">
					Valor ISO 8601 UTC: <code class="text-primary-600">{dateValue || '(vacío)'}</code>
				</p>
			</div>

			<!-- DateTime Input -->
			<div>
				<h3 class="text-lg font-medium text-foreground mb-2">
					2. Fecha y Hora (mode="datetime")
				</h3>
				<DateInput
					bind:value={datetimeValue}
					mode="datetime"
					placeholder="Selecciona fecha y hora"
				/>
				<p class="mt-2 text-sm text-muted-foreground">
					Valor ISO 8601 UTC: <code class="text-primary-600">{datetimeValue || '(vacío)'}</code>
				</p>
			</div>

			<!-- Date Input with Error -->
			<div>
				<h3 class="text-lg font-medium text-foreground mb-2">3. Con Mensaje de Error</h3>
				<DateInput
					bind:value={dateWithError}
					mode="date"
					error="Este campo es requerido"
					placeholder="Fecha obligatoria"
				/>
			</div>

			<!-- Date Input with Label -->
			<div>
				<h3 class="text-lg font-medium text-foreground mb-2">4. Con Label</h3>
				<DateInput
					bind:value={dateWithLabel}
					mode="datetime"
					label="Fecha de Nacimiento"
					placeholder="Selecciona tu fecha de nacimiento"
				/>
			</div>

			<!-- Disabled State -->
			<div>
				<h3 class="text-lg font-medium text-foreground mb-2">5. Estado Deshabilitado</h3>
				<DateInput
					value="2025-01-01T00:00:00Z"
					mode="date"
					disabled={true}
					placeholder="Campo deshabilitado"
				/>
			</div>

			<!-- Custom Classes -->
			<div>
				<h3 class="text-lg font-medium text-foreground mb-2">6. Con Clases Personalizadas</h3>
				<DateInput
					bind:value={dateValue}
					mode="date"
					className="border-2 border-primary-500"
					placeholder="Input con borde personalizado"
				/>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="bg-surface p-6 rounded-lg border border-border">
			<h2 class="text-xl font-semibold text-foreground mb-4">Acciones de Prueba</h2>
			<div class="flex flex-wrap gap-4">
				<button
					onclick={handleSubmit}
					class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
				>
					Ver Valores (Console + Alert)
				</button>
				<button
					onclick={setTestValues}
					class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
				>
					Establecer Valores de Prueba
				</button>
				<button
					onclick={clearValues}
					class="px-4 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500"
				>
					Limpiar Todos
				</button>
			</div>
		</div>

		<!-- Output Display -->
		<div class="bg-surface p-6 rounded-lg border border-border">
			<h2 class="text-xl font-semibold text-foreground mb-4">Valores Actuales (ISO 8601 UTC)</h2>
			<div class="space-y-2 font-mono text-sm">
				<div class="flex">
					<span class="text-muted-foreground w-32">dateValue:</span>
					<span class="text-primary-600">{dateValue || '(vacío)'}</span>
				</div>
				<div class="flex">
					<span class="text-muted-foreground w-32">datetimeValue:</span>
					<span class="text-primary-600">{datetimeValue || '(vacío)'}</span>
				</div>
				<div class="flex">
					<span class="text-muted-foreground w-32">dateWithError:</span>
					<span class="text-primary-600">{dateWithError || '(vacío)'}</span>
				</div>
				<div class="flex">
					<span class="text-muted-foreground w-32">dateWithLabel:</span>
					<span class="text-primary-600">{dateWithLabel || '(vacío)'}</span>
				</div>
			</div>
		</div>

		<!-- Comparison with standard Input -->
		<div class="bg-surface p-6 rounded-lg border border-border">
			<h2 class="text-xl font-semibold text-foreground mb-4">
				Comparación con Input Component
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h3 class="text-sm font-medium text-foreground mb-2">DateInput</h3>
					<DateInput bind:value={dateValue} mode="date" label="Fecha" />
				</div>
				<div>
					<h3 class="text-sm font-medium text-foreground mb-2">Input (text)</h3>
					<Input bind:value={dateValue} type="text" label="Fecha (texto)" disabled={true} />
				</div>
			</div>
			<p class="mt-4 text-sm text-muted-foreground">
				Ambos componentes comparten el mismo diseño y comportamiento de estilos.
			</p>
		</div>

		<!-- Documentation -->
		<div class="bg-surface p-6 rounded-lg border border-border">
			<h2 class="text-xl font-semibold text-foreground mb-4">Documentación</h2>
			<div class="space-y-3 text-sm text-muted-foreground">
				<div>
					<strong class="text-foreground">Props principales:</strong>
					<ul class="list-disc list-inside ml-4 mt-1">
						<li>
							<code class="text-primary-600">mode</code>: "date" o "datetime" - Controla si muestra
							solo fecha o fecha con hora
						</li>
						<li>
							<code class="text-primary-600">value</code>: string - Formato ISO 8601 UTC para
							binding bidireccional
						</li>
						<li>
							<code class="text-primary-600">label</code>: string - Etiqueta opcional del campo
						</li>
						<li>
							<code class="text-primary-600">error</code>: string - Mensaje de error opcional
						</li>
						<li>
							<code class="text-primary-600">placeholder</code>: string - Texto placeholder
						</li>
						<li>
							<code class="text-primary-600">disabled</code>: boolean - Estado deshabilitado
						</li>
						<li>
							<code class="text-primary-600">className</code>: string - Clases CSS adicionales
						</li>
					</ul>
				</div>
				<div>
					<strong class="text-foreground">Comportamiento:</strong>
					<ul class="list-disc list-inside ml-4 mt-1">
						<li>Formato visual: DD/MM/YYYY (Guatemala)</li>
						<li>Formato retorno: ISO 8601 UTC (2025-10-17T14:30:00Z)</li>
						<li>Conversión automática: GMT-6 (Guatemala) → UTC</li>
						<li>Soporte para tema claro y oscuro</li>
						<li>Calendario en español con días y meses localizados</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
