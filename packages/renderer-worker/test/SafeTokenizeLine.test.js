import * as SafeTokenizeLine from '../src/parts/SafeTokenizeLine/SafeTokenizeLine.js'
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

test('safeTokenizeLine - error - missing lineState in return value', () => {
  const tokenizeLine = () => {}
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  expect(
    SafeTokenizeLine.safeTokenizeLine(tokenizeLine, 'test', {}, false)
  ).toEqual({
    tokens: [0, 4],
    lineState: {},
  })
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(new Error('invalid tokenization result'))
})

test('safeTokenizeLine - error - missing tokens in return value', () => {
  const tokenizeLine = () => {
    return {
      lineState: {},
    }
  }
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  expect(
    SafeTokenizeLine.safeTokenizeLine(tokenizeLine, 'test', {}, false)
  ).toEqual({
    tokens: [0, 4],
    lineState: {},
  })
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(new Error('invalid tokenization result'))
})

test('safeTokenizeLine - error - missing state in return value', () => {
  const tokenizeLine = () => {
    return {
      lineState: {},
      tokens: [],
    }
  }
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  expect(
    SafeTokenizeLine.safeTokenizeLine(tokenizeLine, 'test', {}, false)
  ).toEqual({
    tokens: [0, 4],
    lineState: {},
  })
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(new Error('invalid tokenization result'))
})

test('safeTokenizeLine', () => {
  const tokenizeLine = () => {
    return {
      lineState: {},
      tokens: [
        {
          type: 1,
          length: 4,
        },
      ],
      state: 1,
    }
  }
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  expect(
    SafeTokenizeLine.safeTokenizeLine(tokenizeLine, 'test', {}, false)
  ).toEqual({
    tokens: [1, 4],
    lineState: {},
    state: 1,
  })
  expect(spy).not.toHaveBeenCalled()
})

test('safeTokenizeLine - with array return', () => {
  const tokenizeLine = () => {
    return {
      lineState: {},
      tokens: [1, 4],
      state: 1,
    }
  }
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  expect(
    SafeTokenizeLine.safeTokenizeLine(tokenizeLine, 'test', {}, true)
  ).toEqual({
    tokens: [1, 4],
    lineState: {},
    state: 1,
  })
  expect(spy).not.toHaveBeenCalled()
})
