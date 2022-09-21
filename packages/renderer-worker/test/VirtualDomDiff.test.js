import * as VirtualDomDiff from '../src/parts/VirtualDomDiff/VirtualDomDiff.js'
import * as VirtualDomDiffType from '../src/parts/VirtualDomDiffType/VirtualDomDiffType.js'
import {
  div,
  i,
  text,
} from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import * as VirtualDomParser from '../src/parts/VirtualDomParser/VirtualDomParser.js'

const html = (string) => {
  return VirtualDomParser.parse(string)
}

test('diff - no changes', () => {
  const oldDom = html(``)
  const newDom = html(``)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([])
})

test('diff - one attribute added', () => {
  const oldDom = html(`<div></div>`)
  const newDom = html(`<div aria-selected="true"></div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.AttributeSet,
      key: 'ariaSelected',
      value: true,
    },
  ])
})

test('diff - one attribute changed', () => {
  const oldDom = html(`<div aria-selected="false"></div>`)
  const newDom = html(`<div aria-selected="true"></div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.AttributeSet,
      key: 'ariaSelected',
      value: true,
    },
  ])
})

test('diff - one attribute removed', () => {
  const oldDom = html(`<div aria-selected="false"></div>`)
  const newDom = html(`<div></div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.AttributeRemove,
      key: 'ariaSelected',
    },
  ])
})

test('diff - one element added', () => {
  const oldDom = html(``)
  const newDom = html(`<div></div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          type: VirtualDomElements.Div,
          props: {},
          childCount: 0,
        },
      ],
    },
  ])
})

test('diff - one element added with child', () => {
  const oldDom = html(``)
  const newDom = html(`<div>hello world</div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          type: VirtualDomElements.Div,
          props: {},
          childCount: 1,
        },
        {
          type: VirtualDomElements.Text,
          props: {
            text: 'hello world',
          },
          childCount: 0,
        },
      ],
    },
  ])
})

test.skip('diff - one element added - at start of element', () => {
  const oldDom = html('<div>bc</div>')
  const newDom = html(`<div>abc</div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.AttributeSet,
      index: 1,
      key: 'text',
      value: 'a',
    },
    {
      operation: VirtualDomDiffType.AttributeSet,
      index: 2,
      key: 'text',
      value: 'b',
    },
    {
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          childCount: 0,
          props: {
            text: 'c',
          },
          type: VirtualDomElements.Text,
        },
      ],
    },
  ])
})

test.skip('diff - one element added - between elements', () => {
  const oldDom = html(`<div>ac</div>`)
  const newDom = html(`<div>abc</div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.AttributeSet,
      index: 2,
      key: 'text',
      value: 'b',
    },
    {
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          childCount: 0,
          props: {
            text: 'c',
          },
          type: VirtualDomElements.Text,
        },
      ],
    },
  ])
})

test.skip('diff - one element added - at end of element', () => {
  const oldDom = html(`<div>ab</div>`)
  const newDom = html('<div>abc</div>')
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([])
})

test.skip('diff - two elements added', () => {
  const oldDom = html(``)
  const newDom = html(`<div></div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          type: VirtualDomElements.Div,
          props: {},
          childCount: 0,
        },
        {
          type: VirtualDomElements.Div,
          props: {},
          childCount: 0,
        },
      ],
    },
  ])
})

test.skip('diff - one attribute removed, one attribute added', () => {
  const oldDom = html(`
<div id="QuickPickItemActive"></div>
<div></div>
`)
  const newDom = html(`
<div></div>
<div id="QuickPickItemActive"></div>
`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.AttributeRemove,
      key: 'id',
      index: 0,
    },
    {
      operation: VirtualDomDiffType.AttributeSet,
      key: 'id',
      value: 'QuickPickItemActive',
      index: 1,
    },
  ])
})

test.skip('diff - with children, one attribute removed, one attribute added', () => {
  const oldDom = html(`
<div id="QuickPickItemActive" class="QuickPickItem">
  <div class="Label">1</div>
</div>
<div class="QuickPickItem">
  <div class="Label">2</div>
</div>
`)
  const newDom = html(`
<div class="QuickPickItem">
  <div class="Label">1</div>
</div>
<div id="QuickPickItemActive"  class="QuickPickItem">
  <div class="Label">2</div>
</div>
`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      key: 'id',
      operation: 2,
    },
    {
      index: 3,
      key: 'id',
      operation: 1,
      value: 'QuickPickItemActive',
    },
  ])
})

test('diff - change text', () => {
  const oldDom = html(`hello`)
  const newDom = html(`hello world`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.AttributeSet,
      key: 'text',
      value: 'hello world',
    },
  ])
})

test('diff - remove one element', () => {
  const oldDom = html(`<div></div>`)
  const newDom = html(``)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.ElementRemoveAll,
    },
  ])
})

test('diff - remove one element with child', () => {
  const oldDom = html(`<div><div></div></div>`)
  const newDom = html(``)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.ElementRemoveAll,
    },
  ])
})

test('diff - remove one element and keep one', () => {
  const oldDom = html(`<div></div><div></div>`)
  const newDom = html(`<div></div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 1,
      operation: VirtualDomDiffType.ElementsRemove,
      keepCount: 1,
    },
  ])
})

test.skip('diff - remove one element with child and keep one', () => {
  const oldDom = html(`
<div>
  <div></div>
</div>
<div>
  <div></div>
</div>
`)
  const newDom = html(`
<div>
  <div></div>
</div>
`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 2,
      operation: VirtualDomDiffType.ElementsRemove,
      keepCount: 1,
    },
  ])
})

test.skip('diff - remove multiple elements', () => {
  const oldDom = [
    div(
      {
        id: 'QuickPickItems',
      },
      3
    ),
    div(
      {
        className: 'QuickPickItem',
      },
      2
    ),
    i(
      {
        className: 'Icon',
      },
      0
    ),
    div(
      {
        className: 'Label',
      },
      1
    ),
    text('item 1'),
  ]
  const newDom = [div({}, 1), div({}, 0)]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 2,
      operation: VirtualDomDiffType.ElementsRemove,
      keepCount: 1,
    },
  ])
})
