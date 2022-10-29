# Anime Cards NFT Markeplace
<img src="https://th.bing.com/th/id/R.33c30ac91d8e7e9b1f5cbd235501bb71?rik=I8NVkX8I%2f7kcAw&pid=ImgRaw&r=0" width="600px" />
A marketplace for anime lovers to mint their animes into NFT and sell them. Users having connected their wallet to the platform can
1. Mint their uploaded anime image into an NFT
2. Buy, sell, resell, gift out and remove a particular NFT
3. Visit their profile to see all their owned NFT

DEMO: [Anime Cards](https://ozo-vehe.github.io/anime-cards/)

## 1. Tech Stack
This boilerplate uses the following tech stack:
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [use-Contractkit](contractkit
) - A frontend library for interacting with the Celo blockchain.
- [Hardhat](https://hardhat.org/) - A tool for writing and deploying smart contracts.
- [Bootstrap](https://getbootstrap.com/) - A CSS framework that provides responsive, mobile-first layouts.

## 2. Quick Start

To get this project up running locally, follow these simple steps:

### 2.1 Clone the repository:

```bash
git clone https://github.com/dacadeorg/celo-react-boilerplate.git
```

### 2.2 Navigate to the directory:

```bash
cd anime-cards
```

### 2.3 Install the dependencies:

```bash
npm install
```

### 2.4 Run the dapp:

```bash
npm start
```

To properly test the dapp you will need to have a Celo wallet with testnet tokens.
This learning module [NFT Contract Development with Hardhat](https://hackmd.io/exuZTH2hTqKytn2vxgDmcg) will walk you through the process of creating a Metamask wallet and claiming Alfajores testnet tokens.


## 3. Smart-Contract Deployment

You can use your own smart contract that the dapp will interact with by following the steps below:

### 3.1 Update env file

- Create a file in the root directory called ".env"
- Create a key called MNEMONIC and paste in your mnemonic key. e.g

```js
MNEMONIC = "***** ***** ***** ***** *****";
```

In this case, we are using a mnemonic from an account created on Metamask. You can copy it from your Metamask account settings. An account created on the Celo extension wallet will not work.

You can find more details about the whole process in the Dacade [NFT Contract Development with Hardhat](https://hackmd.io/exuZTH2hTqKytn2vxgDmcg) learning module. It will also show you how to get testnet tokens for your account so you can deploy your smart contract in the next step.

### 3.2 Deploy the smart contract to the Celo testnet Aljafores

```bash
npx hardhat run --network alfajores scripts/deploy.js
```

This command will update the src/contract files with the deployed smart contract ABI and contract address.
   
<!-- CONTRIBUTING -->

## :writing_hand: Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any
contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also
simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your new feature branch (`git checkout -b feature/new_feature`)
3. Commit your changes (`git commit -m 'icluded a new feature(s)'`)
4. Push to the branch (`git push origin feature/new_feature`)
5. Open a pull request


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

#  Thank you
