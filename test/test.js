const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AnimeCard", function () {
  this.timeout(50000);

  let myNFT;
  let owner;
  let acc1;
  let acc2;

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
    const tx = await myNFT.connect(owner).safeMint(acc1.address, tokenURI);
    await tx.wait();

    expect(await myNFT.totalSupply()).to.equal(1);
  });

  // Second Test
  it("Should set the correct tokenURI of an anime card", async () => {
    const tokenURI_1 = "https://example.com/1";

    const tx1 = await myNFT.connect(owner).safeMint(acc1.address, tokenURI_1);
    await tx1.wait();

    expect(await myNFT.tokenURI(0)).to.equal(tokenURI_1);
  });

  // Third Test
  it("Should mint an anime card to the correct owner", async () => {
    const tokenURI_1 = "https://example.com/1";

    const tx1 = await myNFT.connect(owner).safeMint(acc1.address, tokenURI_1);
    await tx1.wait();

    expect(await myNFT.ownerOf(0)).to.equal(acc1.address);
  });

  // Fourth Test
  it("should upload and read a value from an anime card", async () => {
    const image = "luffy.jpg";
    const char_name = "Luffy";
    const price = 2;

    const upload = await myNFT.connect(owner).uploadCardDetails(char_name, image, price);
    await upload.wait();

    const readNFT = await myNFT.readAnimeCard(0);

    expect(readNFT[1]).to.equal(char_name);
  })

  // Fifth Test
  it("Should gift an anime card to another user", async () => {
    const image = "luffy.jpg";
    const char_name = "Luffy";
    const price = 2;
    const tokenURI = "https://example.com/1";

    const upload = await myNFT.connect(owner).uploadCardDetails(char_name, image, price);
    await upload.wait();

    const tx = await myNFT.connect(owner).safeMint(owner.address, tokenURI);
    await tx.wait();

    await myNFT.giftAnimeCard(0, acc2.address);

    expect(await myNFT.ownerOf(0)).to.equal(acc2.address);
  })
});