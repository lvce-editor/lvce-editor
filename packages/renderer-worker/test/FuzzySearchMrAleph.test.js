import { fuzzySearch } from '../src/parts/FuzzySearch/FuzzySearchMrAleph.js'

test('fuzzySearch', () => {
  expect(fuzzySearch('car', 'cartwheel')).toBe(true)
  expect(fuzzySearch('cwhl', 'cartwheel')).toBe(true)
  expect(fuzzySearch('cwheel', 'cartwheel')).toBe(true)
  expect(fuzzySearch('cartwheel', 'cartwheel')).toBe(true)
  expect(fuzzySearch('cwheeel', 'cartwheel')).toBe(false)
  expect(fuzzySearch('lw', 'cartwheel')).toBe(false)
})

test('files', () => {
  expect(fuzzySearch('gitkep', 'gitkeep')).toBe(true)
})

test('commands', () => {
  expect(fuzzySearch('togl', 'toggle SideBar')).toBe(true)
  expect(fuzzySearch('siedbar', 'toggle SideBar')).toBe(false)
  expect(fuzzySearch('hide', 'Hide Quick Pick')).toBe(true)
})
