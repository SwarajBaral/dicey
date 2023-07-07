import { Dicey } from "./game";

if(process.argv.length < 4)
{
	console.log("Can't start game without number of players and target points.\nUsage node main.ts <num-of-players> <target-points> !");
	process.exit(0);
}

const numPlayers = Number(process.argv[2]);
const targetPoints = Number(process.argv[3]);

const game = new Dicey(numPlayers, targetPoints);

game.playGame();