import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MTKModule = buildModule("MTKModule", (m) => {

  const MTKToken = m.contract("MTK");

  return { MTKToken  };
});

export default MTKModule;
