const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MyToken = artifacts.require('MyToken');
const TokenPurchase = artifacts.require('TokenPurchase');

contract('TokenPurchase', accounts => {

  describe('given a tokens contract with an initial owner', async function () {
    let myToken = null;
    const owner = accounts[0];

    beforeEach(async function() {
      myToken = await MyToken.new({ from: owner });
    });

    describe('given a token purchase contract', async function () {
      let tokenPurchase = null;
      const purchaser = accounts[1];
      const buyingAmountOfTokens = new BigNumber(10);

      beforeEach(async function() {
        tokenPurchase = await TokenPurchase.new(myToken.address, buyingAmountOfTokens, { from: purchaser });
      });

      it('is initialized with the owner, the amount of tokens to buy, and the tokens contract', async function () {
        const owner = await tokenPurchase.owner();
        const amount = await tokenPurchase.amount();
        const tokenAddress = await tokenPurchase.token();

        owner.should.be.equal(purchaser);
        tokenAddress.should.be.equal(myToken.address);
        amount.should.be.bignumber.equal(buyingAmountOfTokens);
      });

      it('is not closed and does not have ether initially', async function () {
        const priceInWei = await tokenPurchase.priceInWei();
        const closed = await tokenPurchase.closed();

        closed.should.be.true;
        priceInWei.should.be.bignumber.equal(0);
      });

      describe('when some ether is transferred to the purchase contract', async function() {
        let transaction = null;

        describe('when the the amount of sent ether is greater than 0', async function() {
          const value = new BigNumber(1000);

          describe('when the sender is the purchaser of the purchase contract', async function() {
            let purchaserPreEtherBalance = null;
            let contractPreEtherBalance = null;

            beforeEach(async function() {
              purchaserPreEtherBalance = web3.eth.getBalance(purchaser);
              contractPreEtherBalance = web3.eth.getBalance(tokenPurchase.address);
              transaction = await tokenPurchase.sendTransaction({ from: purchaser, value: value, gasPrice: 0 });
            });

            it('opens the purchase contract and receives the amount of ether as the price for those tokens', async function () {
              const closed = await tokenPurchase.closed();
              const priceInWei = await tokenPurchase.priceInWei();

              closed.should.be.false;
              priceInWei.should.be.bignumber.equal(value);
              web3.eth.getBalance(purchaser).should.bignumber.be.equal(purchaserPreEtherBalance.minus(value));
              web3.eth.getBalance(tokenPurchase.address).should.bignumber.be.equal(contractPreEtherBalance.plus(value));
            });

            describe('when a seller approves some tokens to the purchase contract and claims the balance of the contract', async function () {
              let claim = null;
              const seller = owner;

              describe('when a seller approves less than the requested amount of tokens to the purchase contract', async function () {
                beforeEach(async function() {
                  await myToken.approve(tokenPurchase.address, buyingAmountOfTokens.minus(1), { from: seller });
                });
                
                it('does not transfer the money to the seller nor the tokens to the purchaser', async function() {
                  const sellerPreEtherBalance = web3.eth.getBalance(seller);
                  const contractPreEtherBalance = web3.eth.getBalance(tokenPurchase.address);

                  try {
                    await tokenPurchase.claim({ from: seller, gasPrice: 0 });
                  } catch(error) {
                    error.message.search('invalid opcode').should.be.above(0);
                  }

                  const closed = await tokenPurchase.closed();
                  const purchaserTokens = await myToken.balanceOf(purchaser);

                  closed.should.be.false;
                  purchaserTokens.should.be.bignumber.equal(0);
                  web3.eth.getBalance(seller).should.be.bignumber.equal(sellerPreEtherBalance);
                  web3.eth.getBalance(tokenPurchase.address).should.be.bignumber.equal(contractPreEtherBalance);
                });
              });

              describe('when a seller approves the requested amount of tokens to the purchase contract', async function () {
                beforeEach(async function() {
                  await myToken.approve(tokenPurchase.address, buyingAmountOfTokens, { from: seller, gasPrice: 0 });
                });
                
                it('transfers the money to the seller and the tokens to the purchaser', async function() {
                  const sellerPreEtherBalance = web3.eth.getBalance(seller);

                  claim = await tokenPurchase.claim({ from: seller, gasPrice: 0 });
                  const closed = await tokenPurchase.closed();
                  const purchaserTokens = await myToken.balanceOf(purchaser);

                  closed.should.be.true;
                  purchaserTokens.should.be.bignumber.equal(buyingAmountOfTokens);
                  web3.eth.getBalance(tokenPurchase.address).should.be.bignumber.equal(0);
                  web3.eth.getBalance(seller).should.be.bignumber.equal(sellerPreEtherBalance.plus(value));
                  claim.logs[0].event.should.be.equal('TokenSold');
                });

                it('does not allow to receive more ether', async function() {
                  await tokenPurchase.claim({ from: seller, gasPrice: 0 });

                  try {
                    await tokenPurchase.sendTransaction({ from: purchaser, value: new BigNumber(10) });
                  } catch (error) {
                    error.message.search('invalid opcode').should.be.above(0);
                  }
                  const closed = await tokenPurchase.closed()

                  closed.should.be.true;
                  web3.eth.getBalance(tokenPurchase.address).should.be.bignumber.equal(0);
                });

                describe('when the purchaser requests a refund', async function() {
                  let refund = null;

                  it('refuses the refund, does not close the contract and the allowance to the contract remains', async function() {
                    const contractPreEtherBalance = web3.eth.getBalance(tokenPurchase.address);
                    const purchaserPreEtherBalance = web3.eth.getBalance(purchaser);

                    try {
                      refund = await tokenPurchase.refund({ from: purchaser, gasPrice: 0 });
                    } catch (error) {
                      error.message.search('invalid opcode').should.be.above(0);
                    }

                    const closed = await tokenPurchase.closed();
                    const allowedTokens = await myToken.allowance(seller, tokenPurchase.address);

                    closed.should.be.true;
                    allowedTokens.should.be.bignumber.equal(buyingAmountOfTokens);

                    web3.eth.getBalance(tokenPurchase.address).should.be.bignumber.equal(0);
                    web3.eth.getBalance(purchaser).should.be.bignumber.equal(purchaserPreEtherBalance.plus(contractPreEtherBalance));
                  });
                });
              });

              describe('when a seller approves more than the requested amount of tokens to the purchase contract', async function () {
                beforeEach(async function() {
                  await myToken.approve(tokenPurchase.address, buyingAmountOfTokens.plus(1), { from: seller });
                });

                it('transfers the money to the seller and the tokens to the purchaser', async function() {
                  const sellerPreEtherBalance = web3.eth.getBalance(seller);

                  claim = await tokenPurchase.claim({ from: seller, gasPrice: 0 });
                  const closed = await tokenPurchase.closed();
                  const purchaserTokens = await myToken.balanceOf(purchaser);

                  closed.should.be.true;
                  purchaserTokens.should.be.bignumber.equal(buyingAmountOfTokens);
                  web3.eth.getBalance(tokenPurchase.address).should.be.bignumber.equal(0);
                  web3.eth.getBalance(seller).should.be.bignumber.equal(sellerPreEtherBalance.plus(value));
                  claim.logs[0].event.should.be.equal('TokenSold');
                });
              });
            });

            describe('when the purchaser requests a refund', async function() {
              let refund = null;

              it('returns the balance to the purchaser and closes the contract', async function() {
                refund = await tokenPurchase.refund({ from: purchaser, gasPrice: 0 });

                const amount = await tokenPurchase.amount();
                const closed = await tokenPurchase.closed();
                const priceInWei = await tokenPurchase.priceInWei();

                closed.should.be.true;
                priceInWei.should.be.bignumber.equal(0);
                amount.should.be.bignumber.equal(buyingAmountOfTokens);

                refund.logs[0].event.should.be.equal('Refund');
                web3.eth.getBalance(tokenPurchase.address).should.be.bignumber.equal(0);
                web3.eth.getBalance(purchaser).should.be.bignumber.equal(purchaserPreEtherBalance);
              });
            });
          });

          describe('when the sender is not the purchaser of the purchase contract', async function() {
            const anotherOne = accounts[3];

            it('does not open the purchase contract', async function () {
              await assertItDoesNotOpenThePurchaseContract(anotherOne, value);
            });
          });
        });

        describe('when the the amount of sent ether is 0', async function() {
          const value = new BigNumber(0);

          it('does not open the purchase contract', async function () {
            await assertItDoesNotOpenThePurchaseContract(purchaser, value);
          });
        });

        async function assertItDoesNotOpenThePurchaseContract(sender, value) {
          const senderPreEtherBalance = web3.eth.getBalance(sender);

          try {
            transaction = await tokenPurchase.sendTransaction({ from: sender, value: value, gasPrice: 0 });
          } catch (error) {
            error.message.search('invalid opcode').should.be.above(0);
          }
          const closed = await tokenPurchase.closed();
          const priceInWei = await tokenPurchase.priceInWei();

          closed.should.be.true;
          priceInWei.should.be.bignumber.equal(0);
          web3.eth.getBalance(tokenPurchase.address).should.bignumber.be.equal(0);
          web3.eth.getBalance(sender).should.bignumber.be.equal(senderPreEtherBalance);
        }
      });

      describe('when no ether was transferred to the purchase contract', async function() {

        describe('when a seller approves some tokens to the purchaser', async function () {
          const seller = owner;

          describe('when a seller approves less than the requested amount of tokens to the purchase contract', async function () {
            beforeEach(async function() {
              await myToken.approve(tokenPurchase.address, buyingAmountOfTokens.minus(1), { from: seller });
            });

            it('does not transfer the money to the seller nor the tokens to the purchaser', async function() {
              await itDoesNotTransferTheTokens();
            });
          });

          describe('when a seller approves the requested amount of tokens to the purchase contract', async function () {
            beforeEach(async function() {
              await myToken.approve(tokenPurchase.address, buyingAmountOfTokens, { from: seller });
            });

            it('does not transfer the money to the seller nor the tokens to the purchaser', async function() {
              await itDoesNotTransferTheTokens();
            });
          });

          describe('when a seller approves more than the requested amount of tokens to the purchase contract', async function () {
            beforeEach(async function() {
              await myToken.approve(tokenPurchase.address, buyingAmountOfTokens.plus(1), { from: seller });
            });

            it('does not transfer the money to the seller nor the tokens to the purchaser', async function() {
              await itDoesNotTransferTheTokens();
            });
          });

          async function itDoesNotTransferTheTokens() {
            const sellerPreEtherBalance = web3.eth.getBalance(seller);
            const contractPreEtherBalance = web3.eth.getBalance(tokenPurchase.address);

            try {
              await tokenPurchase.claim({ from: seller, gasPrice: 0 });
            } catch (error) {
              error.message.search('invalid opcode').should.be.above(0);
            }

            const purchaserTokens = await myToken.balanceOf(purchaser);
            const closed = await tokenPurchase.closed();

            closed.should.be.true;
            purchaserTokens.should.be.bignumber.equal(0);
            web3.eth.getBalance(seller).should.be.bignumber.equal(sellerPreEtherBalance);
            web3.eth.getBalance(tokenPurchase.address).should.be.bignumber.equal(contractPreEtherBalance);
          }
        });

        describe('when the purchaser requests a refund', async function() {
          let refund = null;

          it('refuses the refund and does not alter the status of the contract', async function() {
            const purchaserPreEtherBalance = web3.eth.getBalance(purchaser);

            try {
              refund = await tokenPurchase.refund({ from: purchaser, gasPrice: 0 });
            } catch (error) {
              error.message.search('invalid opcode').should.be.above(0);
            }
            const closed = await tokenPurchase.closed();
            const priceInWei = await tokenPurchase.priceInWei();

            closed.should.be.true;
            priceInWei.should.be.bignumber.equal(0);

            web3.eth.getBalance(tokenPurchase.address).should.be.bignumber.equal(0);
            web3.eth.getBalance(purchaser).should.be.bignumber.equal(purchaserPreEtherBalance);
          });
        });
      });
    });
  });
});
