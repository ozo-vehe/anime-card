import React from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import Video from "../Video"
import src from "../../assets/production ID-4711694.mp4"

const Cover = ({ name, connect }) => {
  if (name) {
    return (
      <div className="bg_image">
        <Video src={src} />
        <div
          className="bg_text text-light position-absolute start-0 top-0 h-100 d-flex justify-content-center align-items-center"
        >
          <div className="px-5 text-start">
            <h1>Welcome to My Anime World</h1>
            <p>
              Anime NFT taken to a different level, with awesome NFTs
              available for sale, easy minting of NFTs and other amazing
              features to explore. Connect your wallet below to begin your
              journey into the world of anime NFTs
            </p>
            <Button
              onClick={() => connect().catch((e) => console.log(e))}
              variant="outline-light"
              className="px-3 mt-4"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

Cover.propTypes = {
  name: PropTypes.string,
};

Cover.defaultProps = {
  name: "",
};

export default Cover;
