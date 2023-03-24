import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => {
  return {
    warn: jest.fn(),
    error: jest.fn(),
  }
})

const SafeTokenizeLine = await import('../src/parts/SafeTokenizeLine/SafeTokenizeLine.js')
const Logger = await import('../src/parts/Logger/Logger.js')

test('safeTokenizeLine - error - missing lineState in return value', () => {
  const tokenizeLine = () => {}
  expect(SafeTokenizeLine.safeTokenizeLine('', tokenizeLine, 'test', {}, false)).toEqual({
    tokens: [0, 4],
    lineState: {},
  })
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(new Error('invalid tokenization result'))
})

test('safeTokenizeLine - error - missing tokens in return value', () => {
  const tokenizeLine = () => {
    return {
      lineState: {},
    }
  }
  expect(SafeTokenizeLine.safeTokenizeLine('', tokenizeLine, 'test', {}, false)).toEqual({
    tokens: [0, 4],
    lineState: {},
  })
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(new Error('invalid tokenization result'))
})

test('safeTokenizeLine - error - missing state in return value', () => {
  const tokenizeLine = () => {
    return {
      lineState: {},
      tokens: [],
    }
  }
  expect(SafeTokenizeLine.safeTokenizeLine('', tokenizeLine, 'test', {}, false)).toEqual({
    tokens: [0, 4],
    lineState: {},
  })
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(new Error('invalid tokenization result'))
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
  expect(SafeTokenizeLine.safeTokenizeLine('', tokenizeLine, 'test', {}, false)).toEqual({
    tokens: [1, 4],
    lineState: {},
    state: 1,
  })
  expect(Logger.error).not.toHaveBeenCalled()
})

test('safeTokenizeLine - with array return', () => {
  const tokenizeLine = () => {
    return {
      lineState: {},
      tokens: [{ type: 1, length: 4 }],
      state: 1,
    }
  }
  expect(SafeTokenizeLine.safeTokenizeLine('test', tokenizeLine, 'test', {}, false)).toEqual({
    state: 1,
    tokens: [1, 4],
    lineState: {},
  })
  expect(Logger.error).not.toHaveBeenCalled()
  expect(Logger.warn).toHaveBeenCalledTimes(1)
  expect(Logger.warn).toHaveBeenLastCalledWith('tokenizers without hasArrayReturn=false are deprecated (language test)')
})
