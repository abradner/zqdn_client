import {DisplayGrid} from './DisplayGrid';
import {PuzzleGrid} from './PuzzleGrid';
import {AbsoluteInt, toAbsoluteInt} from "../types/AbsoluteInt.ts";
import {useMemo, useState} from "react";
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
    1, 1, 1, 0, 0, 0,
    1, 2, 2, 1, 2, 0,
    1, 2, 3, 2, 2, 0,
    0, 1, 2, 4, 3, 0,
    0, 1, 2, 4, 4, 0,
    0, 0, 0, 1, 1, 0,
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

  const [preview, setPreview] = useState<boolean>(false);

  const flattenedGrids = useMemo(() => flattenGrids(gridOverlays), [gridOverlays]);

  const resultValues = useMemo(() => {
    return preview ? flattenedGrids : (gridList[0] as DisplayGrid).values;
  }, [flattenedGrids, preview]);

  const togglePreview = () => {
    setPreview(!preview);
  }

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
            <PuzzleGrid selectionSize={gridData.selectionSize} size={gridSideLength} key={gridData.key}
                        id={gridData.key} readonly={false}
                        setOverlay={handleGridOverlayAction}/>
          ) : (
            <DisplayGrid key={gridData.key} id={gridData.key} togglePreview={togglePreview} preview={preview} values={resultValues} size={gridSideLength}/>
          )
        ))}
        </span>
      </div>
    </>
  );
}

export default GridsCanvas;
