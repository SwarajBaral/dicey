import PromptSync from "prompt-sync";
import { Player } from "./player";

var MAX_EXTRA_ATTEMPTS = 2
export class Dicey
{
	private players: Player[];
	private currentPlayerIndex: number;
	private readonly targetPoints: number;
	private rank: number;
	private prompt: PromptSync.Prompt;
	
	constructor(numPlayers: number, targetPoints: number)
	{
		this.players = [];
		this.currentPlayerIndex = 0;
		this.targetPoints = targetPoints;
		this.rank = 1;
		this.prompt = PromptSync();

		for (let i = 1; i <= numPlayers; i++)
		{
			const playerName = `Player-${i}`;
			this.players.push(new Player(playerName));
		}
		this.shufflePlayers();
	}

	/**
	 * @description Randomly shuffles players before the start of the game
	 * @param NULL
	 * @returns void
	 */
	private shufflePlayers()
	{
		for (let i = this.players.length - 1; i > 0; i--)
		{
			const j = Math.floor(Math.random() * (i + 1));
			[this.players[i], this.players[j]] = [this.players[j], this.players[i]];
		}
	}

	/**
	 * @description Rolls dice and generates random points on each roll. Penalises player if two consecutive one rolls and rewards with extra turn on six rolls.
	 * @param {Player} player
	 * @returns void
	 */
	public rollDice(player: Player): void
	{
		const roll = Math.floor(Math.random() * 6) + 1;
		console.log(`${player.name} rolled a ${roll}.`);
		player.points += roll;

		if(roll === 1 && player.lastRoll === 1)
		{
			console.log(`${player.name} rolled '1' twice consecutively. Skipping next turn.`);
			player.isPenalised = true;
		}

		player.lastRoll = roll;

		if(roll === 6 && player.sixRolls < MAX_EXTRA_ATTEMPTS)
		{
			console.log(`${player.name} gets another chance!`);
			player.sixRolls++;
			this.rollDice(player);
		}

		return;
	}

	/**
	 * @description Returns the next player from the list of current players.
	 * @param NULL
	 * @returns {Player} next player
	 */
	private getNextPlayer(): Player
	{
		const currentPlayer = this.players[this.currentPlayerIndex];
		this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
		return currentPlayer;
	}

	/**
	 * @description Updates rank on the basis of who completed the game first.
	 * @param NULL
	 * @returns void
	 */
	private updateRank(): void
	{
		this.players.sort((a, b) => a.rank - b.rank);
	}

	/**
	 * @description Prints the game table after each iteration of a dice throw.
	 * @param NULL
	 * @returns void
	 */
	private printRankTable(): void
	{
		console.log('Current Rank Table:');
		console.log('--------------------------------');
		console.log('Name\t\tPoints\tRank');
		console.log('--------------------------------');
		this.players.forEach(player =>
			{
			console.log(`${player.name}\t${player.points}\t${player.rank}`);
		});
		console.log('--------------------------------');
	}

	/**
	 * @description Starts the game and continues until gameEnded = true.
	 * @param NULL
	 * @returns void
	 */
	public playGame(): void
	{
		try
		{
			let gameEnded = false;
	
			while (!gameEnded)
			{
				const currentPlayer = this.getNextPlayer();

				if(currentPlayer.points >= this.targetPoints)
				{
					continue;
				}
	
				if(currentPlayer.isPenalised)
				{
					console.log(`${currentPlayer.name} was penalized last round. Skipping turn.`)
					continue;
				}

				let keyPress = null;

				while(keyPress !== "r")
				{
					keyPress = this.prompt(`${currentPlayer.name}, it's your turn (press 'r' to roll the dice, press 'z' to exit):`);
					if(keyPress === 'z')
					{
						console.log("You quit the game. Bye !")
						process.exit(0);
					}
					if(keyPress !== "r")
					{
						console.log("Oops, you did not press 'r' !!!");
					}
				}

				this.rollDice(currentPlayer);

				if(currentPlayer.sixRolls === MAX_EXTRA_ATTEMPTS)
				{
					currentPlayer.sixRolls = 0;
				}
	
				if (currentPlayer.points >= this.targetPoints)
				{
					currentPlayer.rank = this.rank;
					this.rank += 1;
					console.log(`${currentPlayer.name} has completed the game and secured rank ${currentPlayer.rank}!`);
				}
	
				this.updateRank();
				this.printRankTable();
	
				gameEnded = this.players.every(player => player.points >= this.targetPoints);
			}
		}
		catch(error)
		{
			throw error;
		}
	}
}