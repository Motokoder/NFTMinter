const { assert } = require('chai');
const web3 = require('web3');
const appConfig = require('../src/appconfig.json');

const nftFactory = artifacts.require('./NftFactory.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('NftFactory', (accounts) => {
  let factoryContract;

  //https://github.com/indutny/bn.js/
  let zero = web3.utils.toBN(0);
  let fiveEther = web3.utils.toBN(web3.utils.toWei('5', 'ether'));
  let tenEther = web3.utils.toBN(web3.utils.toWei('10', 'ether'));

  before(async () => {
    factoryContract = await nftFactory.deployed();
  });

  describe('NftFactory deployment', async () => {
    it('deploys successfully', async () => {
      const address = factoryContract.address;

      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('sets price', async () => {
        await factoryContract.updatePrice(tenEther); //10 ether

        let currentPrice = await factoryContract.getCurrentPrice();

        assert.isTrue(currentPrice.eq(tenEther), 'price should equal 10 ether');
    });
  });

  describe('NftCollection deployment', async () => {

    let txResult;
    let collectionAddress;

    it('deploys new collection', async () => {
      txResult = await factoryContract.createCollection('My Collection', 'MYCOLL', 3, {value: web3.utils.toWei('10', 'ether')});
      collectionAddress = txResult.receipt.logs[0].address;

      // SUCCESS
      assert.notEqual(collectionAddress, 0x0);
      assert.notEqual(collectionAddress, '');
      assert.notEqual(collectionAddress, null);
      assert.notEqual(collectionAddress, undefined);
    });

    it('collection is owned by wallet address', async () => {
        const collectionOwner = txResult.receipt.logs[0].args.newOwner;

        assert.equal(txResult.receipt.logs[0].event, 'OwnershipTransferred');
        assert.equal(collectionOwner, accounts[0], 'collection owner should match the wallet account');
    });

    it('is added to factory mapping', async () => {
        //gets addresses for the wallet address matching msg.sender
        const nftCollections = await factoryContract.getNftCollections();

        assert.equal(nftCollections.length, 1);
        assert.equal(nftCollections[0], collectionAddress);
    });

    it('is added to wallets array', async () => {
      const wallets = await factoryContract.getWallets();

      assert.equal(wallets.length, 1);
      assert.equal(wallets[0], accounts[0]);
    });

  });

  describe('NftFactory withdraw', async () => {
    it('withdraws successfuly', async () => {
        const balance = await factoryContract.getBalance();
        assert.isTrue(balance.gt(zero), 'balance should be greater than 0 before withdrawal')

        await factoryContract.withdraw(appConfig.getFactoryContractAddress(), fiveEther);

        const newBalance = await factoryContract.getBalance();
        assert.isTrue(newBalance.eq(fiveEther), 'balance should be five ether after withdrawal');
    })
  });

});
