import {Grid, GridProps, GridMode} from './Grid'
import {toAbsoluteInt} from "../types/AbsoluteInt.ts";
function GridsCanvas() {

  return (
    <>
      <div>
        <h3>Grid Canvas</h3>
        <Grid size={toAbsoluteInt(4)} selectionSize={toAbsoluteInt(2)}/>
      </div>
    </>
  )
}

export default GridsCanvas