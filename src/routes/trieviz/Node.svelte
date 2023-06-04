<!-- this is the node component, it will be responsible for drawing the node and its children recursively -->

<!-- i think we need some sort of bfs for rendering the children, is it even possible here?
can dfs work still because the css will do its styling after we added all nodes in a dfs fashion anyway? -->

<script lang="ts">
	import { onMount } from 'svelte';

	import { TrieNode } from './trie';

	export let node = new TrieNode();
	export let level = 0;

	let bfsQueue = [];
	let bfsNodes: any[] = []; // This will contain the nodes in BFS order

	// Initial push
	bfsQueue.push({ node: node, level: 0 });

	while (bfsQueue.length > 0) {
		const current = bfsQueue.shift();

		if (current === undefined) {
			break;
		}

		bfsNodes.push(current);

		Object.entries(current.node.children).forEach(([key, child]) => {
			bfsQueue.push({ node: child, level: current.level + 1 });
		});
	}

	// update bfsNodes
	bfsNodes = bfsNodes;
</script>

<!-- render the node, and its children recursively (using svelte:self) -->
<!-- {#each node.children as child}
    <svelte:self node={child} />
{/each} -->

<!-- <div class="text-white">
	{#each Object.entries(node.children) as [key, child]}
		<div>
			Key: {key}, Child: {child}, Level: {level}
		</div>

		<svelte:self node={child} level={level + 1} />
	{/each}
</div> -->

<div class="text-white">
	{#each bfsNodes as { node, level }}
		<div>
			Key: {node.key}, Child: {node}, Level: {level}
		</div>
	{/each}
</div>

<!-- positioned absolutely outside of viewable area to test scrollbar -->
<!-- <div class="">
	{#each Array(100) as _}
		<div class="w-96 h-96 bg-white">a</div>
	{/each}
</div> -->

<!-- 
    given a tree node we need to be able to get this representation:
    [
        [root],
        [child1, child2, child3],
        [child1.1, child1.2, child1.3, child2.1, child2.2, child2.3, child3.1, child3.2, child3.3]
    ]

    we can do this by doing a bfs traversal of the tree, and then adding the nodes to the array

    we can then use this array to render the nodes in the correct order

    after that, we can create a virtual matrix of the nodes, and then use that to render the nodes in the correct position

    the matrix size will be the number of levels in the tree, and the max number of nodes in each level (which is probably the number of nodes in the last level)

    maybe for each node on the x axis, have two cells for the matrix. fill two cell to render a node at the middle of those two cells position, fill one cell to render a node at the middle of that cell position


 -->

<!-- 
    ok algorithm is simple
    disregard the matrix idea
    just try to add it to the below node
    if it fits, add it
    if it doesn't, add it to the node closest to the horizontal middle that has available space that is just one level below our current node (regardless if its on the left or right side)

    closest to middle means closest to the root node horizontally.
    IMPORTANT: ensure we dont cross over other nodes. this means if we added to the left already, we need to keep going left, even if right is closer, because we might cross over a node if we go right
    another thing is that sometimes we cant go right to not cross a node, and we cant go left either since its already filled. in that case, we need to shift the node to the left, and then add our node in place of the shifted node
  -->

<!-- 
    ok scrap that too
    we should just have a bunch of commands
    each command will be used to construct the trie, and we should use the commands too to animate rendering the trie
    deletion will be a command too and such, kind of like the idea of having database migrations
    this way we will always end up with a consistent trie without weird stuff affecting the final trie that might be induced by diffing
    nuke the state when we press clear
    have a counter for the commands we animated so far, and then we can use that to animate the commands that are not animated yet
    so we will kind of have a virtual dom, and using that we can update the real dom
    but do we even require such a thing? what if we store the trie itself in the dom instead of having any kind of custom data structure?
   -->
