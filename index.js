const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor (fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor (timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock (difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Block got in my pocket' + this.hash);
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block('From ever', 'Sponsored by: Karl Marx', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions (miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction (transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress (address) {
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let karlMarxa = new Blockchain();

karlMarxa.createTransaction(new Transaction('Trillon Musqito', 'My pocket', 69.420));
karlMarxa.createTransaction(new Transaction('Trillon Musqito', 'Charity for Jeff Bezvezos', 0.69));
karlMarxa.createTransaction(new Transaction('Мy pocket', 'Charity for Jeff Bezvezos', 0.420));

console.log('Mining...');
karlMarxa.minePendingTransactions('jovan');

console.log('My fat pocket has ', karlMarxa.getBalanceOfAddress('jovan'));

console.log('Mining...');
karlMarxa.minePendingTransactions('jovan');

console.log('My fat pocket has ', karlMarxa.getBalanceOfAddress('jovan'));

