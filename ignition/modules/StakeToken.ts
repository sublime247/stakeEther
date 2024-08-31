import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as dotenv from "dotenv";
dotenv.config();

const tokenAddress = "0xfF5b7C7bf1D5BbAB46C9F553b82cdBe6F5Bfb4D9"
const StakeTokenModule = buildModule("StakeTokenModule", (m) => {

  const stakeToken = m.contract("StakeToken", [tokenAddress]);

  return { stakeToken };
});

export default StakeTokenModule;

// Deployed contract address
// 0xd3f137bea0585FB5003B3425E340FCe4503448ea


