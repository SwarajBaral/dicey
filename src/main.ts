import PromptSync from "prompt-sync";
class Player {
  public name: string;
  public points: number;
  public rank: number;
  public lastRoll: number;
  public isPenalised: boolean;
  public sixRolls: number;

  constructor(name: string) {
    this.name = name;
    this.points = 0;
    this.rank = Number.POSITIVE_INFINITY;
    this.lastRoll = 0;
    this.isPenalised = false;
    this.sixRolls = 0;
  }
}

class GameOfDice {
  private players: Player[];
  private currentPlayerIndex: number;
  private readonly targetPoints: number;
  private rank: number;

  constructor(numPlayers: number, targetPoints: number) {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.targetPoints = targetPoints;
    this.rank = 1;

    for (let i = 1; i <= numPlayers; i++) {
      const playerName = `Player-${i}`;
      this.players.push(new Player(playerName));
    }
    this.shufflePlayers();
  }

  private shufflePlayers() {
    for (let i = this.players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
    }
  }

  private rollDice(player: Player): void {
    const roll = Math.floor(Math.random() * 6) + 1;
    console.log(`${player.name} rolled a ${roll}.`);
    player.points += roll;
    if(roll === 1 && player.lastRoll === 1)
    {
      console.log(`${player.name} rolled '1' twice consecutively. Skipping next turn.`);
      player.isPenalised = true;
    }
    if(roll === 6 && player.sixRolls < 3)
    {
      console.log(`${player.name} gets another chance!`);
      player.sixRolls++;
      this.rollDice(player);
    }
    return;
  }

  private getNextPlayer(): Player {
    const currentPlayer = this.players[this.currentPlayerIndex];
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    return currentPlayer;
  }

  private updateRank(): void {
    this.players.sort((a, b) => a.rank - b.rank);
  }

  private printRankTable(): void {
    console.log('Current Rank Table:');
    console.log('--------------------------------');
    console.log('Name\t\tPoints\tRank');
    console.log('--------------------------------');
    this.players.forEach(player => {
      console.log(`${player.name}\t${player.points}\t${player.rank}`);
    });
    console.log('--------------------------------');
  }

  public playGame(): void {
    try
    {
      
      let gameEnded = false;
  
      while (!gameEnded) {
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
  
        console.log(`${currentPlayer.name}, it's your turn (press 'r' to roll the dice):`);
  
        this.rollDice(currentPlayer);
  
        if (currentPlayer.points >= this.targetPoints) {
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

// Usage example:
const numPlayers = 3;
const targetPoints = 10;

const game = new GameOfDice(numPlayers, targetPoints);
game.playGame();
