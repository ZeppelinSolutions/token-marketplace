const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MyToken = artifacts.require('MyToken');
const TokenPurchase = artifacts.require('TokenPurchase');
const TokenPurchaseFactory = artifacts.require('TokenPurchaseFactory');

contract('TokenPurchaseFactory', accounts => {
  describe('given an token purchase factory contract', async function () {
    let factory = null;
    const owner = accounts[0];

    beforeEach(async function() {
      factory = await TokenPurchaseFactory.new({ from: owner });
    });

    describe('given a tokens contract with an initial owner', async function () {
      let myToken = null;

      beforeEach(async function() {
        myToken = await MyToken.new({ from: owner });
      });

      describe('when a purchaser creates a token purchase', async function() {
        const purchaser = accounts[1];

        describe('when the given amount is greater than 0', async function() {
          const _amount = new BigNumber(10);

          it('creates a token purchase contract and transfers the ownership to the purchaser', async function () {
            const transaction = await factory.createTokenPurchase(myToken.address, _amount, { from: purchaser, gasPrice: 0 });
            const tokenPurchaseAddress = transaction.logs[0].args.tokenPurchaseAddress;
            const tokenPurchase = await TokenPurchase.at(tokenPurchaseAddress);

            const owner = await tokenPurchase.owner();
            const amount = await tokenPurchase.amount();
            const closed = await tokenPurchase.closed();
            const tokenAddress = await tokenPurchase.token();
            const priceInWei = await tokenPurchase.priceInWei();

            closed.should.be.true;
            owner.should.be.equal(purchaser);
            priceInWei.should.be.bignumber.equal(0);
            amount.should.be.bignumber.equal(_amount);
            tokenAddress.should.be.equal(myToken.address);
            transaction.logs[0].event.should.be.equal('TokenPurchaseCreated');
          });
        });

        describe('when the given amount is not greater than 0', async function() {
          const _amount = new BigNumber(0);

          it('does not create a raffle contract', async function () {
            try {
              await factory.createTokenPurchase(myToken.address, _amount, { from: purchaser, gasPrice: 0 });
            } catch (error) {
              error.message.search('invalid opcode').should.be.above(0);
            }
          });
        });
      });
    });
  });
});
