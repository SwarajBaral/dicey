export class Player {
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
  