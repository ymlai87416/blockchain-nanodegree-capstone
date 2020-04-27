pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/utils/Address.sol";
import "./verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier{

}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is  TomPropertyListingERC721Token{

    SquareVerifier private verifierContract;

    constructor(address verifierAddress) public {
        verifierContract = SquareVerifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solutions{
        uint index;
        address to;
    }

    // TODO define an array of the above struct
    Solutions[] private solutionList;

    // TODO define a mapping to store unique solutions submitted
    mapping (bytes32 => Solutions) private uniqueSolutions;
    
    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint index, address to);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address to,
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input) public
    {
        bytes32 key = keccak256(abi.encodePacked(a,a_p,b,b_p,c,c_p,h,k,input));
        require(uniqueSolutions[key].to == address(0), "Solution is already existed.");

        uint nextIdx = solutionList.length;
        Solutions memory soln = Solutions({index: nextIdx, to: to});
        solutionList.push(soln);
        uniqueSolutions[key] = soln;
        emit SolutionAdded(nextIdx, to);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(address to, uint256 tokenId,
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input)
            public
    {
        require(verifierContract.verifyTx(a,a_p,b,b_p,c,c_p,h,k,input), "Not a valid solution.");
    
        addSolution(to, a, a_p, b, b_p, c, c_p, h, k ,input);
        super.mint(to, tokenId, "");
    }
}