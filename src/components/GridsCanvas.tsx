import { DisplayGrid } from './DisplayGrid';
import { PuzzleGrid } from './PuzzleGrid';
import { AbsoluteInt, toAbsoluteInt } from "../types/AbsoluteInt.ts";
import { useMemo, useState } from "react";
import './GridCanvas.css';

// Constants
const gridSideLength = 6;
const gridArrLength = gridSideLength ** 2;
const emptyOverlay: Array<AbsoluteInt> = new Array(gridArrLength).fill(toAbsoluteInt(0));

// Types
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

export type GridType = DisplayGrid | PuzzleGrid;

type GridList = Array<GridType>;

type GridOverlays = Array<Array<AbsoluteInt>>;

// Static Data
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
  if (typeof gridData === "number") { // This is a PuzzleGrid
    const constrainedGrid: PuzzleGrid = {
      key: i,
      mode: "place",
      selectionSize: toAbsoluteInt(gridData),
    };
    return constrainedGrid;
  } else if (typeof gridData === "object" && typeof gridData[0] === "number") { // This is a DisplayGrid
    const constrainedGrid: DisplayGrid = {
      key: i,
      mode: "reveal",
      values: gridData.map(toAbsoluteInt),
    };
    return constrainedGrid;
  } else {
    throw new Error(`Invalid grid at index ${i}`);
  }
});

// Helper Functions
function flattenGrids(gridOverlays: GridOverlays): Array<AbsoluteInt> {
  return gridOverlays.reduce((acc, overlay) => {
    return acc.map((value, index) => toAbsoluteInt(value + overlay[index]));
  }, new Array<AbsoluteInt>(gridArrLength).fill(toAbsoluteInt(0)));
}

// Component
function GridsCanvas() {
  const [gridOverlays, setGridOverlays] = useState<GridOverlays>(
    new Array(gridList.length - 1).fill(emptyOverlay)
  );

  const flattenedGrids = useMemo(() => flattenGrids(gridOverlays), [gridOverlays]);

  const handleGridOverlayAction = (overlay: Array<AbsoluteInt>, key: number, action: "add" | "remove") => {
    const newOverlays = gridOverlays.map((currentOverlay, index) =>
      index === key - 1 ? (action === "add" ? overlay : emptyOverlay) : currentOverlay
    );
    setGridOverlays(newOverlays);
  };

  return (
    <>
      <div>
        <h3>Grid Canvas</h3>
        <span className={'grid-canvas'}>
        {gridList.map((gridData) => (
          gridData.mode === "place" ? (
            <PuzzleGrid selectionSize={gridData.selectionSize} size={gridSideLength} key={gridData.key} id={gridData.key} readonly={false}
                        setOverlay={handleGridOverlayAction} />
          ) : (
            <DisplayGrid key={gridData.key} id={gridData.key} values={flattenedGrids} size={gridSideLength} />
          )
        ))}
        </span>
      </div>
    </>
  );
}

export default GridsCanvas;
