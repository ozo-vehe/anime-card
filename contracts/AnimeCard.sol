// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Anime Card Smart Contract
/// @author John Obansa
/// @notice A smarty contract for minting, buying and selling anime cards

contract AnimeCard is ERC721, ERC721Enumerable, ERC721URIStorage, IERC721Receiver {
    constructor() ERC721("AnimeCard", "ANFT") {}

    using Counters for Counters.Counter;
    Counters.Counter private anime_counter;

    struct Card {
        address payable owner;
        string char_name;
        string image;
        uint256 token_id;
        uint256 price;
        bool sold;
        bool available;
    }

    mapping(uint256 => Card) internal cards;

/// Modifiers used in this smart contract
    modifier onlyOwner(uint256 _token_id){
        require(msg.sender == cards[_token_id].owner, "Only the owner has access to this");
        _;
    }
    modifier cardExists(uint256 _token_id){
        require(_token_id == cards[_token_id].token_id, "Sorry, anime card does not exist");    // Card must exist
        _;
    }

/// @notice a function for minting uploaded anime cards using the address and uri of the NFT to be minted
/// @dev mints an anime card image as an NFT
/// @param uri, the url of the anime card image to be minted
/// @param to, the address which the NFT is to be minted to
    function safeMint(address to, string memory uri) cardExists(anime_counter.current()) public {
        _safeMint(to, anime_counter.current());
        _setTokenURI(anime_counter.current(), uri);

        anime_counter.increment();
    }


/// @notice requests for car details like char_name, image and price. 
    /// Stores these details on the blockcahin
/// @dev takes three parameters as arguments, saves them in the cards mapping with their length as a key
/// @param _char_name, the character name of the anime card uploaded
/// @param _image, the image of the anime card uploaded
/// @param _price, the price of the anime card uploaded
    function uploadCardDetails (
        string memory _char_name,
        string memory _image,
        uint256 _price
    ) external {
        bool _sold = false;
        bool _available = true;
        uint256 _length = totalSupply();
        uint256 _token_id = anime_counter.current();

        cards[_length] = Card (
            payable(msg.sender),
            _char_name,
            _image,
            _token_id,
            _price,
            _sold,
            _available
        );
        
    }


/// @notice a function to read the values of a stored anime card
/// @dev uses the token_id of an anime card which corresponds to the index in the cards mapping
/// @param _token_id, token_id of the anime card whose values is to read
/// @return anime card, with it's stored values
    function readAnimeCard(uint256 _token_id) external view returns (
        address payable,
        string memory,
        string memory,
        uint256,
        uint256,
        bool,
        bool
    ) {
        return (
            cards[_token_id].owner,
            cards[_token_id].char_name,
            cards[_token_id].image,
            cards[_token_id].token_id,
            cards[_token_id].price,
            cards[_token_id].sold,
            cards[_token_id].available
        );
    }


/// @notice a function to purchase an anime card using its token_id
/// @dev uses the token_id which corresponds to the stored anime card's index
/// transfers the anime card to the buyer and the money to the seller
///     the following conditions must however be met before this transaction can successfully take place;
///     it requires that the buyer is different from the seller
///     it requires that the card to be bought has not been sold already
///     it requires that the buyer submits a valid price for the anime card to be purchased
///     it requires that the anime card must be available in the market and it's for sale
/// @param _token_id, of the desired anime card
    function buyAnimeCard(uint256 _token_id) external payable {
        // sold value of the requested anime card
        bool _sold = cards[_token_id].sold;
        // available value of the requested anime card
        bool _available = cards[_token_id].available;
        // price value of the requested anime card
        uint256 _price = cards[_token_id].price;

        require(_available, "Sorry, anime card currently not available");
        require(!_sold, "Sorry, anime card is sold out");
        require(msg.sender != cards[_token_id].owner, "Sorry you can't buy your uploaded anime card");
        require(msg.value >= _price, "Please submit a valid price for the desired anime card");

        address _owner = ownerOf(_token_id);

        // transfer the anime card to the buyer
        _transfer(_owner, msg.sender, _token_id);

        // transfer the money to the seller
        cards[_token_id].owner.transfer(msg.value);

        // change the owner, sold and availalbe variable of the newly purchased anime card
        cards[_token_id].owner = payable(msg.sender);
        cards[_token_id].sold = true;
        cards[_token_id].available = false;
    }

/// @notice a function to remove an anime card from the market
/// @dev takes in the param _token_id which corresponds to the anime card index in the cards mapping
/// uses the modifiers cardExists and onlyOwner
/// changes the available property to false, making the anime card unavailable for sale
/// @param _token_id, id of the car to be gifted
    function removeFromMarket(uint256 _token_id) external cardExists(_token_id) onlyOwner(_token_id){
        require(cards[_token_id].available, "Anime card is not in available the market");
        cards[_token_id].available = false;
    }


/// @notice a function to send an anime card as a gift to another user
/// @dev uses the _token_id which corresponds to the anime card's index to find the anime card
/// and the _receivers address to which the anime card will be sent to
/// checks to make sure the _receivers address is a valid address
/// calls the safeTransferFrom function to transfer the card from the owner to the receiver
/// uses the modifier cardExists and onlyOwner
/// @param _token_id, id of the car to be gifted
/// @param _receiver, the address of the receiver of the car gift
    function giftAnimeCard(uint256 _token_id, address _receiver) external cardExists(_token_id) onlyOwner(_token_id){
        require(msg.sender != _receiver, "Can't gift Yourrself");

        if(_receiver != address(0)) {
            cards[_token_id].owner = payable(_receiver);
            safeTransferFrom(msg.sender, _receiver, _token_id);

            cards[_token_id].sold = true;
            cards[_token_id].available = false;
        }
    }


/// @notice a function to resell an anime card at a particular price
/// @dev takes in the param _token_id which corresponds to the anime card's index to find the anime card in thre cards mapping
/// requires that the anime card should not be in the market
/// uses the modifiers cardExists anf onlyOwner
/// assigns the appropriate values to the price, sold and available properties of the anime card
/// @param _token_id, token_id of the anime card to be gifted which corresponds the index in the cards mapping
/// @param _price, mew price of the anime card
    function resellAnimeCard(uint256 _token_id, uint256 _price) external cardExists(_token_id) onlyOwner(_token_id){
        require(!cards[_token_id].available, "Card already in the marketplace");

        cards[_token_id].price = _price;
        cards[_token_id].sold = false;
        cards[_token_id].available = true;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 token_id
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, token_id);
    }

    function _burn(uint256 token_id)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(token_id);
    }

    function tokenURI(uint256 token_id)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(token_id);
    }
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) override external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
