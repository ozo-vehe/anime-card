import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button } from "react-bootstrap";
import { truncateAddress } from "../../../utils";
import Identicon from "../../ui/Identicon";
import PopUp from "../../ui/PopUp";
import { useContractKit } from "@celo-tools/use-contractkit";

const NftCard = ({ nft, change_data, buy, remove_card }) => {
  const { char_name, anime_name, image, owner, index, price, sold, available } = nft;
  const { kit } = useContractKit();
  const { defaultAccount } = kit;

  // Card button function to display a particular button depending on the
  // the owner of the Nft and the contract being displayed
  function card_button(owner, contract_address, sold, available, index) {
    if(owner === contract_address) {
      if(available) { return <> <PopUp data={(info) => {change_data({...info, index})}} data_name={"Gift Anime"} /> <Button onClick={()=>{remove_card({index})}} variant="outline-dark">Remove</Button> </> }
      else if (!available) {
        return <div className="d-flex justify-content-center gap-3"><PopUp data={nft_data} data_name={"Gift Anime"} /><PopUp data={nft_data} data_name="Resell Anime" /></div>
      }
    }
    else if (owner !== contract_address) {
      if(sold) { return <Button disabled variant="danger" style={{ minWidth: "70px"}}>Sold</Button> }
      else if(!available) { return <Button disabled variant="danger" style={{ minWidth: "70px"}}>Removed</Button> }
      else if(!sold && available) { return <Button variant="dark" style={{ minWidth: "70px"}} onClick={()=> {buy({index})}}>Buy</Button> }
    }
  }
  
  // nft_data gotten from the pop up component
  // data will be passed to the index.js component for use
  async function nft_data(formData) {
    change_data({
      ...formData,
      index
    })
  }
  
  return (
    <>
    <Col key={index}>
      <Card className="position-relative">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Identicon address={owner} size={28} />
            <span className="font-monospace text-secondary">
              {truncateAddress(owner)}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {index} ID
            </Badge>
          </Stack>
        </Card.Header>

        <div className="card_image ratio ratio-4x3" style={{position: "relative"}}>
          <img src={image} alt={anime_name} style={{objectFit:"cover"}} />
          <div className="price_tag">
            <p>{price / 10**18}cUSD</p>
          </div>
        </div>

        <Card.Body className="card_body d-flex flex-column text-center">
          <Card.Title className="fs-3 d-flex justify-content-evenly align-items-center">{char_name}</Card.Title>
          <Card.Text className="flex-grow-1 text-capitalize">{anime_name}</Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-center gap-3">
          { card_button(owner, defaultAccount, sold, available, index) }
        </Card.Footer>
      </Card>
    </Col>
    </>
  );
};

NftCard.propTypes = {
  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
};

export default NftCard;