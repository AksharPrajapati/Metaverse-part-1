const Land = artifacts.require("./Land");

require("chai").use(require("chai-as-promised")).should();

contract("LAND", ([owner1, owner2]) => {
  const NAME = "Test Name";
  const SYMBOL = "TEST";
  const COST = web3.utils.toWei("1", "ether");

  let land, result;

  beforeEach(async () => {
    land = await Land.new(NAME, SYMBOL, COST);
  });

  describe("Deployment", () => {
    it("Return Cotract Name", async () => {
      result = await land.name();
      result.should.equal(NAME);
    });

    it("Return a cost to mint", async () => {
      result = await land.cost();
      result.toString().should.equal(COST);
    });

    it("Return the max supply", async () => {
      result = await land.maxSupply();
      result.toString().should.equal("5");
    });
  });

  describe("Minting", () => {
    describe("Success", () => {
      beforeEach(async () => {
        result = await land.mint(1, { from: owner1, value: COST });
      });

      it("Update Owner Address", async () => {
        result = await land.ownerOf(1);
        result.should.equal(owner1);
      });
    });
  });
});
