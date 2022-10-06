import { Fragment } from 'react'
import {ViewMoreComponent} from './types'

export const ViewMore: ViewMoreComponent = ( {empId, disabled, onClick}) => {
  
  if (empId > 5 && empId < 14){
  return (
    <Fragment>
    <button
    className="RampButton"
    disabled={disabled}
    onClick = {onClick}
    >
      View More
      </button>
      </Fragment>
      )
  }else{
    return (
      <Fragment>
      </Fragment>
    )
  }
}
