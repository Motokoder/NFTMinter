// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftCollection.sol";

contract NftFactory is Ownable {
    uint256 private _price = 1000000000000000000;
    address private _owner;

    mapping (address => address[]) private _walletContracts;
    address[] private _wallets;

    event CollectionCreated(address owner, address contractAddress);
    event OwnerWithdrawal(address owner, uint amount);

    //TODO: add variables and functions for storing challenges and wins
    //TODO: add logic for minting new NFTs after so many wins
    //TODO: Can a node service load the private key of this contract owner in order to update the wins?

    function createCollection(string memory name, string memory symbol, uint maxTokens) external payable {

        require(msg.value >= _price, string(abi.encodePacked("The price to create a collection was not met.")));

        NftCollection coll = new NftCollection(name, symbol, maxTokens, msg.sender);
        address addr = address(coll);

        //check if this wallet has been added to the mapping yet
        bool exists = _walletContracts[msg.sender].length > 0;
        if (!exists) {
            //track wallets in separate array
            _wallets.push(msg.sender);
        }
        
        //add adress to the wallet's mapping
        _walletContracts[msg.sender].push(addr);

        emit CollectionCreated(msg.sender, addr);
    }

    function getWallets() external view returns (address[] memory) {
        return _wallets;
    }

    function getWalletContracts(address wallet) external view returns (address[] memory) {
        return _walletContracts[wallet];
    }

    // function getWalletContracts() external view returns (address[] memory) {
    //     return _walletContracts[msg.sender];
    // }

    function getCurrentPrice() external view returns (uint256) {
        return _price;
    }

    function updatePrice(uint256 newPrice) external onlyOwner {
        require(newPrice >= 0, "the new price can not be less than zero");
        _price = newPrice;
    }

    function getBalance() external view onlyOwner returns (uint) {
        return address(this).balance;
    }

    function withdraw(address to, uint amount) external onlyOwner {
        // get the amount of Ether stored in this contract
        uint bal = address(this).balance;
        require(bal > amount, "amount cannot exceed balance");
        payable(to).transfer(amount);
        OwnerWithdrawal(to, amount);
    }
}
