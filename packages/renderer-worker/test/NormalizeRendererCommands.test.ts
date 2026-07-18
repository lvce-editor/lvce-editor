import { beforeEach, expect, test } from '@jest/globals'

const NormalizeRendererCommands = await import('../src/parts/NormalizeRendererCommands/NormalizeRendererCommands.js')

beforeEach(() => {
  NormalizeRendererCommands.reset()
})

test('removes empty patches and preserves command order', () => {
  const commands = [
    ['Viewlet.send', 1, 'before'],
    ['Viewlet.setPatches', 1, []],
    ['Viewlet.send', 1, 'after'],
  ]

  expect(NormalizeRendererCommands.normalizeCommands(commands)).toEqual([
    ['Viewlet.send', 1, 'before'],
    ['Viewlet.send', 1, 'after'],
  ])
})

test('requires an initial full stylesheet and suppresses duplicates', () => {
  const command = ['Viewlet.setCss', 1, '.item { color: red; }']

  expect(NormalizeRendererCommands.normalizeCommands([command])).toEqual([command])
  expect(NormalizeRendererCommands.normalizeCommands([command])).toEqual([])
})

test('sends the full stylesheet when it changes', () => {
  const prefix = 'a'.repeat(100)
  const suffix = 'z'.repeat(100)
  NormalizeRendererCommands.normalizeCommands([['Viewlet.setCss', 1, `${prefix}old${suffix}`]])
  const command = ['Viewlet.setCss', 1, `${prefix}new${suffix}`]

  expect(NormalizeRendererCommands.normalizeCommands([command])).toEqual([command])
})

test('disposal clears stylesheet state', () => {
  const command = ['Viewlet.setCss', 1, '.item {}']
  NormalizeRendererCommands.normalizeCommands([command])

  NormalizeRendererCommands.normalizeCommands([['Viewlet.dispose', 1]])

  expect(NormalizeRendererCommands.normalizeCommands([command])).toEqual([command])
})

test('tracks stylesheets independently by id', () => {
  const css = '.item {}'

  expect(
    NormalizeRendererCommands.normalizeCommands([
      ['Viewlet.setCss', 1, css],
      ['Viewlet.setCss', 2, css],
    ]),
  ).toEqual([
    ['Viewlet.setCss', 1, css],
    ['Viewlet.setCss', 2, css],
  ])
})
