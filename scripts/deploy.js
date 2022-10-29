const hre = require("hardhat");

async function main() {
  const AnimeCard = await hre.ethers.getContractFactory("AnimeCard");
  const myNFT = await AnimeCard.deploy();

  await myNFT.deployed();

  console.log("AnimeCard deployed to:", myNFT.address);
  storeContractData(myNFT);
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/AnimeCard-address.json",
    JSON.stringify({ AnimeCard: contract.address }, undefined, 2)
  );

  const AnimeCardArtifact = artifacts.readArtifactSync("AnimeCard");

  fs.writeFileSync(
    contractsDir + "/AnimeCard.json",
    JSON.stringify(AnimeCardArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });