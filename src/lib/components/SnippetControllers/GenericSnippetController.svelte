<script lang="ts">
	import { Row } from '@sveltestrap/sveltestrap';
	import type { GenericFieldCompatable } from '../../classes/Snippets/SnippetTypes/GenericFieldCompatable';
	import type { FieldSpecifier, Snippet } from '../../classes/Snippets/SnippetTypes/Snippet';

	interface Props {
		snippet: GenericFieldCompatable;
		updateSnippet: (snippet: Snippet) => void;
	}

	let { snippet, updateSnippet }: Props = $props();

	function updateField(field: FieldSpecifier, value: any) {
		let newSnippet = snippet.copy();
		if (field.fieldType == 'string') {
			newSnippet[field.field] = value;
		} else {
			console.error('Unexpected fieldType', field.fieldType);
		}
		updateSnippet(newSnippet);
	}
</script>

<Row>
	{#each snippet.editor_fields() as field, index}
		{#if field.fieldType == 'string'}
			<div class="col-6">
				<input
					list={field.datalistID}
					class="form-control"
					placeholder={field.placeholder}
					value={snippet[field.field]}
					oninput={(evt) => {
						updateField(field, evt.currentTarget.value);
					}}
				/>
			</div>
		{/if}
	{/each}
</Row>
