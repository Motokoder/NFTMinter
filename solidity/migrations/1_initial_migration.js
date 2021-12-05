const Migrations = artifacts.require("Migrations");
const NftFactory = artifacts.require("NftFactory");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(NftFactory);
};
