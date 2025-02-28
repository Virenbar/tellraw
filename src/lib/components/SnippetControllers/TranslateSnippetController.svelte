<script lang="ts">
	import { FormGroup, Row } from '@sveltestrap/sveltestrap';
	import type { Snippet } from '../../classes/Snippets/SnippetTypes/Snippet';
	import { TranslateSnippet } from '../../classes/Snippets/SnippetTypes/TranslateSnippet';
	import { CommandType } from '../../data/templates';
	import { duplicate_snippet } from '../../helpers/duplicate_snippet';
	import type { TranslationSet } from '../../helpers/translation_processor';
	import { countParameters } from '../../helpers/translation_processor';
	import AddSnippetDropdown from '../buttons/AddSnippetDropdown.svelte';
	import InlineSnippetController from './InlineSnippetController.svelte';
	import SnippetDetailController from './SnippetDetailController.svelte';


	interface Props {
		snippet?: TranslateSnippet;
		commandType?: CommandType;
		colorManaging?: boolean;
		translationSet?: TranslationSet;
		updateSnippet?: (snippet: Snippet) => void;
		hideExteriorWrapper: boolean;
	}

	let {
		snippet = new TranslateSnippet(),
		commandType = CommandType.tellraw,
		colorManaging = $bindable(false),
		translationSet = {},
		updateSnippet = () => {},
		hideExteriorWrapper = $bindable()
	}: Props = $props();
	let editing: Snippet | null = $state(null);

	let hideWrapper = false;

	let targetParameterCount = $derived(countParameters(snippet.translate, translationSet));

	function updateTranslate(event: any) {
		const newSnippet = snippet.copy();
		newSnippet.translate = event.target.value;
		updateSnippet(newSnippet);
	}

	function updateParameter(newParam: Snippet, index: number) {
		const newSnippet = snippet.copy();
		newSnippet.parameters[index] = newParam;
		updateSnippet(newSnippet);
	}

	function addParameter(newParam: Snippet, fast: boolean) {
		const newSnippet = snippet.copy();
		newSnippet.parameters.push(newParam);
		updateSnippet(newSnippet);
	}

	function deleteParameter(index: number) {
		const newSnippet = snippet.copy();
		newSnippet.parameters.splice(index, 1);
		updateSnippet(newSnippet);
	}

	function startEditing(index: number) {
		editing = duplicate_snippet(snippet.parameters[index]);
		hideExteriorWrapper = true;
	}

	function stopEditing(save: boolean) {
		if (save) {
			const newSnippet = snippet.copy();
			newSnippet.parameters = newSnippet.parameters.map((param) => {
				if (param.id == editing?.id) {
					return editing;
				} else {
					return param;
				}
			});
			updateSnippet(newSnippet);
		}

		editing = null;
		hideExteriorWrapper = false;
	}
</script>

{#if editing !== null}
	<SnippetDetailController
		{commandType}
		bind:snippet={editing}
		{stopEditing}
		{translationSet}
		bind:colorManaging
	/>
{:else}
	<FormGroup>
		<label for="translation-string-input">Translation string</label>
		<input
			class="form-control"
			id="translation-string-input"
			value={snippet.translate}
			list="datalist-translations"
			oninput={updateTranslate}
		/>
		<small id="translation-string-help">
			Choose a translation identifier (specified in Minecraft translation files) or type out a
			translation string directly.
			<a href="https://minecraft.wiki/w/Raw_JSON_text_format#Translated_Text" target="_">
				Read more
			</a>
		</small>
	</FormGroup>
	<FormGroup>
		{#if snippet.parameters.length > 0}
			<span class="label-like">Translation parameters</span>
		{/if}
		{#each snippet.parameters as param, paramIndex (param.id)}
			<InlineSnippetController
				snippet={param}
				startEditing={() => {
					startEditing(paramIndex);
				}}
				updateSnippet={(newParam) => {
					updateParameter(newParam, paramIndex);
				}}
				removeSnippet={() => {
					deleteParameter(paramIndex);
				}}
				duplicateSnippet={undefined}
				{commandType}
			/>
		{/each}
		{#if targetParameterCount > 0}
			<small>Each entry corresponds to a placeholder (%s) in your translation string above.</small>
		{:else}
			<small>Each entry corresponds to a placeholder in the translation string.</small>
		{/if}
	</FormGroup>
	<FormGroup>
		<Row>
			<div class="col-sm-4 col-md-3 mb-2 mb-sm-0">
				<AddSnippetDropdown title="Add Parameter" addSnippet={addParameter} {commandType} />
			</div>
		</Row>
		{#if targetParameterCount > 0}
			{#if targetParameterCount - snippet.parameters.length > 0}
				<small
					>You should add {targetParameterCount - snippet.parameters.length} more parameters, one for
					each %s in your translation text.</small
				>
			{/if}
		{:else}
			<small>If your translation text has parameters (designated with %s), add one here.</small>
		{/if}
	</FormGroup>
{/if}

<style>
	.label-like {
		display: inline-block;
		margin-bottom: 0.5rem;
	}
</style>
