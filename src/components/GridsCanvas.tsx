import {DisplayGrid} from './DisplayGrid'
import {PuzzleGrid} from './PuzzleGrid'
import {AbsoluteInt, toAbsoluteInt} from "../types/AbsoluteInt.ts";

export type GridMode = "place" | "reveal";

type BaseGrid = {
  key: number;
  mode: GridMode;
};

export type DisplayGrid = BaseGrid & {
  values: Array<AbsoluteInt>;
  mode: "reveal";
};

export type PuzzleGrid = BaseGrid & {
  selectionSize: AbsoluteInt;
  mode: "place";
};

const gridSize = 6;

export type GridType = DisplayGrid | PuzzleGrid;

type GridList = Array<GridType>;

const gridList: GridList = [
  [
    1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35, 36,
  ],
  1, 1, 2, 2, 3, 3, 4,
].map((gridData, i) => {

  if (typeof gridData === "number") { // PuzzleGrid
    const constrainedGrid: PuzzleGrid = {
      key: i,
      mode: "place",
      selectionSize: toAbsoluteInt(gridData),
    }
    return constrainedGrid;

  } else if (typeof gridData === "object" && typeof gridData[0] === "number") { // DisplayGrid
    const constrainedGrid: DisplayGrid = {
      key: i,
      mode: "reveal",
      values: gridData.map(toAbsoluteInt),
    }
    return constrainedGrid;
  } else {
    throw new Error(`Invalid grid at index ${i}`);
  }
});

function GridsCanvas() {

  return (
    <>
      <div>
        <h3>Grid Canvas</h3>
        {gridList.map((gridData) => (gridData.mode === "place" ? (
            <PuzzleGrid selectionSize={gridData.selectionSize} size={gridSize} readonly={false}/>
          ) : (
            <DisplayGrid values={gridData.values} size={gridSize}/>
          )
        ))}
      </div>
    </>
  )
}

export default GridsCanvas