import { jest } from '@jest/globals'
import * as ClipBoardData from '../src/parts/ClipBoardData/ClipBoardData.js'
import * as ClipBoardDataType from '../src/parts/ClipBoardDataType/ClipBoardDataType.js'

test('getData', () => {
  const clipBoardData = {
    getData: jest.fn(() => {
      return 'test'
    }),
  }
  expect(ClipBoardData.getText(clipBoardData)).toBe('test')
  expect(clipBoardData.getData).toHaveBeenCalledTimes(1)
  expect(clipBoardData.getData).toHaveBeenCalledWith(ClipBoardDataType.Text)
})
