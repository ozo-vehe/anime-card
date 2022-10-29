import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form } from "react-bootstrap";
import { uploadImage } from "../../../utils/minter";

const AddNfts = ({ save, address }) => {
  // State Variables
  const [char_name, setCharName] = useState("");
  const [anime_name, setAnimeName] = useState("");
  const [ipfsImage, setIpfsImage] = useState("");
  const [price, setPrice] = useState("");
  const [show, setShow] = useState(false);
  
  // close the popup modal
  const handleClose = () => setShow(false);
  // display the popup modal
  const handleShow = () => setShow(true);
  // check if all form data has been filled
  const isFormFilled = () => char_name && anime_name && ipfsImage && price;

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i className="bi bi-plus"></i>
      </Button>

        {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Anime NFT Gift Card</Modal.Title>
        </Modal.Header>
  
        <Modal.Body>
          <Form>
            <Form.Control
              type="text"
              className="mb-3"
              placeholder="Character Name"
              style={{ height: "45px" }}
              onChange={(e) => {
                setCharName(e.target.value);
              }}
            />
            
            <Form.Control
              type="text"
              className="mb-3"
              placeholder="Anime Name"
              style={{ height: "45px" }}
              onChange={(e) => {
                setAnimeName(e.target.value);
              }}
            />
  
            <Form.Control
              type="number"
              placeholder="Price"
              style={{ height: "45px" }}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />

            <Form.Control
              type="file"
              className="my-3"
              placeholder="Upload Image"
              onChange={async (e) => {
                console.log(e)
                const imageUrl = await uploadImage(e);
                console.log(`Image URL: ${imageUrl}`)
                if (!imageUrl) {
                  alert("failed to upload image");
                  return;
                }
                setIpfsImage(imageUrl);
              }}
            />
          </Form>
        </Modal.Body>
  
        <Modal.Footer>
          <Button variant="outline-dark" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                char_name,
                anime_name,
                ipfsImage,
                ownerAddress: address,
                price
              });
              handleClose();
            }}
          >
            Create NFT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddNfts.propTypes = {
  save: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};
  
export default AddNfts;