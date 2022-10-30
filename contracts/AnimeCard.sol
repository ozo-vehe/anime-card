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

contract AnimeCard is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    IERC721Receiver
{
    constructor() ERC721("AnimeCard", "ANFT") {}

    using Counters for Counters.Counter;
    Counters.Counter private anime_counter;

    struct Card {
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => Card) private cards;

    /// Modifiers used in this smart contract
    modifier onlyOwner(uint256 _token_id) {
        require(
            msg.sender == cards[_token_id].owner,
            "Only the owner has access to this"
        );
        _;
    }
    modifier cardExists(uint256 _token_id) {
        require(_exists(_token_id), "Sorry, anime card does not exist"); // Card must exist
        _;
    }

    /// @notice requests for card details like image and price.
    ///@notice Stores these details on the blockcahin
    /// @dev takes two parameters as arguments, saves them in the cards mapping with their length as a key
    /// @param uri the token's uri
    /// @param _price the price of the anime card uploaded
    function uploadCardDetails(string calldata uri, uint256 _price) external {
        require(bytes(uri).length > 8, "Invalid uri"); // token's uri on the frontend starts with https://
        uint256 _token_id = anime_counter.current();
        anime_counter.increment();
        cards[_token_id] = Card(payable(msg.sender), _price, false);
        _safeMint(msg.sender, _token_id);
        _setTokenURI(_token_id, uri);
    }

    /// @notice a function to read the values of a stored anime card
    /// @dev uses the token_id of an anime card which corresponds to the index in the cards mapping
    /// @param _token_id, token_id of the anime card whose values is to read
    /// @return anime card, with it's stored values
    function readAnimeCard(uint256 _token_id)
        public
        view
        cardExists(_token_id)
        returns (
            address payable,
            uint256,
            bool
        )
    {
        return (
            cards[_token_id].owner,
            cards[_token_id].price,
            cards[_token_id].sold
        );
    }

    /// @notice a function to purchase an anime card using its token_id
    /// @dev uses the token_id which corresponds to the stored anime card's index
    /// transfers the anime card to the buyer and the money to the seller
    ///     the following conditions must however be met before this transaction can successfully take place;
    ///     it requires that the buyer is different from the seller
    ///     it requires that the card to be bought has not been sold already
    ///     it requires that the buyer submits a valid price for the anime card to be purchased
    /// @param _token_id, of the desired anime card
    function buyAnimeCard(uint256 _token_id)
        external
        payable
        cardExists(_token_id)
    {
        Card storage currentCard = cards[_token_id];

        require(!currentCard.sold, "Sorry, anime card is sold out");
        require(
            msg.sender != currentCard.owner,
            "Sorry you can't buy your uploaded anime card"
        );
        require(
            msg.value == currentCard.price,
            "Please submit a valid price for the desired anime card"
        );

        address _owner = currentCard.owner;

        // transfer the anime card to the buyer
        _transfer(_owner, msg.sender, _token_id);

        // transfer the money to the seller
        (bool success, ) = payable(_owner).call{value: msg.value}("");
        require(success, "Transfer failed");
    }

    /// @notice a function to remove an anime card from the market
    /// @dev takes in the param _token_id which corresponds to the anime card index in the cards mapping
    /// uses the modifiers cardExists and onlyOwner
    /// changes the sold property to true, making the anime card unavailable for sale
    /// @param _token_id, id of the car to be gifted
    function removeFromMarket(uint256 _token_id)
        external
        cardExists(_token_id)
        onlyOwner(_token_id)
    {
        require(
            !cards[_token_id].sold,
            "Anime card is not in available the market"
        );
        cards[_token_id].sold = true;
    }

    /// @notice a function to send an anime card as a gift to another user
    /// @dev uses the _token_id which corresponds to the anime card's index to find the anime card
    /// and the _receivers address to which the anime card will be sent to
    /// checks to make sure the _receivers address is a valid address
    /// calls the safeTransferFrom function to transfer the card from the owner to the receiver
    /// uses the modifier cardExists and onlyOwner
    /// @param _token_id, id of the car to be gifted
    /// @param _receiver, the address of the receiver of the car gift
    function giftAnimeCard(uint256 _token_id, address _receiver)
        external
        cardExists(_token_id)
        onlyOwner(_token_id)
    {
        require(
            _receiver != address(0),
            "Error: Address zero is not a valid receiver"
        );
        require(msg.sender != _receiver, "Can't gift Yourrself");
        safeTransferFrom(msg.sender, _receiver, _token_id);
    }

    /// @notice a function to resell an anime card at a particular price
    /// @dev takes in the param _token_id which corresponds to the anime card's index to find the anime card in thre cards mapping
    /// requires that the anime card should not be in the market
    /// uses the modifiers cardExists anf onlyOwner
    /// assigns the appropriate values to the price and sold properties of the anime card
    /// @param _token_id, token_id of the anime card to be gifted which corresponds the index in the cards mapping
    /// @param _price, mew price of the anime card
    function resellAnimeCard(uint256 _token_id, uint256 _price)
        external
        cardExists(_token_id)
        onlyOwner(_token_id)
    {
        require(cards[_token_id].sold, "Card already in the marketplace");
        cards[_token_id].price = _price;
        cards[_token_id].sold = false;
    }

    // _beforeTokenTransfer is modified to ensure that the necessary state changes occur during transfers
    // the changes made to _beforeTokenTransfer will not apply during the minting process
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 token_id
    ) internal override(ERC721, ERC721Enumerable) {
        // _mint calls internally _beforeTokenTransfer
        // this prevents the if block to run when token is being minted
        if (from != address(0)) {
            // change the owner, sold and availalbe variable of the newly purchased anime card
            cards[token_id].owner = payable(to);
            cards[token_id].sold = true;
        }
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
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
