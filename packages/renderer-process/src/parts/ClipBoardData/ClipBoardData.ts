import * as ClipBoardDataType from '../ClipBoardDataType/ClipBoardDataType.ts'

export const getText = (clipBoardData) => {
  return clipBoardData.getData(ClipBoardDataType.Text)
}
