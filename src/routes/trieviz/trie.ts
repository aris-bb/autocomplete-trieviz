// interface Trie {
//     [key: string]: Trie;
// }

// export class TrieClass {
//     trie: Trie = {};

//     createTrie(): Trie {
//         return {};
//     }

//     add(word: string) {
//         let node = this.trie;
//         for (const char of word) {
//             if (!node[char]) {
//                 node[char] = this.createTrie();
//             }
//             node = node[char];
//         }
//     }

//     has(word: string): boolean {
//         let node = this.trie;
//         for (const char of word) {
//             if (!node[char]) {
//                 return false;
//             }
//             node = node[char];
//         }
//         return true;
//     }

//     getWords(start_node: Trie = this.trie): string[] {
//         const words: string[] = [];
//         const traverse = (node: Trie, word: string) => {
//             for (const char in node) {
//                 const nextWord = word + char;
//                 if (this.has(nextWord)) {
//                     traverse(node[char], nextWord);
//                 }
//             }
//             if (word.length > 0) {
//                 words.push(word);
//             }
//         };
//         traverse(start_node, '');
//         return words;
//     }

//     getWordsWithPrefix(prefix: string): string[] {
//         let node = this.trie;
//         for (const char of prefix) {
//             if (!node[char]) {
//                 return [];
//             }
//             node = node[char];
//         }
//         return this.getWords(node).map((word) => prefix + word);
//     }

//     autocomplete(word: string): string[] {
//         return this.getWordsWithPrefix(word);
//     }
// }
export class TrieNode {
    children: { [key: string]: TrieNode };
    isEndOfWord: boolean;

    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

export class Trie {
    root: TrieNode;
    animationDelay: number;

    constructor() {
        this.root = new TrieNode();
        this.animationDelay = 50; // Time delay for animations
    }

    async addWord(word: string) {
        let currentNode = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!currentNode.children[char]) {
                currentNode.children[char] = new TrieNode();
            }
            currentNode = currentNode.children[char];
            await this.animate('insert', char);
        }
        currentNode.isEndOfWord = true;
        await this.animate('insert', word);
    }

    async removeWord(word: string) {
        await this._remove(this.root, word, 0);
    }

    private async _remove(node: TrieNode, word: string, index: number) {
        if (index === word.length) {
            if (!node.isEndOfWord) {
                return false;
            }
            node.isEndOfWord = false;
            await this.animate('delete', word);
            return Object.keys(node.children).length === 0;
        }

        const char = word[index];
        const childNode = node.children[char];
        if (!childNode) {
            return false;
        }

        const shouldDeleteChild = await this._remove(childNode, word, index + 1);
        if (shouldDeleteChild) {
            delete node.children[char];
            await this.animate('delete', char);
            return Object.keys(node.children).length === 0;
        }
        return false;
    }

    async autocomplete(prefix: string) {
        const node = this._searchNode(prefix);
        const suggestions: string[] = [];
        if (node !== null) {
            await this._dfs(node, prefix, suggestions);
        }
        return suggestions;
    }

    private _searchNode(word: string) {
        let currentNode = this.root;
        for (let i = 0; i < word.length; i++) {
            if (!currentNode.children[word[i]]) {
                return null;
            }
            currentNode = currentNode.children[word[i]];
        }
        return currentNode;
    }

    private async _dfs(node: TrieNode, prefix: string, suggestions: string[]) {
        if (node.isEndOfWord) {
            suggestions.push(prefix);
            await this.animate('autocomplete', prefix);
        }
        for (const child in node.children) {
            await this._dfs(node.children[child], prefix + child, suggestions);
        }
    }

    private animate(type: string, word: string) {
        return new Promise<void>((resolve) => {
            console.log(`Animation event: ${type} ${word}`);
            setTimeout(resolve, this.animationDelay);
        });
    }
}