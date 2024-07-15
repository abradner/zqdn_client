import {GridCell} from './GridCell'
import {useMemo, useState} from 'react'
import './Grid.css'
import {AbsoluteInt, toAbsoluteInt} from "../types/AbsoluteInt.ts";

// This component, given a size, will render a grid of GridCell components.
// The grid will be a square, with the number of cells in each row and column equal to the size prop.
// The grid will fill the parent container, and the cells will stretch to fill the available space.
// however the grid cells will be square, and will not stretch to fill the available space if constrained on one axis.

export type GridProps = {
  size: number,
  selectionSize: number,
}

type GridFlags = Array<boolean>;
type GridValues = Array<AbsoluteInt>;

export type GridMode = "place" | "reveal";

type CoordinateSet = [AbsoluteInt, AbsoluteInt];
type PotenticalCell = AbsoluteInt | null;
type PotentialCoordinateSet = CoordinateSet | null;


function cellCoveredByHover(
  coords: PotentialCoordinateSet,
  cellIndex: number,
  gridSize: number,
  selectionSize: number
): boolean {
  if (coords === null) return false;

  const [x0, y0] = coords;

  const cellX = cellIndex % gridSize;
  const cellY = Math.floor(cellIndex / gridSize);

  if (cellX < x0 || cellY < y0) return false;

  const xMax = toAbsoluteInt(x0 + selectionSize - 1);
  const yMax = toAbsoluteInt(y0 + selectionSize - 1);

  return !(cellX > xMax || cellY > yMax);
}

export function Grid(props: GridProps) {
  const squareCount = props.size ** 2;
  const mode: GridMode = "place";

  const [activeCell, setActiveCell] = useState<PotenticalCell>(null);

  const [gridVals, setVals] = useState(Array<AbsoluteInt>(squareCount).fill(toAbsoluteInt(0)));


  const cellCoords = useMemo(
    (): PotentialCoordinateSet => {
      if (activeCell === null) return null;
      const rowSize = props.size;
      const x = activeCell % rowSize;
      const y = Math.floor(activeCell / rowSize);
      return [toAbsoluteInt(x), toAbsoluteInt(y)];
    }, [props.size, activeCell]
  );

  const intentCoords: PotentialCoordinateSet = useMemo(
    (): PotentialCoordinateSet => {
      const chosen = cellCoords;
      if (chosen === null) return null;
      console.log(chosen, props.selectionSize)
      // For any hover or selection intent we want to calculate the top left corner of the selection, using the current cell as the center (or up-and-left one if selection is even)
      const x = toAbsoluteInt(Math.floor(Math.max(chosen[0] - (props.selectionSize - 1) / 2, 0)));
      const y = toAbsoluteInt(Math.floor(Math.max(chosen[1] - (props.selectionSize - 1) / 2, 0)));

      return [toAbsoluteInt(x), toAbsoluteInt(y)];
    }, [activeCell, cellCoords, props.selectionSize]
  );

  const [hoverCoords, setHoverCoords] = useState<PotentialCoordinateSet>(null);
  const [selectCoords, setSelectCoords] = useState<PotentialCoordinateSet>(null);
  // const selectCoords = useMemo(
  //   (): PotentialCoordinateSet => {
  //     return null;
  //   }, [activeCell, mode, intentCoords]
  // );

  const currCellCoveredByHover = useMemo(
    () => {
      if (hoverCoords === null) return false;

      return intentCoords === hoverCoords;
    }, [intentCoords, hoverCoords]
  );

  const hoverGrid: GridFlags = useMemo(
    () => {
      return Array<boolean>(squareCount)
        .fill(false)
        .map(
          (_, i) => cellCoveredByHover(hoverCoords, i, props.size, props.selectionSize)
        );
    }, [hoverCoords, squareCount, props.size, props.selectionSize]);
  const selectGrid: GridFlags = useMemo(
    () => {
      return Array<boolean>(squareCount)
        .fill(false)
        .map(
          (_, i) => cellCoveredByHover(selectCoords, i, props.size, props.selectionSize)
        );
    }, [selectCoords, squareCount, props.size, props.selectionSize]);

  function handleIntentEvent(i: number, intent: "hover" | "select") {
    if (mode === "reveal") return;
    setActiveCell(toAbsoluteInt(i));

    if (intent === "hover") {
      // if (currCellCoveredByHover) return; // No need to update if the cell is already hovered
      setHoverCoords(intentCoords);
    } else { // intent === "select"
      if (!currCellCoveredByHover) {
        // treat as a hover event instead - eg on mobile devices
        handleIntentEvent(i, "hover");
        return;
      }
      setSelectCoords(intentCoords);
    }

  }

  function handleHover(i: number, active: boolean) {
    if (!active) {
      // setActiveCell(null);
      // setHoverCoords(null);
      return;
    } else {
      handleIntentEvent(i, "hover");
    }
  }

  function handleSelect(i: number) {
    handleIntentEvent(i, "select");
  }

  // iterate over the number of cells in the grid and render a GridCell component for each one

  return (
    <>
        <span className={'grid'}>

          {Array.from({length: squareCount}).map((_, i) => (
            <GridCell key={i}
                      hover={hoverGrid[i]}
                      value={gridVals[i]}
                      select={selectGrid[i]}
                      mode={"place"}
                      mouseEnter={() => handleHover(i, true)}
                      mouseLeave={() => handleHover(i, false)}
                      click={() => handleSelect(i)}
            />
          ))}
        </span>
    </>
  )
}

