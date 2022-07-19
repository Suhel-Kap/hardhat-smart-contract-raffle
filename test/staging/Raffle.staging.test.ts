import chai, { assert, expect } from "chai"
import { network, getNamedAccounts, deployments, ethers } from "hardhat"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { Raffle } from "../../typechain-types"
import { solidity } from "ethereum-waffle"
import { BigNumber } from "ethers"
chai.use(solidity)

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", async () => {
          let deployer: any, raffle: Raffle, raffleEntranceFee: BigNumber
          const chainId = network.config.chainId!

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", () => {
              it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
                  // enter raffle
                  const startingTimeStamp = await raffle.getLastTimeStamp()
                  const accounts = await ethers.getSigners()
                  let winnerStartBalance: BigNumber

                  await new Promise<void>(async (resolve, reject) => {
                      // setup listener before we enter the raffle
                      // just in case the blockchain moves really fast
                      raffle.once("WinnerPicked", async () => {
                          console.log("Winne picked event fired!")

                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLastTimeStamp()

                              // to check if players array has been reset
                              await expect(raffle.getPlayers(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, 0)
                              assert.equal(
                                  winnerEndBalance.toString(),
                                  winnerStartBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })
                      // then enter the raffle
                      await raffle.enterRaffle({ value: raffleEntranceFee })
                      winnerStartBalance = await accounts[0].getBalance()
                  })
              })
          })
      })
