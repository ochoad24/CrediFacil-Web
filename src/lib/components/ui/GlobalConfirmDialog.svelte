<script lang="ts">
	import { confirmationStore } from '$lib/stores/confirmation';
	import ConfirmDialog from './ConfirmDialog.svelte';

	$: ({ isOpen, title, message, type, confirmText, cancelText, loading } = $confirmationStore);

	function handleConfirm() {
		confirmationStore.handleConfirm();
	}

	function handleCancel() {
		confirmationStore.handleCancel();
	}

	function handleClose() {
		confirmationStore.close();
	}
</script>

<ConfirmDialog
	{isOpen}
	{title}
	{message}
	{type}
	{confirmText}
	{cancelText}
	{loading}
	on:confirm={handleConfirm}
	on:cancel={handleCancel}
	on:close={handleClose}
/>