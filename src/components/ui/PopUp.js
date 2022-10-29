import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form } from "react-bootstrap";

const PopUp = ({ data, data_name }) => {
  const [show, setShow] = useState(false);
  const [popup_data, setPopupData] = useState("");

  // check if all form popup_data has been filled
  const isFormFilled = () => popup_data
  
  // close the popup modal
  const handleClose = () => setShow(false);;
    // display the popup modal
  const handleShow = () => setShow(true);

  const header_name = () => {
    if (data_name.includes("Resell")) return "Resell";
    else if(data_name.includes("Gift")) return "Gift";
  }

  return (
    <>
      <Button
        onClick={handleShow}
        variant="outline-dark"
        style={{ minWidth: "70px"}}
      >
        {data_name}
      </Button>

        {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{header_name()} Anime Card</Modal.Title>
        </Modal.Header>
  
        <Modal.Body>
          <Form>
            <Form.Control
              type="text"
              placeholder={header_name()}
              style={{ height: "45px" }}
              onChange={(e) => {
                setPopupData(e.target.value);
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
              const data_name = header_name()
              data({
                popup_data,
                data_name
              });
              handleClose();
            }}
          >
            {header_name()} NFT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

PopUp.propTypes = {
  data: PropTypes.func.isRequired,
  data_name: PropTypes.string.isRequired,
};
  
export default PopUp;