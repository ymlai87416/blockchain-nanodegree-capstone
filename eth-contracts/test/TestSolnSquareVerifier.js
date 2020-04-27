let SquareVerifier = artifacts.require('SquareVerifier');
let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    beforeEach(async function () {
        //create new contract for new test
        const _SquareVerifier = await SquareVerifier.new({from:account_one});
        this.contract = await SolnSquareVerifier.new(_SquareVerifier.address,{from: account_one});
        this.correctproof = require('../../zokrates/code/square/proof');
        this.incorrectproof = require('../../zokrates/code/square/proof');
        this.incorrectproof.input=[10,1];
    })
    
    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('Should be able to add a new solution for contract - SolnSquareVerifier',async function(){
        try{
            await this.contract.addSolution(account_two, 
                this.correctproof.proof.a, this.correctproof.proof.a_p,
                this.correctproof.proof.b, this.correctproof.proof.b_p, 
                this.correctproof.proof.c, this.correctproof.proof.c_p, 
                this.correctproof.proof.h,
                this.correctproof.proof.k, 
                this.correctproof.inputs, {from:account_one});
        }
        catch(e)
        {
            assert.ok(false, "Solution cannot be added." + e.message);
        }

        try{
            await this.contract.addSolution(account_two, 
                this.correctproof.proof.a, this.correctproof.proof.a_p,
                this.correctproof.proof.b, this.correctproof.proof.b_p, 
                this.correctproof.proof.c, this.correctproof.proof.c_p, 
                this.correctproof.proof.h,
                this.correctproof.proof.k, 
                this.correctproof.inputs, {from:account_one});
            assert.ok(false, "Repeated solution should not be added.");
        }
        catch(e)
        {

        }

    }) 


    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('if an ERC721 token can be minted for contract',async function(){
        try{
            await this.contract.mintToken(account_two, 3,
                this.correctproof.proof.a, this.correctproof.proof.a_p, 
                this.correctproof.proof.b, this.correctproof.proof.b_p,
                this.correctproof.proof.c, this.correctproof.proof.c_p,
                this.correctproof.proof.h,
                this.correctproof.proof.k,
                this.correctproof.inputs, {from:account_one});
        }
        catch(e) {
            assert.ok(false, "Should be able to mint an ERC721 token given correct proof." + e.message);
        }
            
        try{
            await this.contract.mintToken(account_two, 2, 
                this.incorrectproof.proof.a, this.incorrectproof.proof.a_p,
                this.incorrectproof.proof.b, this.incorrectproof.proof.b_p,
                this.incorrectproof.proof.c, this.incorrectproof.proof.c_p,
                this.incorrectproof.proof.h,
                this.incorrectproof.proof.k,
                this.incorrectproof.inputs, {from:account_one});
            assert.ok(false, "Should return error given an incorrect proof.");
        }
        catch(e) {
        }
    })
});




