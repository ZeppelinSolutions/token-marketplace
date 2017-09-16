const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MyToken = artifacts.require('MyToken');
const TokenSale = artifacts.require('TokenSale');
const TokenSaleFactory = artifacts.require('TokenSaleFactory');

contract('TokenSaleFactory', accounts => {
  describe('given an token sale factory contract', async function () {
    let factory = null;
    const owner = accounts[0];

    beforeEach(async function() {
      factory = await TokenSaleFactory.new({ from: owner });
    });

    describe('given a tokens contract with an initial owner', async function () {
      let myToken = null;

      beforeEach(async function() {
        myToken = await MyToken.new({ from: owner });
      });

      describe('when a seller creates a token sale', async function() {
        const seller = owner;

        describe('when the given amount is greater than 0', async function() {
          const _price = new BigNumber(10);

          it('creates a token sale contract and transfers the ownership to the seller', async function () {
            const transaction = await factory.createTokenSale(myToken.address, _price, { from: seller, gasPrice: 0 });
            const tokenSaleAddress = transaction.logs[0].args.tokenSaleAddress;
            const tokenSale = await TokenSale.at(tokenSaleAddress);

            const owner = await tokenSale.owner();
            const amount = await tokenSale.amount();
            const closed = await tokenSale.closed();
            const tokenAddress = await tokenSale.token();
            const priceInWei = await tokenSale.priceInWei();

            closed.should.be.false;
            owner.should.be.equal(seller);
            amount.should.be.bignumber.equal(0);
            priceInWei.should.be.bignumber.equal(_price);
            tokenAddress.should.be.equal(myToken.address);
            transaction.logs[0].event.should.be.equal('TokenSaleCreated');
          });
        });

        describe('when the given price is not greater than 0', async function() {
          const _price = new BigNumber(0);

          it('does not create a raffle contract', async function () {
            try {
              await factory.createTokenSale(myToken.address, _price, { from: seller, gasPrice: 0 });
            } catch (error) {
              error.message.search('invalid opcode').should.be.above(0);
            }
          });
        });
      });
    });
  });
});
