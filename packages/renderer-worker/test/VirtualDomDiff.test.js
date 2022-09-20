import * as VirtualDomDiff from '../src/parts/VirtualDomDiff/VirtualDomDiff.js'
import * as VirtualDomDiffType from '../src/parts/VirtualDomDiffType/VirtualDomDiffType.js'
import { div } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'

test('diff - no changes', () => {
  expect(VirtualDomDiff.diff([], [])).toEqual([])
})

test('diff - one attribute added', () => {
  expect(
    VirtualDomDiff.diff(
      [div({}, 0)],
      [
        div(
          {
            ariaSelected: true,
          },
          0
        ),
      ]
    )
  ).toEqual([
    {
      path: 0,
      type: VirtualDomDiffType.AttributeSet,
      key: 'ariaSelected',
      value: true,
    },
  ])
})

test('diff - one attribute changed', () => {
  expect(
    VirtualDomDiff.diff(
      [
        div(
          {
            ariaSelected: false,
          },
          0
        ),
      ],
      [
        div(
          {
            ariaSelected: true,
          },
          0
        ),
      ]
    )
  ).toEqual([
    {
      path: 0,
      type: VirtualDomDiffType.AttributeSet,
      key: 'ariaSelected',
      value: true,
    },
  ])
})

test('diff - one attribute removed', () => {
  expect(
    VirtualDomDiff.diff(
      [
        div(
          {
            ariaSelected: false,
          },
          0
        ),
      ],
      [div({}, 0)]
    )
  ).toEqual([
    {
      path: 0,
      type: VirtualDomDiffType.AttributeRemove,
      key: 'ariaSelected',
    },
  ])
})
