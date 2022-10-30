import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import { Row } from "react-bootstrap";
import { ethers } from "ethers";
import {
  getStoredNfts,
  createCardNft,
  removeCardNft,
  giftCardNft,
  buyCardNft,
  resellCardNft
} from "../../../utils/minter";

const NftList = ({ minterContract, name }) => {
  const { performActions, address } = useContractKit();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAnimeCards = useCallback(async () => {
    try {
      setLoading(true);
      const allNfts = await getStoredNfts(minterContract);
      if (!allNfts) return;
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [minterContract]);

  // function to add new nft to the nft lists
  // uses the data received from the Add.js component
  // 
  const addAnimeCard = async (data) => {
    try {
      setLoading(true);
      await createCardNft(minterContract, performActions, data);
      toast(<NotificationSuccess text="Updating NFT list...." />);

      getAnimeCards();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };

  const removeAnimeCard = async (data) => {
    try {
      setLoading(true);
      const { index } = data;
      await removeCardNft(minterContract, performActions, index);
      toast(<NotificationSuccess text="Updating NFT list...." />);

      getAnimeCards();
    } catch(error) {
      console.log(error);
      toast(<NotificationSuccess text="Failed to remove anime card from the market" />);
    }
  }

  // function to change the data of the nft stored
  // only the owner of the nft and the price can be changed
  // uses the data gotten from the Card.js component
  const updateAnimeCard = async(info) => {
    const {popup_data, data_name, index} = info;

    if(data_name.includes("Gift")) {
      try {
        await giftCardNft(minterContract, performActions, index, popup_data);
        getAnimeCards();
      } catch(error) { console.log(error) }
    }
    
    else if(data_name.includes("Resell")) {
      try {
        const price = ethers.utils.parseUnits(String(popup_data), "ether");
        await resellCardNft(minterContract, performActions, index, price)
        getAnimeCards();
      } catch(error) { console.log(error) }
    }
  }

  // funtion to buy nft
  // uses the token id(index) of the nft
  // to call the buyCardNft function imported
  // from the minter.js file
  const buyAnimeCard = async(token_id) => {
    const { index } = token_id
    await buyCardNft(minterContract, performActions, index)

    getAnimeCards();
  }
  
  useEffect(() => {
    try {
      if (address && minterContract) {
        getAnimeCards();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, address, getAnimeCards]);

  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">{ name }</h1>
              {address ? (
                <AddNfts save={ addAnimeCard } address={ address } />
              ) : null}
            </div>
            {nfts.length > 0 ? (
              <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
                {nfts.map((_nft) => (
                  <Nft
                    key={_nft.index}
                    nft={{
                      ..._nft,
                    }}
                    change_data={ updateAnimeCard }
                    buy={ buyAnimeCard }
                    remove_card={ removeAnimeCard }
                  />
                  ))}
                </Row>
              ) : (
                <p className="text-center my-5 fs-2">No uploaded anime card available</p>
              )}
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

NftList.propTypes = {
  minterContract: PropTypes.instanceOf(Object),
  updateBalance: PropTypes.func.isRequired,
};

NftList.defaultProps = {
  minterContract: null,
};

export default NftList;