import { ethers } from "hardhat"

export interface networkConfigItem {
    name?: string
    vrfCoordinatorV2?: string
    raffleEntranceFee?: string
    gasLane?: string
    subscriptionId?: string
    callbackGasLimit?: string
    interval?: string
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    4: {
        name: "rinkeby",
        vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        raffleEntranceFee: ethers.utils.parseEther("0.1").toString(),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        subscriptionId: "8757",
        callbackGasLimit: "500000", // 500,000
        interval: "30",
    },
    31337: {
        name: "hardhat",
        raffleEntranceFee: ethers.utils.parseEther("0.1").toString(),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        callbackGasLimit: "500000", // 500,000
        interval: "30",
    },
}

export const VERIFICATION_BLOCK_CONFIRMATIONS = 6
export const developmentChains = ["hardhat", "localhost"]
