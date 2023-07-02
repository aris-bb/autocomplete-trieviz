<script lang="ts">
	import { onMount } from 'svelte';

	import { Trie } from './trie';

	import MagnifyingGlassIcon from '../icons/MagnifyingGlassIcon.svelte';
	import PlusIcon from '../icons/PlusIcon.svelte';
	import TrashIconSolid from '../icons/TrashIconSolid.svelte';
	import ArrowPathRoundedIcon from '../icons/ArrowPathRoundedIcon.svelte';
	import ChevronUpIcon from '../icons/ChevronUpIcon.svelte';
	import ChevronDownIcon from '../icons/ChevronDownIcon.svelte';
	import XMarkIcon from '../icons/XMarkIcon.svelte';
	import { children } from 'svelte/internal';
	import Node from './Node.svelte';

	let trie = new Trie();
	let input = '';
	let matches: string | any[] = [];

	function clear() {
		trie = new Trie();
		matches = [];
		input = '';
		showMatches = false;
	}

	function randomPopulate() {
		trie = new Trie();
	}

	function add() {
		trie.addWord(input).then(() => {
			// update the trie
			trie = trie;
		});
		input = '';
		matches = [];
	}

	function remove(word: string) {
		trie.removeWord(word).then(() => {
			// update the trie
			trie = trie;
			updateMatches();
		});
	}

	function updateMatches() {
		trie.autocomplete(input).then((res) => {
			matches = res;
		});
	}

	let showMatches = false;
	function toggleMatches() {
		showMatches = !showMatches;
	}

	onMount(() => {
		const inputEl = document.getElementById('input') as HTMLInputElement;
		inputEl.focus();
		inputEl.addEventListener('input', () => {
			input = inputEl.value;
			updateMatches();
		});
	});

	const WORD_PREVIEW_COUNT = 3;

	let isMd = false;
	function checkMd() {
		isMd = window.innerWidth >= 768;
	}
	window.addEventListener('resize', checkMd);
	checkMd();

	// convert the trie into a form that can be represented easily from within html

	// populate it in a breadth first fashion
	let trieVisualizationData = [
		[{ type: 'character', value: '' }],
		[{ type: 'character', value: 'h' }],
		[{ type: 'character', value: 'e' }],
		[
			{ type: 'character', value: null },
			{ type: 'character', value: null },
			{ type: 'character', value: 'y' },
			{ type: 'character', value: 'l' },
			{ type: 'character', value: 'r' }
		],
		[
			{ type: 'character', value: null },
			{ type: 'character', value: null },
			{ type: 'character', value: null },
			{ type: 'character', value: 'l' },
			{ type: 'character', value: null }
		],
		[
			{ type: 'character', value: null },
			{ type: 'character', value: null },
			{ type: 'character', value: null },
			{ type: 'character', value: 'o' },
			{ type: 'character', value: null }
		]
	];

	// buff up all rows to be the same length
	// add an svg edge layer between each row
	// figure out how to do it relative to the nodes

	// can we use plain old html to draw the edges? this would be nice

	// calculate height and rotation and starting/ending point that we need for that given edge
	// make sure the height, rotation, and starting/ending point are all relative to the node

	// fix the responsive middle bar between buttons, youtube has this too between their like/dislike buttons
</script>

<!-- dont add word if its empty string -->

<!-- we can give it some callback which will request a redraw.
instead of having some animation function in the tree, we can just perform a operation and simply request redraw and itll automatically redraw for us animated
now we just need to implement some component named Node which will be responsible for drawing the node and its children recursively -->

<!-- make sure we keep children ordered, so we can draw it without messing up order each time
also use css probably to start root node from top, and have equal width between all child nodes and between the edges of the screen -->

<svelte:head>
	<title>TrieViz</title>
	<meta name="description" content="TrieViz - Trie visualization with autocomplete" />
</svelte:head>

