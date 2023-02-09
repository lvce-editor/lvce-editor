import * as ComputeLinks from '../src/parts/ComputeLinks/ComputeLinks.js'
import * as DecorationType from '../src/parts/DecorationType/DecorationType.js'

test('computeLinks', () => {
  expect(ComputeLinks.computeLinks('https://example.com', 0)).toEqual([0, 19, DecorationType.Link, 0])
})
