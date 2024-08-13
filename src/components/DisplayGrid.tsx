import {GridCell} from './GridCell'
import './Grid.css'
import {AbsoluteInt, toAbsoluteInt} from "../types/AbsoluteInt.ts";
import {GridMode} from "./GridsCanvas";

// This component, given a size, will render a grid of GridCell components.
// The grid will be a square, with the number of cells in each row and column equal to the size prop.
// The grid will fill the parent container, and the cells will stretch to fill the available space.
// however the grid cells will be square, and will not stretch to fill the available space if constrained on one axis.

type DisplayGridProps = {
  id: number,
  size: number,
  values: Array<AbsoluteInt>,
  preview: boolean,
  togglePreview: () => void,
}

export function DisplayGrid(props: DisplayGridProps) {
  const gridSize = toAbsoluteInt(props.size);
  const squareCount = toAbsoluteInt(gridSize ** 2);

  const gridVals = props.values;

  const mode: GridMode = 'reveal';

  return (
    <>
      <div>
        <p>
          <button onClick={props.togglePreview} className={props.preview ? 'preview__button active' : 'preview__button'}>{props.preview ? 'Preview' : 'Puzzle'}</button>
        </p>
        <span className={'grid'}>

          {/* iterate over the number of cells in the grid and render a GridCell component for each one */}
          {Array.from({length: squareCount}).map((_, i) => (
            <GridCell key={i}
                      hover={false}
                      value={gridVals[i]}
                      select={false}
                      mode={mode}
                      mouseEnter={() => {}}
                      mouseLeave={() => {}}
                      click={() => {}}
            />
          ))}
        </span>
      </div>
    </>
  )
}
