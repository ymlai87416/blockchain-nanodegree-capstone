// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
let squareVerifier = artifacts.require('SquareVerifier');

contract('TestSquareVerifier', accounts => {

    const account_one = accounts[0];

    describe('test verification with correct proof', function(){
        beforeEach(async function () { 
            this.contract = await squareVerifier.new({from: account_one});
            this.correctproof = require('../../zokrates/code/square/proof');
            this.incorrectproof = require('../../zokrates/code/square/proof');
            this.incorrectproof.inputs=[10,1];
        })

        // Test verification with correct proof
        // - use the contents from proof.json generated from zokrates steps
        it('verification with correct proof',async function(){

            let verified = await this.contract.verifyTx.call(
                this.correctproof.proof.a, this.correctproof.proof.a_p,
                this.correctproof.proof.b, this.correctproof.proof.b_p,
                this.correctproof.proof.c, this.correctproof.proof.c_p,
                this.correctproof.proof.h, this.correctproof.proof.k,
                this.correctproof.inputs, {from:account_one});

            assert.equal(verified, true, "Should return true for a correct proof.");
        })

        // Test verification with incorrect proof
        it('verification with incorrect proof',async function(){

            let verified = await this.contract.verifyTx.call(
                this.incorrectproof.proof.a, this.incorrectproof.proof.a_p,
                this.incorrectproof.proof.b, this.incorrectproof.proof.b_p,
                this.incorrectproof.proof.c, this.incorrectproof.proof.c_p,
                this.incorrectproof.proof.h, this.incorrectproof.proof.k,
                this.incorrectproof.inputs, {from:account_one});

            assert.equal(verified, false, "Should return false for an incorrect proof.");
        })
    })
});