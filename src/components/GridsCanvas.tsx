import {DisplayGrid} from './DisplayGrid';
import {PuzzleGrid} from './PuzzleGrid';
import {AbsoluteInt, toAbsoluteInt} from "../types/AbsoluteInt.ts";
import {useEffect, useMemo, useState} from "react";
import {
  // getPuzzles,
  // submitSolution,
  startNewGridGame } from '../dataAdapters/gridsCanvasAdapter';
import './GridCanvas.css';
import { GridGameResponse } from '../types/gridGameTypes';

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

// Helper Functions
function importGridList(data: GridGameResponse): GridList {

  const gridData = data.grid;
  const gridArr = gridData.matrix.flat();
  const displayGrid: DisplayGrid = {
    key: 0,
    mode: "reveal",
    values: gridArr.map(toAbsoluteInt),
  };
  const puzzleGrids = gridData.sub_grids.map((selectionSize, index) => ({
    key: index + 1,
    mode: "place",
    selectionSize: toAbsoluteInt(selectionSize),
  } as PuzzleGrid));
  return [displayGrid, ...puzzleGrids];

}

function flattenGrids(gridOverlays: GridOverlays): Array<AbsoluteInt> {
  return gridOverlays.reduce((acc, overlay) => {
    return acc.map((value, index) => toAbsoluteInt(value + overlay[index]));
  }, new Array<AbsoluteInt>(gridArrLength).fill(toAbsoluteInt(0)));
}

// Component
function GridsCanvas() {
  // const [puzzles, setPuzzles] = useState([]);
  const [gridList, setGridList] = useState<GridList>([]);

  // useEffect(() => {
  //   const fetchPuzzles = async () => {
  //     try {
  //       const data = await getPuzzles();
  //       setPuzzles(data);
  //     } catch (error) {
  //       console.error('Error fetching puzzles:', error);
  //     }
  //   };
  //
  //   fetchPuzzles();
  // }, []);

  useEffect(() => {
    const initializeGrid = async () => {
      try {
        const data = await startNewGridGame(6, 123); // Example with hardcoded size and seed

        const importedGridList = importGridList(data)

        setGridList(importedGridList);

        const newOverlays = new Array(importedGridList.length - 1).fill(emptyOverlay)
        setGridOverlays(newOverlays);

      } catch (error) {
        console.error('Error initializing grid:', error);
      }
    };

    initializeGrid();
  }, []);

  // const handleSubmitSolution = async (puzzleId: string, solution: any) => {
  //   try {
  //     const result = await submitSolution(puzzleId, solution);
  //     console.log('Solution submitted:', result);
  //   } catch (error) {
  //     console.error('Error submitting solution:', error);
  //   }
  // };


  const [gridOverlays, setGridOverlays] = useState<GridOverlays>(

  (gridList.length === 0) ? [] : new Array(gridList.length - 1).fill(emptyOverlay)
  );

  const [preview, setPreview] = useState<boolean>(false);
  const flattenedGrids = useMemo(() => flattenGrids(gridOverlays), [gridOverlays]);
  const resultValues = useMemo(() => {
    if (gridList.length === 0) return new Array(gridArrLength).fill(0)
    return preview ? flattenedGrids : (gridList[0] as DisplayGrid).values;
  }, [flattenedGrids, preview, gridList]);

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
            <DisplayGrid key={gridData.key} id={gridData.key} togglePreview={togglePreview} preview={preview}
                         values={resultValues} size={gridSideLength}/>
          )
        ))}
        </span>
      </div>
    </>
  );
}

export default GridsCanvas;
