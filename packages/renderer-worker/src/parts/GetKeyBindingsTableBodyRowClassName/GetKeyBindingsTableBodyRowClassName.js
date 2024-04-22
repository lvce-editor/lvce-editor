import * as ClassNames from '../ClassNames/ClassNames.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'

export const getRowClassName = (isEven, selected) => {
  return MergeClassNames.mergeClassNames(
    ClassNames.KeyBindingsTableRow,
    isEven ? ClassNames.KeyBindingsTableRowEven : ClassNames.KeyBindingsTableRowOdd,
    selected ? ClassNames.KeyBindingsTableRowSelected : '',
  )
}
