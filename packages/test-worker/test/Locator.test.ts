import { expect, test, beforeEach, jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => {
  return {
    invoke: jest.fn(() => {}),
  }
})

const Locator = await import('../src/parts/Locator/Locator.ts')
const Rpc = await import('../src/parts/Rpc/Rpc.ts')

test('create', () => {
  const selector = 'button'
  const options = {}
  expect(Locator.create(selector, options)).toMatchObject({
    _selector: 'button',
    _nth: -1,
    _hasText: '',
  })
})

test('click', async () => {
  const selector = 'button'
  const options = {}
  const locator = Locator.create(selector, options)
  await locator.click()
  expect(Rpc.invoke).toHaveBeenCalledTimes(1)
  expect(Rpc.invoke).toHaveBeenCalledWith('TestFrameWork.performAction', locator, 'click', {
    bubbles: true,
    button: 0,
    cancable: true,
    detail: 1,
  })
})

test('hover', async () => {
  const selector = 'button'
  const options = {}
  const locator = Locator.create(selector, options)
  await locator.hover()
  expect(Rpc.invoke).toHaveBeenCalledTimes(1)
  expect(Rpc.invoke).toHaveBeenCalledWith('TestFrameWork.performAction', locator, 'hover', {
    bubbles: true,
    cancable: true,
  })
})

test('type', async () => {
  const selector = 'button'
  const options = {}
  const locator = Locator.create(selector, options)
  await locator.type('a')
  expect(Rpc.invoke).toHaveBeenCalledTimes(1)
  expect(Rpc.invoke).toHaveBeenCalledWith('TestFrameWork.performAction', locator, 'type', {
    text: 'a',
  })
})

test('first', async () => {
  const selector = 'button'
  const options = {}
  const locator = Locator.create(selector, options)
  expect(locator.first()).toMatchObject({
    _nth: 0,
  })
})
