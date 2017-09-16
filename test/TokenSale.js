const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MyToken = artifacts.require('MyToken');
const TokenSale = artifacts.require('TokenSale');

contract('TokenSale', accounts => {
  describe('given a tokens contract', async function () {
    let myToken = null;
    const owner = accounts[0];

    beforeEach(async function() {
      myToken = await MyToken.new({ from: owner });
    });

    describe('given a token sale contract', async function () {
      let tokenSale = null;
      const _price = 10000;
      const seller = owner;

      beforeEach(async function() {
        tokenSale = await TokenSale.new(myToken.address, _price, { from: seller });
      });

      it('is initialized with a price, the owner, the tokens contract and no tokens for sale', async function () {
        const owner = await tokenSale.owner();
        const closed = await tokenSale.closed();
        const amount = await tokenSale.amount();
        const price = await tokenSale.priceInWei();
        const tokenAddress = await tokenSale.token();

        closed.should.be.false;
        owner.should.be.equal(seller);
        amount.should.be.bignumber.equal(0);
        price.should.be.bignumber.equal(_price);
        tokenAddress.should.be.equal(myToken.address);
      });

      describe('when the seller transfer some tokens to the sale contract', async function() {
        const _amount = new BigNumber(10);

        beforeEach(async function() {
          await myToken.transfer(tokenSale.address, _amount, { from: seller });
        });

        it('has some tokens for sale', async function () {
          const amount = await tokenSale.amount();
          const sellerTokens = await myToken.balanceOf(seller);
          const contractTokens = await myToken.balanceOf(tokenSale.address);

          amount.should.be.bignumber.equal(amount);
          sellerTokens.should.be.bignumber.equal(9990);
          contractTokens.should.be.bignumber.equal(amount);
        });

        describe('when a buyer sends ether to the token sale contract', async function() {
          const buyer = accounts[1];
          let transaction = null;

          describe('when the buyer sends the set price in ether', async function() {
            const value = _price;
            let buyerPreEtherBalance = null
            let sellerPreEtherBalance = null

            beforeEach(async function() {
              buyerPreEtherBalance = web3.eth.getBalance(buyer);
              sellerPreEtherBalance = web3.eth.getBalance(seller);
              transaction = await tokenSale.sendTransaction({ from: buyer, value: value, gasPrice: 0 });
            });

            it('transfers the tokens to the buyer', async function () {
              const buyerTokens = await myToken.balanceOf(buyer);
              const sellerTokens = await myToken.balanceOf(seller);
              const contractTokens = await myToken.balanceOf(tokenSale.address);

              buyerTokens.should.be.bignumber.equal(10);
              sellerTokens.should.be.bignumber.equal(9990);
              contractTokens.should.be.bignumber.equal(0);
            });

            it('transfers the ether to the seller', async function () {
              web3.eth.getBalance(seller).should.bignumber.be.equal(sellerPreEtherBalance.plus(value));
              web3.eth.getBalance(buyer).should.bignumber.be.equal(buyerPreEtherBalance.minus(value));
            });

            it('closes the contract and triggers a purchase event', async function() {
              const closed = await tokenSale.closed();

              closed.should.be.true;
              transaction.logs[0].event.should.be.equal('TokenPurchased');
            });
          });

          describe('when the buyer sends less than the set price', async function() {
            const value = _price - 1;

            it('does not transfer those tokens nor ether', async function () {
              await assertItDoesNotTransferTokensNorEtherAndDoesNotCloseTheContract(buyer, value, _amount);
            });
          });

          describe('when the buyer sends more than the set price', async function() {
            const value = _price + 1;

            it('does not transfer those tokens nor ether', async function () {
              await assertItDoesNotTransferTokensNorEtherAndDoesNotCloseTheContract(buyer, value, _amount);
            });
          });
        });

        describe('when the seller requests a refund', async function() {
          let refund = null;

          describe('when no one has payed for those tokens', async function() {
            let sellerPreBalance = null;

            beforeEach(async function() {
              sellerPreBalance = web3.eth.getBalance(seller);
              refund = await tokenSale.refund({ from: seller, gasPrice: 0 });
            });

            it('returns the tokens to the seller and closes the contract', async function() {
              const closed = await tokenSale.closed();
              const amount = await tokenSale.amount();
              const sellerTokens = await myToken.balanceOf(seller);
              const contractTokens = await myToken.balanceOf(tokenSale.address);

              closed.should.be.true;
              amount.should.be.bignumber.equal(0);
              contractTokens.should.be.bignumber.equal(0);
              sellerTokens.should.be.bignumber.equal(10000);

              refund.logs[0].event.should.be.equal('Refund');
              web3.eth.getBalance(seller).should.be.bignumber.equal(sellerPreBalance);
            });

            describe('when a buyer sends ether to the token sale contract', async function() {
              const value = _price;
              const buyer = accounts[1];

              it('does not transfer those tokens nor ether', async function () {
                const sellerPreEtherBalance = web3.eth.getBalance(seller);
                const buyerPreEtherBalance = web3.eth.getBalance(buyer);

                try {
                  await tokenSale.sendTransaction({ from: buyer, value: value, gasPrice: 0 });
                } catch(error) {
                  error.message.search('invalid opcode').should.be.above(0);
                }

                const closed = await tokenSale.closed();
                const buyerTokens = await myToken.balanceOf(buyer);
                const sellerTokens = await myToken.balanceOf(seller);
                const contractTokens = await myToken.balanceOf(tokenSale.address);

                closed.should.be.true;
                buyerTokens.should.be.bignumber.equal(0);
                contractTokens.should.be.bignumber.equal(0);
                sellerTokens.should.be.bignumber.equal(10000);
                web3.eth.getBalance(seller).should.bignumber.be.equal(sellerPreEtherBalance);
                web3.eth.getBalance(buyer).should.bignumber.be.equal(buyerPreEtherBalance);
              });
            });
          });

          describe('when someone already payed for those tokens', async function() {
            const buyer = accounts[1];

            beforeEach(async function() {
              await tokenSale.sendTransaction({ from: buyer, value: _price, gasPrice: 0 })
            });

            it('refuses the refund and does not alter the state of the contract', async function() {
              try {
                refund = await tokenSale.refund({ from: seller, gasPrice: 0 });
              } catch(error) {
                error.message.search('invalid opcode').should.be.above(0);
              }

              const amount = await tokenSale.amount();
              const closed = await tokenSale.closed();
              const buyerTokens = await myToken.balanceOf(buyer);
              const sellerTokens = await myToken.balanceOf(seller);
              const contractTokens = await myToken.balanceOf(tokenSale.address);

              closed.should.be.true;
              amount.should.be.bignumber.equal(0);
              buyerTokens.should.be.bignumber.equal(10);
              sellerTokens.should.be.bignumber.equal(9990);
              contractTokens.should.be.bignumber.equal(0);
            });
          });
        });
      });

      describe('when the seller did not transfer any tokens to the sale contract', async function() {
        const amount = new BigNumber(0);

        describe('when a buyer sends ether to the token sale contract', async function() {
          const buyer = accounts[1];

          describe('when the buyer sends the set price in ether', async function() {
            const value = _price;

            it('does not transfer those tokens nor ether', async function () {
              await assertItDoesNotTransferTokensNorEtherAndDoesNotCloseTheContract(buyer, value, amount);
            });
          });

          describe('when the buyer sends less than the set price', async function() {
            const value = _price - 1;

            it('does not transfer those tokens nor ether', async function () {
              await assertItDoesNotTransferTokensNorEtherAndDoesNotCloseTheContract(buyer, value, amount);
            });
          });

          describe('when the buyer sends more than the set price', async function() {
            const value = _price + 1;

            it('does not transfer those tokens nor ether', async function () {
              await assertItDoesNotTransferTokensNorEtherAndDoesNotCloseTheContract(buyer, value, amount);
            });
          });
        });

        describe('when the seller requests a refund', async function() {
          let refund = null;

          it('refuses the refund and does not alter the state of the contract', async function() {
            try {
              refund = await tokenSale.refund({ from: seller, gasPrice: 0});
            } catch(error) {
              error.message.search('invalid opcode').should.be.above(0);
            }

            const closed = await tokenSale.closed();
            const sellerTokens = await myToken.balanceOf(seller);
            const contractTokens = await myToken.balanceOf(tokenSale.address);

            closed.should.be.false;
            contractTokens.should.be.bignumber.equal(0);
            sellerTokens.should.be.bignumber.equal(10000);
          });
        });
      });

      async function assertItDoesNotTransferTokensNorEtherAndDoesNotCloseTheContract(buyer, value, contractExpectedTokens) {
        const totalSupply = await myToken.totalSupply();
        const buyerPreEtherBalance = web3.eth.getBalance(buyer);
        const sellerPreEtherBalance = web3.eth.getBalance(seller);

        try {
          await tokenSale.sendTransaction({ from: buyer, value: value, gasPrice: 0 });
        } catch(error) {
          error.message.search('invalid opcode').should.be.above(0);
        }

        const closed = await tokenSale.closed();
        const amount = await tokenSale.amount();
        const buyerTokens = await myToken.balanceOf(buyer);
        const sellerTokens = await myToken.balanceOf(seller);
        const contractTokens = await myToken.balanceOf(tokenSale.address);

        closed.should.be.false;
        buyerTokens.should.be.bignumber.equal(0);
        amount.should.be.bignumber.equal(contractExpectedTokens);
        contractTokens.should.be.bignumber.equal(contractExpectedTokens);
        sellerTokens.should.be.bignumber.equal(totalSupply.minus(contractExpectedTokens));

        web3.eth.getBalance(buyer).should.bignumber.be.equal(buyerPreEtherBalance);
        web3.eth.getBalance(seller).should.bignumber.be.equal(sellerPreEtherBalance);
      }
    });
  });
});
