interface Trie {
    [key: string]: Trie;
}

export class TrieClass {
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
        const traverse = (node: Trie, word: string) => {
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