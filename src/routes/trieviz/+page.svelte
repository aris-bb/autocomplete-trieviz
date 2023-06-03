<script lang="ts">
	import { onMount } from 'svelte';

	interface Trie {
		[key: string]: Trie;
	}

	class TrieClass {
		trie: Trie = {};

		createTrie(): Trie {
			return {};
		}

		add(word: string) {
			let node = this.trie;
			for (const char of word) {
				if (!node[char]) {
					node[char] = this.createTrie();
				}
				node = node[char];
			}
		}

		has(word: string): boolean {
			let node = this.trie;
			for (const char of word) {
				if (!node[char]) {
					return false;
				}
				node = node[char];
			}
			return true;
		}

		getWords(start_node: Trie = this.trie): string[] {
			const words: string[] = [];
			let traverse = (node: Trie, word: string) => {
				for (const char in node) {
					const nextWord = word + char;
					if (this.has(nextWord)) {
						traverse(node[char], nextWord);
					}
				}
				if (word.length > 0) {
					words.push(word);
				}
			};
			traverse(start_node, '');
			return words;
		}

		getWordsWithPrefix(prefix: string): string[] {
			let node = this.trie;
			for (const char of prefix) {
				if (!node[char]) {
					return [];
				}
				node = node[char];
			}
			return this.getWords(node).map((word) => prefix + word);
		}

		autocomplete(word: string): string[] {
			return this.getWordsWithPrefix(word);
		}
	}

	let trie = new TrieClass();
	let input = '';
	let matches: string | any[] = [];

	function clear() {
		trie = new TrieClass();
		matches = [];
	}

	function randomPopulate() {
		trie = new TrieClass();
	}

	function add() {
		trie.add(input);
		// update the trie
		trie = trie;
		input = '';
		matches = [];
	}

	function updateMatches() {
		matches = trie.autocomplete(input);
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
</script>

<svelte:head>
	<title>TrieViz</title>
	<meta name="description" content="TrieViz - Trie visualization with autocomplete" />
</svelte:head>

<div class="flex flex-col md:flex-row h-screen">
	<div class="md:w-1/3 bg-neutral-900 p-4 border-b md:border-b-0 md:border-r border-neutral-700">
		<!-- maybe clear and randomly populate buttons are mutually exclusive and switch between and fade in / out?
		maybe put search and list on top and clear/randomize buttons on bottom on responsive
		down arrow button (not button but eh, invisible button) or something to display the list. back up button too -->
		<div class="flex flex-col xl:flex-col-reverse">
			<div class="mb-4 flex justify-between relative">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
				>
					<path
						fill-rule="evenodd"
						d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
						clip-rule="evenodd"
					/>
				</svg>
				<input
					id="input"
					class="border border-r-0 px-4 w-full bg-neutral-800
				border-neutral-700 rounded-full text-white
				active:border-neutral-600 shadow-md active:shadow-neutral-800
				rounded-r-none placeholder:text-white/50 pl-12"
					placeholder="Add or search"
					on:keydown={(event) => {
						if (event.key === 'Enter') {
							add();
						}
					}}
					bind:value={input}
				/>

				<button
					class="bg-neutral-900 border-neutral-700
				hover:border-neutral-600 hover:shadow-neutral-800
				shadow-md text-white font-bold py-2 pl-2 pr-4
				rounded-full rounded-l-none border"
					on:click={add}
				>
					<div class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6 mr-2"
						>
							<path
								fill-rule="evenodd"
								d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
								clip-rule="evenodd"
							/>
						</svg>

						<span>Add</span>
					</div>
				</button>
			</div>
			<div class="flex flex-row md:flex-col xl:flex-row justify-between">
				<button
					class="bg-neutral-800 border-neutral-700
					hover:border-neutral-600 hover:shadow-neutral-800
					shadow-md text-white font-bold py-2 px-4
					rounded-full border mb-4 xl:w-max w-full
					flex justify-center items-center border-r-0 md:border-r
					rounded-r-none md:rounded-r-full"
					on:click={clear}
				>
					<div class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6 mr-2 text-red-500"
						>
							<path
								fill-rule="evenodd"
								d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
								clip-rule="evenodd"
							/>
						</svg>
						<span>Clear</span>
					</div>
				</button>
				<button
					class="bg-neutral-800 border-neutral-700
					hover:border-neutral-600 hover:shadow-neutral-800
					shadow-md text-white font-bold py-2 px-4
					rounded-full border mb-4 xl:w-max w-full
					flex justify-center items-center rounded-l-none md:rounded-l-full"
					on:click={randomPopulate}
				>
					<div class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6 mr-2"
						>
							<path
								fill-rule="evenodd"
								d="M12 5.25c1.213 0 2.415.046 3.605.135a3.256 3.256 0 013.01 3.01c.044.583.077 1.17.1 1.759L17.03 8.47a.75.75 0 10-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 00-1.06-1.06l-1.752 1.751c-.023-.65-.06-1.296-.108-1.939a4.756 4.756 0 00-4.392-4.392 49.422 49.422 0 00-7.436 0A4.756 4.756 0 003.89 8.282c-.017.224-.033.447-.046.672a.75.75 0 101.497.092c.013-.217.028-.434.044-.651a3.256 3.256 0 013.01-3.01c1.19-.09 2.392-.135 3.605-.135zm-6.97 6.22a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.752-1.751c.023.65.06 1.296.108 1.939a4.756 4.756 0 004.392 4.392 49.413 49.413 0 007.436 0 4.756 4.756 0 004.392-4.392c.017-.223.032-.447.046-.672a.75.75 0 00-1.497-.092c-.013.217-.028.434-.044.651a3.256 3.256 0 01-3.01 3.01 47.953 47.953 0 01-7.21 0 3.256 3.256 0 01-3.01-3.01 47.759 47.759 0 01-.1-1.759L6.97 15.53a.75.75 0 001.06-1.06l-3-3z"
								clip-rule="evenodd"
							/>
						</svg>
						<span>Randomize</span>
					</div>
				</button>
			</div>
		</div>

		{#if matches.length > 0}
			<ul class="mt-2">
				{#each matches.slice(0, 1) as match, i}
					<li
						class="cursor-pointer hover:bg-gray-200 p-2"
						on:click={() => {
							input = match;
							updateMatches();
						}}
					>
						{match}
					</li>
				{/each}
				{#if matches.length > 1}
					<li class="opacity-50">and {matches.length - 1} more matches</li>
				{/if}
			</ul>
		{:else if showMatches}
			<p>No matches found.</p>
		{/if}

		<button
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full rounded-l-none border mt-2"
			on:click={toggleMatches}
		>
			<div class="flex items-center">
				<span>{showMatches ? 'Hide' : 'Show'} Matches</span>
			</div>
		</button>
	</div>
	<div class="md:w-2/3 p-4 bg-black h-full">
		<!-- only if empty though -->
		Add a word to the trie to see it visualized.

		<!-- print the current trie as json -->
		<pre class="text-white">{JSON.stringify(trie, null, 2)}</pre>

		<!-- print the matches as json -->
		<pre class="text-white">{JSON.stringify(matches, null, 2)}</pre>

		<svg viewBox="0 0 1000 1000">
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
		</svg>
	</div>
</div>
