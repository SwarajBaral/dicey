import { expect } from "chai"
import Sinon from "sinon";
import { Player } from "../src/player";
import { Dicey } from "../src/game";

describe("Unit tests for dice roll", () =>
{
    var sandbox: Sinon.SinonSandbox;

    beforeEach(() =>
    {
        sandbox = Sinon.createSandbox();
    })

    afterEach(() =>
    {
        sandbox.restore();
    })

    it("Should roll dice and add points to the player's existing points", () =>
    {
        // Arrange
        const dummyPlayer = new Player("Dummy player");
        const dummyGame = new Dicey(4, 40);
        dummyPlayer.points = 5;
        sandbox.stub(Math, "floor").returns(4); // Player will roll 4 + 1
        
        // Act
        dummyGame.rollDice(dummyPlayer);

        // Assert
        expect(dummyPlayer.points).to.be.equal(10);
    })

    it("Should penalise player if two consecutive one roll occurs", () =>
    {
        // Arrange
        const dummyPlayer = new Player("Dummy player");
        const dummyGame = new Dicey(4, 40);
        dummyPlayer.points = 5;
        dummyPlayer.lastRoll = 1 // Simulating first roll as 1
        sandbox.stub(Math, "floor").returns(0); // Player will roll 0 + 1
        
        // Act
        dummyGame.rollDice(dummyPlayer);

        // Assert
        expect(dummyPlayer.isPenalised).to.be.equal(true);
    })

    it("Should reward player with extra turn if a six roll occurs", () =>
    {
        // Arrange
        const dummyPlayer = new Player("Dummy player");
        const dummyGame = new Dicey(4, 40);
        dummyPlayer.points = 5;
        sandbox.stub(Math, "floor")
                .onFirstCall()
                .returns(5)
                .onSecondCall()
                .returns(1); // Player will roll 6 first, then 2
        
        // Act
        dummyGame.rollDice(dummyPlayer);

        // Assert
        expect(dummyPlayer.sixRolls).to.be.greaterThan(0);
        expect(dummyPlayer.points).to.be.equal(13);
    })

    it("Should limit the extra turns awarded on every six rolls to 2", () =>
    {
        // Arrange
        const dummyPlayer = new Player("Dummy player");
        const dummyGame = new Dicey(4, 40);
        dummyPlayer.points = 5;
        sandbox.stub(Math, "floor").returns(5); // Player will roll 5 + 1
        
        // Act
        dummyGame.rollDice(dummyPlayer);

        // Assert
        expect(dummyPlayer.sixRolls).to.be.equal(2);
        expect(dummyPlayer.points).to.be.equal(23);
    })
})