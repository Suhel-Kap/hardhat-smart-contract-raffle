import { DeployFunction } from "hardhat-deploy/types"
import { ethers, network } from "hardhat"
import "dotenv/config"
import * as fs from "fs"

const FRONT_END_CONTRACT_ADDRESSES_FILE =
    "../nextjs-smartcontract-raffle/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../nextjs-smartcontract-raffle/constants/abi.json"

const updateFrontEnd: DeployFunction = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end")
        updateContractAddress()
        updateAbi()
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(
        FRONT_END_ABI_FILE,
        raffle.interface.format(ethers.utils.FormatTypes.json) as string
    )
}

async function updateContractAddress() {
    const raffle = await ethers.getContract("Raffle")
    const currentAddress = JSON.parse(fs.readFileSync(FRONT_END_CONTRACT_ADDRESSES_FILE, "utf-8"))
    const chainId = network.config.chainId!.toString()
    if (chainId in currentAddress) {
        if (!currentAddress[chainId].includes(raffle.address)) {
            currentAddress[chainId].push(raffle.address)
        }
    } else {
        currentAddress[chainId] = [raffle.address]
    }
    fs.writeFileSync(FRONT_END_CONTRACT_ADDRESSES_FILE, JSON.stringify(currentAddress))
}

export default updateFrontEnd
updateFrontEnd.tags = ["all", "frontend"]
