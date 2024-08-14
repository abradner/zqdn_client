export interface Grid {
  seed: number;
  size: number;
  sub_grids: number[];
  matrix: number[][];
}

export interface GridGameResponse {
  seed: number;
  size: number;
  solution: boolean;
  grid: Grid;
}
