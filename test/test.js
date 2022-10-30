const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AnimeCard", function () {
  this.timeout(50000);

  let myNFT;
  let owner;
  let acc1;
  let acc2;
  
	const price = ethers.utils.parseUnits("1");

  this.beforeEach(async () => {
    // This is executed before each test
    // Deploying the smart contract
    const AnimeCard = await ethers.getContractFactory("AnimeCard");
    [owner, acc1, acc2] = await ethers.getSigners();

    myNFT = await AnimeCard.deploy();
  });

  // First Test
  it("Should mint an anime card", async () => {
    expect(await myNFT.balanceOf(acc1.address)).to.equal(0);

    const tokenURI = "https://example.com/1";
    const tx = await myNFT.connect(owner).uploadCardDetails(tokenURI, price);
    await tx.wait();

    expect(await myNFT.totalSupply()).to.equal(1);
  });

  // Second Test
  it("Should set the correct tokenURI of an anime card", async () => {
    const tokenURI_1 = "https://example.com/1";

    const tx1 = await myNFT.connect(owner).uploadCardDetails(tokenURI_1, price);
    await tx1.wait();

    expect(await myNFT.tokenURI(0)).to.equal(tokenURI_1);
  });

  // Third Test
  it("Should mint an anime card to the correct owner", async () => {
    const tokenURI_1 = "https://example.com/1";

    const tx1 = await myNFT.connect(owner).uploadCardDetails(tokenURI_1, price);
    await tx1.wait();

    expect(await myNFT.ownerOf(0)).to.equal(owner.address);
  });

  // Fourth Test
  it("should upload and read a value from an anime card", async () => {
    const tokenURI_1 = "https://example.com/1";

    const upload = await myNFT.connect(owner).uploadCardDetails(tokenURI_1, price);
    await upload.wait();

    const readNFT = await myNFT.readAnimeCard(0);
    expect(readNFT[2]).to.equal(false);
    expect(price.eq(readNFT[1])).to.equal(true);
  })

  // Fifth Test
  it("Should gift an anime card to another user", async () => {
    const tokenURI = "https://example.com/1";

    const upload = await myNFT.connect(owner).uploadCardDetails(tokenURI, price);
    await upload.wait();

    await myNFT.giftAnimeCard(0, acc2.address);

    expect(await myNFT.ownerOf(0)).to.equal(acc2.address);
  })
});
