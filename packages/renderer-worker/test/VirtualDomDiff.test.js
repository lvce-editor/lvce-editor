import * as VirtualDomDiff from '../src/parts/VirtualDomDiff/VirtualDomDiff.js'
import * as VirtualDomDiffType from '../src/parts/VirtualDomDiffType/VirtualDomDiffType.js'
import { div, text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

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
      operation: VirtualDomDiffType.AttributeSet,
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
      operation: VirtualDomDiffType.AttributeSet,
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
      operation: VirtualDomDiffType.AttributeRemove,
      key: 'ariaSelected',
    },
  ])
})

test('diff - one element added', () => {
  expect(VirtualDomDiff.diff([], [div({}, 0)])).toEqual([
    {
      operation: VirtualDomDiffType.ElementAdd,
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
})

test('diff - one element added with child', () => {
  expect(VirtualDomDiff.diff([], [div({}, 1), text('hello world')])).toEqual([
    {
      operation: VirtualDomDiffType.ElementAdd,
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      operation: VirtualDomDiffType.ElementAdd,
      type: VirtualDomElements.Text,
      props: {
        text: 'hello world',
      },
      childCount: 0,
    },
  ])
})

test('diff - two elements added', () => {
  expect(VirtualDomDiff.diff([], [div({}, 0), div({}, 0)])).toEqual([
    {
      operation: VirtualDomDiffType.ElementAdd,
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
    {
      operation: VirtualDomDiffType.ElementAdd,
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
})
