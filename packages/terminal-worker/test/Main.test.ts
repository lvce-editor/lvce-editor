import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Listen/Listen.ts', () => {
  return {
    listen: jest.fn(),
  }
})

const Main = await import('../src/parts/Main/Main.ts')
const Listen = await import('../src/parts/Listen/Listen.ts')

test('main', async () => {
  await Main.main()
  expect(Listen.listen).toHaveBeenCalledTimes(1)
})
