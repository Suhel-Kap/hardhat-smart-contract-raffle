import { ethers } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains } from "../helper-hardhat-config";

const BASE_FEE = ethers.utils.parseEther("0.25"); // 0.25 is the premium
const GAS_PRICE_LINK = 1e9;

const deployMocks: DeployFunction = async function ({
    getNamedAccounts,
    deployments,
    network,
}) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId: number = network.config.chainId!;
    const args = [BASE_FEE, GAS_PRICE_LINK];

    if (developmentChains.includes(network.name)) {
        console.log("Local network detected! Deploying mocks...");
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        });
        log("Mocks deployed...");
        log("---------------------------------------------");
    }
};

export default deployMocks;
deployMocks.tags = ["all", "mocks"];
