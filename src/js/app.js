App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    propid: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    proof: {}, 

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.propid = $("#propid").val();
        App.ownerID = $("#ownerID").val();
        try{
            App.proof = JSON.parse($("#proof").val());
        }catch(err){App.proof = {}}

        console.log(
            App.propid,
            App.ownerID,
            App.proof, 
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSolnSquareVerifier='../../eth-contracts/build/contracts/SolnSquareVerifier.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSolnSquareVerifier, function(data) {
            console.log('data',data);
            var jsonSolnSquareVerifierArtifact = data;
            App.contracts.SolnSquareVerifier = TruffleContract(jsonSolnSquareVerifierArtifact);
            App.contracts.SolnSquareVerifier.setProvider(App.web3Provider);
            
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();
        App.readForm();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.mintToken(event);
                break;
            }
    },

    mintToken: function(event) {
        event.preventDefault();

        App.contracts.SolnSquareVerifier.deployed().then(function(instance) {
            return instance.mintToken(
                App.metamaskAccountID, App.propid, 
                App.proof.proof.a, App.proof.proof.a_p,
                App.proof.proof.b, App.proof.proof.b_p,
                App.proof.proof.c, App.proof.proof.c_p,
                App.proof.proof.h, App.proof.proof.k, 
                App.proof.inputs, {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('mintToken',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SolnSquareVerifier.currentProvider.sendAsync !== "function") {
            App.contracts.SolnSquareVerifier.currentProvider.sendAsync = function () {
                return App.contracts.SolnSquareVerifier.currentProvider.send.apply(
                App.contracts.SolnSquareVerifier.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SolnSquareVerifier.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
