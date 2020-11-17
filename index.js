const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + this.previousHash + this.nonce + JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log(`Block mined: ${this.hash}`);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 10;
    }

    createGenesisBlock() {
        return new Block(0, 'This year', 'Genesis Block', 'none');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
        
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.calculateHash()) {
                return false;
            }

            return true;
        }
    }
}

let inflatedCoin = new Blockchain();
console.log(`Mining block 1`);
inflatedCoin.addBlock(new Block(1, Date.now(), { amount: 500 }));
console.log(`Mining block 2`);
inflatedCoin.addBlock(new Block(2, Date.now(), { amount: 1000 }));
