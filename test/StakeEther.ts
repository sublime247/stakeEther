import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
// import { StakeEther__factory } from "../typechain-types";

describe("StakeEther", function () {

  async function deployStakeEther() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const contractFactory = await hre.ethers.getContractFactory("StakeEther")
    const stakeEther = await contractFactory.deploy();
    return { stakeEther, owner, otherAccount }
  }

  describe("Staking", function () {
    it("Should deposit successfully", async function () {

      const { stakeEther, owner } = await loadFixture(deployStakeEther);
      
      const trfAmount = ethers.parseEther("10",);
      
      expect(await stakeEther.stakeEther(0, { value: trfAmount }))
        .to.emit(stakeEther, "Deposited")
        .withArgs(owner.address, 0, trfAmount);

      const user = await stakeEther.users(owner.address);
      expect(user.balance).to.equal(trfAmount);
      expect(user.hasStaked).to.equal(true);
      expect(user.duration).to.equal(0);
    });


    it("Should not allow staking twice", async function () {
      
      const { stakeEther, } = await loadFixture(deployStakeEther);
      const trfAmount = ethers.parseEther("10",);

      await expect(stakeEther.stakeEther(0, { value: trfAmount }));

      await expect(stakeEther.stakeEther(0, { value: trfAmount })).to.be.revertedWith("You can't stake twice");
      

    });
    it("Should not allow invalid duration", async function () {
      const { stakeEther, } = await loadFixture(deployStakeEther);
      const trfAmount = ethers.parseEther("10",);
      // const duration = 4;
      await expect(stakeEther.stakeEther(4, { value: trfAmount }));
      await expect(stakeEther.stakeEther(4, { value: trfAmount })).to.be.revertedWith("Invalid Duration Enum Value");

    });
  });



  describe("withdrawStaking", function () {
    it("Should check if user has a Stake", async function () {
      const { stakeEther, owner } = await loadFixture(deployStakeEther);
      const trfAmount = ethers.parseEther("10",);
      // Attempting to withdraw without staking first
      await expect(stakeEther.withdrawStaking())
        .to.be.revertedWith("You have no stake");

    });
    it("Should check Duration has not reached", async function () {
      const { stakeEther, owner } = await loadFixture(deployStakeEther);
      const trfAmount = ethers.parseEther("10",);
      await expect(stakeEther.stakeEther(0, { value: trfAmount }));
      // Attempting to withdraw without staking first
      await expect(stakeEther.withdrawStaking())
        .to.be.revertedWith("You have no stake");

    });


    // it("Should check if Duration has reached", async function () {
    //   const { stakeEther, owner } = await loadFixture(deployStakeEther);
    //   const trfAmount = ethers.parseEther("5",);
    //   await stakeEther.stakeEther(0, { value: trfAmount });
    //   await time.increase(30 * 24 * 60 * 60);
    //   await expect(stakeEther.withdrawStaking())
    //     .to.emit(stakeEther, "withdrawal successful!")
    //     .withArgs(owner.address, trfAmount);
    //     const user = await stakeEther.users(owner.address);
    //   expect(user.balance).to.equal(0);
    //   expect(user.hasStaked).to.equal(false);

    // });


})
});
