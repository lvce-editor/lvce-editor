import * as RipGrepPath from '../src/parts/RipGrepPath/RipGrepPath.js'

test('rgPath', () => {
  expect(RipGrepPath.rgPath).toEqual(expect.any(String))
})
