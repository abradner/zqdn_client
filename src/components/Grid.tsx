import {GridCell} from './GridCell'
import {useState} from 'react'
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

function calcGridFlags(
  coords: PotentialCoordinateSet,
  gridSize: number,
  selectionSize: number
): GridFlags {
  const count = gridSize ** 2;
  const gridFlags =
    Array<boolean>(count)
      .fill(false)

  if (coords === null) return gridFlags;

  return gridFlags
    .map(
      (_, i) => cellCoveredByHover(coords, i, gridSize, selectionSize)
    );
}

function calcIntentCoords(
  activeCell: PotenticalCell,
  gridSize: AbsoluteInt,
  selectionSize: AbsoluteInt
): PotentialCoordinateSet {
  if (activeCell === null) return null;

  const rowSize = gridSize;
  const cell_x = activeCell % rowSize;
  const cell_y = Math.floor(activeCell / rowSize);

  // For any hover or selection intent we want to calculate the top left corner of the selection, using the current cell as the center (or up-and-left one if selection is even)
  const x = toAbsoluteInt(Math.floor(Math.min(cell_x + (selectionSize - 1) / 2, rowSize - selectionSize)));
  const y = toAbsoluteInt(Math.floor(Math.min(cell_y + (selectionSize - 1) / 2, rowSize - selectionSize)));

  return [toAbsoluteInt(x), toAbsoluteInt(y)];
}

// @ts-expect-error TS2488
function areCoordsEqual([x1, y1]: PotentialCoordinateSet, [x2, y2]: PotentialCoordinateSet): boolean {
  return x1 === x2 && y1 === y2;
}

export function Grid(props: GridProps) {
  const gridSize = toAbsoluteInt(props.size);
  const squareCount = toAbsoluteInt(gridSize ** 2);
  const mode: GridMode = "place";

  const [gridVals, setVals] = useState(Array<AbsoluteInt>(squareCount).fill(toAbsoluteInt(0)));

  const [hoverCoords, setHoverCoords] = useState<PotentialCoordinateSet>(null);
  const [selectCoords, setSelectCoords] = useState<PotentialCoordinateSet>(null);

  const [hoverGrid, setHoverGrid] = useState<GridFlags>(Array<boolean>(squareCount));
  const [selectGrid, setSelectGrid] = useState<GridFlags>(Array<boolean>(squareCount));

  function handleIntentEvent(
    i: number,
    intent: "hover" | "select",
  ) {
    if (mode === "reveal") return;

    const intentCoords = calcIntentCoords(toAbsoluteInt(i), gridSize, toAbsoluteInt(props.selectionSize));

    if (
      intent === "hover" || (
        intent === "select" && ( // Mobile devices can't hover, so we need to treat the first tap as a hover:
          !(hoverCoords && areCoordsEqual(intentCoords, hoverCoords))
        )
      )
    ) {
      setHoverCoords(intentCoords);
      setHoverGrid(calcGridFlags(intentCoords, gridSize, props.selectionSize));
    } else if (intent === "select") {
      setSelectCoords(hoverCoords);
      setSelectGrid(hoverGrid);
    }
  }

  function handleHover(i: number, active: boolean) {
    if (!active) {
      setHoverCoords(null);
      return;
    } else {
      handleIntentEvent(i, "hover");
    }
  }

  function handleSelect(i: number) {
    handleIntentEvent(i, "select");
  }

  return (
    <>
        <span className={'grid'}>

          {/* iterate over the number of cells in the grid and render a GridCell component for each one */}
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

