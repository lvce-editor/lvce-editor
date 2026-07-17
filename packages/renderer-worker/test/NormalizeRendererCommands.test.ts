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

test('creates a smaller replacement patch', () => {
  const prefix = 'a'.repeat(100)
  const suffix = 'z'.repeat(100)
  NormalizeRendererCommands.normalizeCommands([['Viewlet.setCss', 1, `${prefix}old${suffix}`]])

  expect(NormalizeRendererCommands.normalizeCommands([['Viewlet.setCss', 1, `${prefix}new${suffix}`]])).toEqual([
    ['Viewlet.patchCss', 1, 100, 3, 'new'],
  ])
})

test('creates insertion and deletion patches', () => {
  const prefix = 'a'.repeat(100)
  const suffix = 'z'.repeat(100)
  NormalizeRendererCommands.normalizeCommands([
    ['Viewlet.setCss', 'one', `${prefix}${suffix}`],
    ['Viewlet.setCss', 'two', `${prefix}middle${suffix}`],
  ])

  expect(
    NormalizeRendererCommands.normalizeCommands([
      ['Viewlet.setCss', 'one', `${prefix}middle${suffix}`],
      ['Viewlet.setCss', 'two', `${prefix}${suffix}`],
    ]),
  ).toEqual([
    ['Viewlet.patchCss', 'one', 100, 0, 'middle'],
    ['Viewlet.patchCss', 'two', 100, 6, ''],
  ])
})

test('retains a full replacement when a patch is not smaller', () => {
  NormalizeRendererCommands.normalizeCommands([['Viewlet.setCss', 1, 'a']])

  expect(NormalizeRendererCommands.normalizeCommands([['Viewlet.setCss', 1, 'b']])).toEqual([['Viewlet.setCss', 1, 'b']])
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
