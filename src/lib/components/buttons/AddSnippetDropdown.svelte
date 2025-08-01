<script lang="ts">
	import {
		Button,
		ButtonDropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle
	} from '@sveltestrap/sveltestrap';
	import { KeybindSnippet } from '../../classes/Snippets/SnippetTypes/KeybindSnippet';
	import { LinebreakSnippet } from '../../classes/Snippets/SnippetTypes/LinebreakSnippet';
	import { NBTSnippet } from '../../classes/Snippets/SnippetTypes/NBTSnippet';
	import { PagebreakSnippet } from '../../classes/Snippets/SnippetTypes/PagebreakSnippet';
	import { ScoreboardObjectiveSnippet } from '../../classes/Snippets/SnippetTypes/ScoreboardObjectiveSnippet';
	import { SelectorSnippet } from '../../classes/Snippets/SnippetTypes/SelectorSnippet';
	import type { Snippet } from '../../classes/Snippets/SnippetTypes/Snippet';
	import { TextSnippet } from '../../classes/Snippets/SnippetTypes/TextSnippet';
	import { TranslateSnippet } from '../../classes/Snippets/SnippetTypes/TranslateSnippet';
	import { CommandType, FeatureType, isFeatureAvailable } from '../../data/templates';
	import { fastEditTipShown, version } from '../../persistence/stores';
	import FileAlt from '../generic/Icons/FileAlt.svelte';
	import PlusCircle from '../generic/Icons/PlusCircle.svelte';
	import TachometerAlt from '../generic/Icons/TachometerAlt.svelte';

	interface Props {
		title?: String | undefined;
		addSnippet?: (snippet: Snippet, fast: boolean) => void;
		commandType?: CommandType;
	}

	let {
		title = undefined,
		addSnippet = () => {},
		commandType = CommandType.tellraw
	}: Props = $props();
	let optionPressed = $state(false);

	function keyDown(event: any) {
		if (event.key === 'Alt' || event.keyCode === 18) {
			optionPressed = true;
		}
	}

	function keyUp(event: any) {
		if (event.key === 'Alt' || event.keyCode === 18) {
			optionPressed = false;
		}
	}

	function _addSnippet(snippet: Snippet) {
		addSnippet(snippet, optionPressed);
	}

	function newLinebreak() {
		addSnippet(new LinebreakSnippet(null), true);
	}

	function newPagebreak() {
		addSnippet(new PagebreakSnippet(null), true);
	}

	function hideFastEditTip() {
		fastEditTipShown.set(false);
	}

	let nbtStorageAvailable = $derived(
		isFeatureAvailable(commandType, $version, FeatureType.nbtComponent)
	);
	let selectorAvailable = $derived(
		isFeatureAvailable(commandType, $version, FeatureType.nbtComponent)
	);
	let scoreboardAvailable = $derived(
		isFeatureAvailable(commandType, $version, FeatureType.nbtComponent)
	);
	let pageBreakAvailalbe = $derived(isFeatureAvailable(commandType, $version, FeatureType.pages));
	let linebreakAvailable = $derived(
		isFeatureAvailable(commandType, $version, FeatureType.linebreak)
	);
</script>

<svelte:window onkeydown={keyDown} onkeyup={keyUp} />

<ButtonDropdown class="w-100">
	<DropdownToggle color="primary" caret>
		{#if optionPressed}
			<TachometerAlt />
		{:else}
			<PlusCircle />
		{/if}
		{title ?? 'Add Text'}
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem
			on:click={() => {
				_addSnippet(new TextSnippet(null));
			}}
		>
			Text
		</DropdownItem>
		{#if selectorAvailable}
			<DropdownItem
				on:click={() => {
					_addSnippet(new SelectorSnippet(null));
				}}
			>
				Selector
			</DropdownItem>
		{/if}
		{#if scoreboardAvailable}
			<DropdownItem
				on:click={() => {
					_addSnippet(new ScoreboardObjectiveSnippet(null));
				}}
			>
				Scoreboard Objective
			</DropdownItem>
		{/if}
		{#if nbtStorageAvailable}
			<DropdownItem
				on:click={() => {
					_addSnippet(new NBTSnippet(null));
				}}
			>
				NBT Storage
			</DropdownItem>
		{/if}
		<DropdownItem
			on:click={() => {
				_addSnippet(new KeybindSnippet(null));
			}}
		>
			Keybind
		</DropdownItem>
		<DropdownItem
			on:click={() => {
				_addSnippet(new TranslateSnippet(null));
			}}
		>
			Translation
		</DropdownItem>
		<!-- <DropdownItem on:click={() => { addSnippet(new GroupSnippet(null)) }}>
      Snippet Group
    </DropdownItem> -->
		{#if linebreakAvailable}
			<DropdownItem on:click={newLinebreak}>Line Break ⏎</DropdownItem>
		{/if}
		{#if pageBreakAvailalbe}
			<DropdownItem on:click={newPagebreak}>
				New Page <FileAlt />
			</DropdownItem>
		{/if}
		{#if $fastEditTipShown}
			<div class="dropdown-divider"></div>
			<p class="text-muted px-4 mb-0 d-flex justify-content-between align-items-center">
				Hold option to add without editing
				<Button color="danger" size="sm" outline on:click={hideFastEditTip}>OK</Button>
				<!-- <button className="btn btn-sm btn-outline-danger" onClick={}>OK</button> -->
			</p>
		{/if}
	</DropdownMenu>
</ButtonDropdown>