<div class="flex flex-col md:flex-row h-screen overflow-hidden">
	<div
		class="md:w-2/3 flex max-h-full flex-col bg-neutral-900 border-b md:border-b-0 md:border-r border-neutral-700 md:max-w-lg"
	>
		<!-- add a way to hide this drawer away
		ensure we have some max width for this -->
		<div class="flex flex-col xl:flex-col-reverse m-4 mb-2">
			<div class="mb-4 xl:mb-0 flex justify-between relative">
				<div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">
					<MagnifyingGlassIcon />
				</div>
				<input
					id="input"
					class="border border-r-0 w-full bg-neutral-800
					border-neutral-700 rounded-full text-white outline-0
					focus:border-neutral-600 focus:shadow-neutral-800
					shadow-md rounded-r-none placeholder:text-white/50 pl-12 pr-6"
					placeholder="Add or search"
					on:keydown={(event) => {
						if (event.key === 'Enter') {
							add();
						}
					}}
					bind:value={input}
				/>

				{#if input.length > 0}
					<div class="relative">
						<button
							class="text-white absolute right-1 top-1/2 transform -translate-y-1/2"
							on:click={() => {
								input = '';
								updateMatches();
							}}
						>
							<div class="flex items-center">
								<XMarkIcon />
							</div>
						</button>
					</div>
				{/if}

				<button
					class="bg-neutral-900 border-neutral-700
					hover:border-neutral-600 hover:shadow-neutral-800
					shadow-md text-white font-bold py-2 pl-2 pr-4
					active:bg-neutral-950
					rounded-full rounded-l-none border"
					on:click={add}
				>
					<div class="flex items-center">
						<div class="mr-2">
							<PlusIcon />
						</div>

						<span>Add</span>
					</div>
				</button>
			</div>
			<div class="flex flex-row md:flex-col xl:flex-row justify-between">
				<button
					class="bg-neutral-800 border-neutral-700
					hover:border-neutral-600 hover:shadow-neutral-800
					shadow-md text-white font-bold py-2 px-4
					rounded-full border mb-0 md:mb-4 xl:w-max w-full
					flex justify-center items-center border-r-0 md:border-r
					active:bg-neutral-900
					rounded-r-none md:rounded-r-full"
					on:click={clear}
				>
					<div class="flex items-center">
						<div class="mr-2 text-red-500">
							<TrashIconSolid />
						</div>
						<span>Clear</span>
					</div>
				</button>
				<div class="md:hidden bg-neutral-700 w-1" />
				<button
					class="bg-neutral-800 border-neutral-700
					hover:border-neutral-600 hover:shadow-neutral-800
					shadow-md text-white font-bold py-2 px-4
					rounded-full border mb-0 xl:mb-4 xl:w-max w-full
					border-l-0 md:border-l
					active:bg-neutral-900
					flex justify-center items-center rounded-l-none md:rounded-l-full"
					on:click={randomPopulate}
				>
					<div class="flex items-center">
						<div class="mr-2">
							<ArrowPathRoundedIcon />
						</div>
						<span>Randomize</span>
					</div>
				</button>
			</div>
		</div>

		<!-- make everything show as "matched" if input box empty -->

		{#if matches.length < WORD_PREVIEW_COUNT || isMd || showMatches}
			<div class="text-white flex flex-auto overflow-y-auto overflow-x-hidden flex-col">
				<ul class="mb-2">
					{#each matches as match, i}
						<li class="relative">
							<div class="flex items-center">
								<button
									class="text-white absolute right-1 top-1/2 transform -translate-y-1/2"
									on:click={() => {
										remove(match);
									}}
								>
									<div class="flex items-center">
										<XMarkIcon />
									</div>
								</button>
								<span
									class="cursor-pointer hover:bg-neutral-800 p-1 transition-colors duration-200 w-full"
									on:click={() => {
										input = match;
										updateMatches();
									}}
								>
									{match}
								</span>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{:else}
			<div class="text-white">
				{#if matches.length > 0}
					<ul class="mb-2">
						{#each matches.slice(0, WORD_PREVIEW_COUNT) as match, i}
							<li class="relative">
								<div
									class="flex items-center"
									style="opacity: {1 - (i / (WORD_PREVIEW_COUNT - 1)) * 0.75};"
								>
									<button
										class="text-white absolute right-1 top-1/2 transform -translate-y-1/2"
										on:click={() => {
											remove(match);
										}}
									>
										<div class="flex items-center">
											<XMarkIcon />
										</div>
									</button>
									<span
										class="cursor-pointer hover:bg-neutral-800 p-1 transition-colors duration-200 w-full"
										on:click={() => {
											input = match;
											updateMatches();
										}}
									>
										{match}
									</span>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}

		{#if matches.length > WORD_PREVIEW_COUNT && !isMd}
			<button
				class="flex justify-center items-center w-full text-white -translate-y-full -mb-6"
				on:click={toggleMatches}
			>
				<!-- <div class="bg-neutral-800 shadow-md rounded-full p-2 border border-neutral-700 -mb-2"> -->
				<div>
					{#if showMatches}
						<ChevronUpIcon />
					{:else}
						<ChevronDownIcon />
					{/if}
				</div>
			</button>
		{/if}
	</div>
	<div class="w-full p-4 overflow-y-auto bg-black h-full">
		<!-- only if empty though -->
		<!-- Add a word to the trie to see it visualized. -->
		<!-- <Node node={trie.root} /> -->

		<!-- print the current trie as json -->
		<!-- <pre class="text-white">{JSON.stringify(trie, null, 2)}</pre> -->

		<!-- print the matches as json -->
		<!-- <pre class="text-white">{JSON.stringify(matches, null, 2)}</pre> -->

		<!-- <svg viewBox="0 0 1000 1000"> -->
		<!-- {#each trie.nodes as node}
				<g transform={`translate(${node.x},${node.y})`}>
					<circle r="20" fill={highlight(node, input) ? 'red' : 'gray'} />
					<text text-anchor="middle" y="7">{node.value}</text>
				</g>
			{/each}
			{#each trie.edges as edge}
				<line
					x1={edge.source.x}
					y1={edge.source.y}
					x2={edge.target.x}
					y2={edge.target.y}
					stroke="black"
				/>
			{/each} -->
		<!-- </svg> -->

		<!-- a svg of a straight line -->
		<!-- <svg viewBox="0 0 1000 1000">
			<line x1="0" y1="0" x2="1000" y2="1000" stroke="white" />
		</svg> -->

		{#each trieVisualizationData as visualizationRow}
			<div class="level flex justify-center px-4">
				{#each visualizationRow as node}
					<div
						class="z-10 node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center {node.value ===
						null
							? 'invisible'
							: ''}"
					>
						{node.value}
					</div>
				{/each}
			</div>

			<div class="level flex justify-center px-4">
				{#each visualizationRow as node}
					<div
						class="relative node mx-4 w-12 h-12 text-white flex items-center justify-center {node.value ===
						null
							? 'invisible'
							: ''}"
					>
						<svg class="absolute w-full h-full overflow-visible">
							<!-- n=0: 0
							n=1: 64 + 32
							n=2: 2*64 + 32
							n: n*64 + (n>1)*32 -->
							<!-- -16 = leftmost
							64 = rightmost
							80 = delta
							24 = center
							24 + n*80 = nth node -->
							<line x1="24" y1="0" x2="104" y2="48" stroke="white" stroke-width="2" />
						</svg>
						<svg class="absolute w-full h-full overflow-visible">
							<line x1="24" y1="0" x2="24" y2="48" stroke="white" stroke-width="2" />
						</svg>
						<svg class="absolute w-full h-full overflow-visible">
							<line x1="24" y1="0" x2="-56" y2="48" stroke="white" stroke-width="2" />
						</svg>
						<svg class="absolute w-full h-full overflow-visible">
							<line x1="24" y1="0" x2="-536" y2="48" stroke="white" stroke-width="2" />
						</svg>
					</div>
				{/each}
			</div>
		{/each}

		<div class="level flex justify-center p-4">
			<div
				id="root"
				class="node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			/>
		</div>
		<div class="level flex justify-center p-4">
			<div
				class="node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			>
				h
			</div>
		</div>
		<div class="level flex justify-center p-4">
			<div
				class="node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			>
				e
			</div>
		</div>
		<div class="level flex justify-center p-4">
			<div
				class="invisible node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			/>
			<div
				class="node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			>
				y
			</div>
			<div
				class="node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			>
				l
			</div>
		</div>
		<div class="level flex justify-center p-4">
			<div
				class="invisible node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			/>
			<div
				class="invisible node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			/>
			<div
				class="node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			>
				l
			</div>
		</div>
		<div class="level flex justify-center p-4">
			<div
				class="invisible node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			/>
			<div
				class="invisible node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			/>
			<div
				class="node mx-4 bg-neutral-800 shadow-md rounded-full w-12 h-12 text-white border border-neutral-700 flex items-center justify-center"
			>
				o
			</div>
		</div>

		<!-- ensure nodes keep their distance no matter what and wont get squished on smaller screens. we want a scrollbar to appear if the screen is too small
		we can render the edges as a svg. since we already know from and to nodes and the distance between them (since it always stays the same), we can dynamically generate the svg and render it 
		also after prototyping this html, check to see if we can store this in javascript and have it reflect to html using svelte directives instead of just manipulating the dom directly
		^ yeah the above should work, just hold a list of list of nodes, each outer iteration will take us down one row, each inner iteration will be the each column, so just group them as such 
		so we should just have one row of nodes, the next row the edges, then nodes again, so on and so forth. we can calculate svgs while generating this structure -->
	</div>
</div>
