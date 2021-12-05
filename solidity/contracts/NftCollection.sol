// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NftCollection is ERC721Enumerable {
    address private _owner;
    uint public maxSupply = 0;
    //address public _parent;
    mapping (uint256 => string) private _arweaveHashes;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(string memory name, string memory symbol, uint maxTokens, address firstOwner) ERC721(name, symbol)  {
        // The constructor runs when the contract is deployed.
        // The sender is the wallet that deployed the contract.
        require(bytes(name).length > 0, "name is required");
        require(bytes(symbol).length > 0, "symbol is required");
        require(maxTokens > 0, "maxTokens must be greater than 0");
        maxSupply = maxTokens;

        _owner = firstOwner;
        emit OwnershipTransferred(address(0), firstOwner);
    }

    function _baseURI() internal pure override returns (string memory) {
        // Each token will be assigned a unique hash for the JSON metadata file.
        // The hash will be appended to this base URL. Ex: _tgG0KrXYCkTby6LVK6IUkP42blKjX5XXGiwqS9n46o
        return "https://arweave.net/";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_baseURI(), _arweaveHashes[tokenId]));
    }
    
    //The owner is the parent contract.
    //TODO: Should we pass an entire array of hashes to mint all at once?
    function mintToken(string memory arweaveHash) public onlyOwner {
        require(totalSupply() < maxSupply, "The mint count exceeds the maximum supply");
        uint256 tokenId = totalSupply() + 1;
        _arweaveHashes[tokenId] = arweaveHash;
        _safeMint(msg.sender, tokenId);
    }

    //Get all tokens owned by an address.
    function tokensOfOwner(address addr) external view returns(uint256[] memory ) {
        uint256 tokenCount = balanceOf(addr);
        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 total = totalSupply();
            uint256 index;
            for (index = 0; index < total; index++) {
                uint256 tokenId = tokenByIndex(index);
                address tokenOwner = ownerOf(tokenId);
                if (addr == tokenOwner) {
                   result[index] = tokenOfOwnerByIndex(addr, index);
                }
            }
            return result;
        }
    }



    //Ownable.sol methods. Cannot inherit since owner is passed to constructor.

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}