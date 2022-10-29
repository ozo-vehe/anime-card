import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import axios from "axios";
import { ethers } from "ethers";

const getAccessToken = () => { return process.env.REACT_APP_STORAGE_API_KEY }
const makeStorageClient = () => { return new Web3Storage({ token: getAccessToken() }) }

const upload = (file) => {
  const client = makeStorageClient();
  const file_cid = client.put(file);

  return file_cid;
}

const makeFileObjects = (file, file_name) => {
  const blob = new Blob([JSON.stringify(file)], { type: "application/json" })
  const files = [new File([blob], `${file_name}.json`)]

  return files
}

// Function to trim the name of an anime card
// returning a new formatted name without whitespaces
// and replacing the whitespace between the name with %20
const trimName = (name) => {
  let t_name = name.trim();
  if(t_name.includes(" ")) {
    t_name = t_name.replaceAll(" ", "%20");
  }
  console.log(t_name);
  return t_name;
}

export const createCardNft = async (
  minterContract,
  performActions,
  { char_name, anime_name, ipfsImage, price }
) => {
  await performActions(async (kit) => {
    if (!char_name || !anime_name || !ipfsImage || !price) return;
    const { defaultAccount } = kit;
    
    // convert NFT metadata to JSON format
    const data = JSON.stringify({
      char_name,
      anime_name,
      image: ipfsImage
    });

    try {
      // save NFT metadata to IPFS
      const file_name = trimName(char_name);
      const files = makeFileObjects(data, char_name);
      const file_cid = await upload(files);

      const anime_price = ethers.utils.parseUnits(String(price), "ether");
      const url = `https://${file_cid}.ipfs.w3s.link/${file_name}.json`;

      // mint the NFT and save the IPFS url to the blockchain
      await minterContract.methods.uploadCardDetails(char_name, ipfsImage, anime_price).send({from: defaultAccount});
      let transaction = await minterContract.methods.safeMint(defaultAccount, url).send({ from: defaultAccount });

      return transaction;
    } catch (error) {
      console.log("Error: ", error);
    }
  });
};

export const uploadImage = async (e) => {
  const image = e.target.files;
  const image_name = image[0].name;

  if (!image) return;
  // Pack files into a CAR and send to web3.storage
  const cid = await upload(image) // Promise<CIDString>
  const image_url = `https://${cid}.ipfs.w3s.link/${image_name}`

  return image_url;
};

export const getStoredNfts = async (minterContract) => {
  try {
    const nft_arr = [];
    const stored_nfts_length = await minterContract.methods.totalSupply().call();
    for (let i = 0; i < Number(stored_nfts_length); i++) {
      const nft = new Promise(async (resolve) => {
        const token_uri = await minterContract.methods.tokenURI(i).call();
        const nft_data = await fetchNftData(token_uri);
        const owner = await minterContract.methods.ownerOf(i).call();
        const anime_card = await minterContract.methods.readAnimeCard(i).call();

        resolve({
          index: i,
          owner,
          char_name: nft_data.char_name,
          image: nft_data.image,
          anime_name: nft_data.anime_name,
          price: anime_card[4],
          sold: anime_card[5],
          available: anime_card[6]
        });
      });
      nft_arr.push(nft);
    }
    return Promise.all(nft_arr);
  } catch (e) {
    console.log({ e });
  }
};

export const fetchNftData = async (ipfsUrl) => {
  try {
    if (!ipfsUrl) return null;
    const nft_data = await axios.get(ipfsUrl);
    const data = JSON.parse(nft_data.data)

    return data;
  } catch (e) {
    console.log({ e });
  }
};

export const removeCardNft = async (minterContract, performActions, token_id) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit
      await minterContract.methods
      .removeFromMarket(token_id)
      .send({ from: defaultAccount })
    })
  }
  catch(error) {
    console.log(error)
  }
}

export const giftCardNft = async (minterContract, performActions, token_id, address) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit
      await minterContract.methods
      .giftAnimeCard(token_id, address)
      .send({ from: defaultAccount });
    })
  }
  catch(err) {
    console.log(err)
  }
};

export const buyCardNft = async (minterContract, performActions, token_id) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit
      const anime_card = await minterContract.methods.readAnimeCard(token_id).call();
      await minterContract.methods
      .buyAnimeCard(token_id)
      .send({ from: defaultAccount, value: anime_card[4] });
    })
  }
  catch(err) {
    console.log(err)
  }
};

export const resellCardNft = async (minterContract, performActions, token_id, new_price,) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit
      await minterContract.methods
      .resellAnimeCard(token_id, new_price)
      .send({ from: defaultAccount });
    })
  }
  catch(err) {
    console.log(err)
  }
};