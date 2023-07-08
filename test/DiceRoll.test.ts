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
        sandbox.stub(Math, "floor")
                .onFirstCall()
                .returns(0)
                .onSecondCall()
                .returns(0); // Player will roll 1 on both tries
        
        
        // Act
        dummyGame.rollDice(dummyPlayer); // First roll
        dummyGame.rollDice(dummyPlayer); // Second roll


        // Assert
        expect(dummyPlayer.isPenalised).to.be.equal(true);
        expect(dummyPlayer.points).to.be.equal(7);
        expect(dummyPlayer.lastRoll).to.be.equal(1);
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
        sandbox.stub(Math, "floor").returns(5); // Player will roll 6 for 3 times
        
        // Act
        dummyGame.rollDice(dummyPlayer);

        // Assert
        expect(dummyPlayer.sixRolls).to.be.equal(2);
        expect(dummyPlayer.points).to.be.equal(23);
    })
})