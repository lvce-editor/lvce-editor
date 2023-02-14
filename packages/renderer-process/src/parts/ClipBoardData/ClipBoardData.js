import * as ClipBoardDataType from '../ClipBoardDataType/ClipBoardDataType.js'

export const getText = (clipBoardData) => {
  return clipBoardData.getData(ClipBoardDataType.Text)
}
