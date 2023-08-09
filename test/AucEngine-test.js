const { expect } = require("chai")
const { ethers } = require("hardhat")

describe ("AucEngine", function () {
    let owner
    let seller
    let buyer
    let auct

    beforeEach(async function (){
        [seller, owner, buyer] = await ethers.getSigners()

        const AucEngine = await ethers.getContractFactory("AucEngine", owner)
        auct = await AucEngine.deploy()
        await auct.waitForDeployment()
    })

    it("sets owner", async function() {
        const currentOwner = await auct.owner()
        expect(currentOwner).to.eq(owner.address)
    })

    async function getTimestamp(bn) {
        return(
            await ethers.provider.getBlock(bn)
        ).timestamp
    }

    describe("createAuction", function() {
        it("creates auction correctly", async function() {
            const duration = 60
            const tx = await auct.createAuction(
                ethers.parseEther("0.0001"),
                3,
                "fake item",
                duration
            )

            const cAuction = await auct.auctions(0)
            expect(cAuction.item).to.eq("fake item")
            console.log(tx)
            const ts = await getTimestamp(tx.blockNumber)
            expect(cAuction.endsAt).to.eq(ts+duration)

            await expect(tx)
            .to.emit(auct, 'AuctionCreated')
            .withArgs(0, "fake item", ethers.parseEther("0.0001"), duration)
        })
    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    describe("buy", function() {
        it("allows to buy", async function() {
            const duration = 60
            const tx = await auct.connect(seller).createAuction(
                ethers.parseEther("0.0001"),
                3,
                "fake item",
                duration
            )
            this.timeout(5000)//5s
            await delay(1000)

            const buyTx = await auct.connect(buyer).
                buy(0, {value: ethers.parseEther("0.0001")})

            const cAuction = await auct.auctions(0)
            const finalPrice = cAuction.finalPrice
            await expect(() => buyTx).
                to.changeEtherBalance(
                seller, finalPrice - BigInt(Math.trunc((Number(finalPrice) * 10) / 100))
                )
            
            await expect(buyTx)
                .to.emit(auct, 'AuctionEnded')
                .withArgs(0, finalPrice, buyer.address)

            await expect(
                auct.connect(buyer).
                    buy(0, {value: ethers.parseEther("0.0001")})
            ).to.be.revertedWith("stopped!")
        })

    })
    
    })
})