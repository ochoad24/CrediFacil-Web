<script lang="ts">
	import { fileService } from '$lib/services/files/fileService';
	import Button from './Button.svelte';
	import { cn } from '$lib/utils/cn';
	import type { File as FileType } from '$lib/types/file';

	export let bucketName: string;
	export let multiple: boolean = false;
	export let accept: string = '*/*';
	export let maxSizeMB: number = 10;
	export let disabled: boolean = false;
	export let className: string = '';
	export let onSuccess: (files: FileType[]) => void = () => {};
	export let onError: (error: string) => void = () => {};

	let uploading = false;
	let fileInput: HTMLInputElement;
	let uploadProgress: { [key: string]: number } = {};
	let selectedFiles: globalThis.File[] = [];

	const handleFileSelect = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			selectedFiles = Array.from(target.files);
			validateAndUpload(selectedFiles);
		}
	};

	const validateAndUpload = async (files: globalThis.File[]) => {
		// Validate file sizes
		const invalidFiles = files.filter(
			(file) => file.size > maxSizeMB * 1024 * 1024
		);

		if (invalidFiles.length > 0) {
			onError(
				`Los siguientes archivos exceden el tamaño máximo (${maxSizeMB}MB): ${invalidFiles.map((f) => f.name).join(', ')}`
			);
			return;
		}

		await uploadFiles(files);
	};

	const uploadFiles = async (files: globalThis.File[]) => {
		uploading = true;
		const uploadedFiles: FileType[] = [];

		try {
			for (const file of files) {
				uploadProgress[file.name] = 0;

				try {
					const response = await fileService.uploadFile(file, bucketName);
					uploadedFiles.push(response.data);
					uploadProgress[file.name] = 100;
				} catch (error) {
					console.error(`Error uploading ${file.name}:`, error);
					onError(
						`Error al subir ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`
					);
				}
			}

			if (uploadedFiles.length > 0) {
				onSuccess(uploadedFiles);
			}

			// Reset
			selectedFiles = [];
			if (fileInput) {
				fileInput.value = '';
			}
			uploadProgress = {};
		} finally {
			uploading = false;
		}
	};

	const triggerFileInput = () => {
		if (!disabled && !uploading) {
			fileInput?.click();
		}
	};
</script>

<div class={cn('file-uploader', className)}>
	<input
		bind:this={fileInput}
		type="file"
		{accept}
		{multiple}
		on:change={handleFileSelect}
		class="hidden"
		{disabled}
	/>

	<Button
		variant="outline"
		disabled={disabled || uploading}
		loading={uploading}
		on:click={triggerFileInput}
	>
		{#if uploading}
			Subiendo...
		{:else}
			<span class="mr-2">📁</span>
			{multiple ? 'Seleccionar archivos' : 'Seleccionar archivo'}
		{/if}
	</Button>

	{#if Object.keys(uploadProgress).length > 0}
		<div class="mt-4 space-y-2">
			{#each Object.entries(uploadProgress) as [fileName, progress]}
				<div class="text-sm">
					<div class="flex justify-between mb-1">
						<span class="text-secondary truncate max-w-xs">{fileName}</span>
						<span class="text-muted">{progress}%</span>
					</div>
					<div class="w-full bg-muted rounded-full h-2">
						<div
							class="bg-primary-600 h-2 rounded-full transition-all duration-300"
							style="width: {progress}%"
						></div>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#if selectedFiles.length > 0 && !uploading}
		<div class="mt-2 text-sm text-muted">
			{selectedFiles.length} {selectedFiles.length === 1 ? 'archivo seleccionado' : 'archivos seleccionados'}
		</div>
	{/if}
</div>

<style>
	.file-uploader {
		width: 100%;
	}
</style>
