import React, { useEffect, useState, useCallback } from "react";
import { Row } from "react-bootstrap";
import { getStoredNfts, buyCardNft, removeCardNft, resellCardNft, giftCardNft } from "../../utils/minter";
import { truncateAddress } from "../../utils";
import Identicon from "../ui/Identicon";
import Nft from "../minter/nfts/Card";
import { useMinterContract } from "../../hooks";
import { useContractKit } from "@celo-tools/use-contractkit";
import { NotificationSuccess } from "../ui/Notifications";
import { toast } from "react-toastify";
import { ethers } from "ethers";

export default function Profile ({ show_btn }) {
    // initialize the NFT mint contract
  const minterContract = useMinterContract();
  const { kit, performActions } = useContractKit();
  const { defaultAccount } = kit;
  const [nfts, setNfts] = useState([]);
  
  const getAnimeCards = useCallback(async () => {
    try {
      // fetch all nfts from the smart contract
      const allNfts = await getStoredNfts(minterContract);
      
      // filter through the nfts to get the nfts owned by the current user
      const ownedAnimeCards = allNfts.filter((nft) => {
        return nft.owner === defaultAccount
      })

      if (!ownedAnimeCards) return;
      setNfts(ownedAnimeCards);
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, defaultAccount]);

  const removeAnimeCard = async (data) => {
    try {
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
    console.log(info)

    if(data_name.includes("Gift")) {
      console.log(info)
      try {
        await giftCardNft(minterContract, performActions, index, popup_data);
        getAnimeCards();
      } catch(error) { console.log(error) }
    }
    
    else if(data_name.inlcudes("Resell")) {
      console.log(info)
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
      if (defaultAccount && minterContract) {
        getAnimeCards();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, defaultAccount, getAnimeCards]);
  
  return (
    <>
      <div className="profile">
        <div className="profile_header d-flex g-10 justify-content-center align-items-center mb-5">
          <Identicon address={defaultAccount} size={120} className="mb-2"/>
          <h3>{truncateAddress(defaultAccount)}</h3>
        </div>

        <div className="profile_details">
          <h3>Owned NFTs</h3>

          <Row xs={1} sm={2} lg={3} className="g-3 my-5 g-xl-4 g-xxl-5">
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
        </div>
      </div>
    </>
  )
}