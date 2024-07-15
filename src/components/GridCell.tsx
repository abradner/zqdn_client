// This component is a single cell in the grid. It is a simple component that renders a single cell in the grid.
// The cell is the base component of the game, and it will receive a few different states passed down as props.
// The cell will have two different modes - place and reveal.
// In 'place' mode, the cell will be able to receive hover and click events, and will display an overlay when hovered over or selected.
// In 'reveal' mode, the cell will display a passed-in value, and will not respond to hover or click events.

import './GridCell.css'
import classNames from 'classnames';
import React from 'react';
import { GridMode } from './Grid';

export type GridCellProps = {
  key: number,
  mode: GridMode,
  value: number,
  hover: boolean,
  select: boolean,
  click: (e: React.MouseEvent) => void,
  mouseEnter: (e: React.MouseEvent) => void,
  mouseLeave: (e: React.MouseEvent) => void,
}

export function GridCell(props: GridCellProps) {

  const cellClasses = classNames('grid-cell', {
    'grid-cell--hover': props.hover,
    'grid-cell--selected': props.select,
    'grid-cell--hover--selected': props.hover && props.select,
  });

  return (
    <>
      <span
        className={cellClasses}
        onClick={props.click}
        onMouseEnter={props.mouseEnter}
        onMouseLeave={props.mouseLeave}
      >
        {(props.mode === 'reveal') ? props.value : ''}
      </span>
    </>
  )
}
