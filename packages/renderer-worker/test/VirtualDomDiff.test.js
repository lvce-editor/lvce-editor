import * as VirtualDomDiff from '../src/parts/VirtualDomDiff/VirtualDomDiff.js'
import * as VirtualDomDiffType from '../src/parts/VirtualDomDiffType/VirtualDomDiffType.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import {
  div,
  i,
  text,
} from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'
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
      index: 0,
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
      index: 0,
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

test('diff - one element added - at start of element', () => {
  const oldDom = html(`
<div>
  <div>b</div>
  <div>c</div>
</div>`)
  const newDom = html(`
<div>
  <div>a</div>
  <div>b</div>
  <div>c</div>
</div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          type: VirtualDomElements.Div,
          props: {},
          childCount: 1,
        },
        {
          childCount: 0,
          props: {
            text: 'c',
          },
          type: VirtualDomElements.Text,
        },
      ],
    },
    {
      operation: VirtualDomDiffType.AttributeSet,
      index: 2,
      key: 'text',
      value: 'a',
    },
    {
      operation: VirtualDomDiffType.AttributeSet,
      index: 4,
      key: 'text',
      value: 'b',
    },
  ])
})

test('diff - one element added - between elements', () => {
  const oldDom = html(`
<div>
  <div>a</div>
  <div>c</div>
</div>`)
  const newDom = html(`
<div>
  <div>a</div>
  <div>b</div>
  <div>c</div>
</div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          childCount: 1,
          type: VirtualDomElements.Div,
          props: {},
        },
        {
          childCount: 0,
          props: {
            text: 'c',
          },
          type: VirtualDomElements.Text,
        },
      ],
    },
    {
      operation: VirtualDomDiffType.AttributeSet,
      index: 4,
      key: 'text',
      value: 'b',
    },
  ])
})

test('diff - one element added - at end of element', () => {
  const oldDom = html(`
<div>
  <div>a</div>
  <div>b</div>
</div>`)
  const newDom = html(`
<div>
  <div>a</div>
  <div>b</div>
  <div>c</div>
</div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          childCount: 1,
          type: VirtualDomElements.Div,
          props: {},
        },
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

test('diff - two elements added', () => {
  const oldDom = html(``)
  const newDom = html(`<div></div><div></div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
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

test('diff - one attribute removed, one attribute added', () => {
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

test('diff - with children, one attribute removed, one attribute added', () => {
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

test('diff - remove one element with child and keep one', () => {
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

test('diff - remove multiple elements', () => {
  const oldDom = html(`
<div class="QuickPickItem">
  <i class="icon"></i>
  <div class="Label">1</div>
</div>
<div class="QuickPickItem">
  <i class="icon"></i>
  <div class="Label">2</div>
</div>
<div class="QuickPickItem">
  <i class="icon"></i>
  <div class="Label">3</div>
</div>
`)
  const newDom = html(`
<div class="QuickPickItem">
  <i class="icon"></i>
  <div class="Label">1</div>
</div>
`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 4,
      operation: VirtualDomDiffType.ElementsRemove,
      keepCount: 1,
    },
  ])
})

test('diff - remove multiple elements from parent', () => {
  const oldDom = html(`
<div id="QuickPickItems">
  <div class="QuickPickItem">
    <i class="icon"></i>
    <div class="Label">1</div>
  </div>
  <div class="QuickPickItem">
    <i class="icon"></i>
    <div class="Label">2</div>
  </div>
  <div class="QuickPickItem">
    <i class="icon"></i>
    <div class="Label">3</div>
  </div>
</div>
`)
  const newDom = html(`
<div id="QuickPickItems">
  <div class="QuickPickItem">
    <i class="icon"></i>
    <div class="Label">1</div>
  </div>
</div>
`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 5,
      operation: VirtualDomDiffType.ElementsRemove,
      keepCount: 1,
    },
  ])
})

test('diff - change attributes and add elements', () => {
  const oldDom = html(`
<div id="QuickPickItems">
  <div class="QuickPickItem">
    <i class="icon"></i>
    <div class="Label">1</div>
  </div>
</div>
`)
  const newDom = html(`
<div id="QuickPickItems">
  <div class="QuickPickItem">
    <i class="icon"></i>
    <div class="Label">0</div>
  </div>
  <div class="QuickPickItem">
    <i class="icon"></i>
    <div class="Label">1</div>
  </div>
  <div class="QuickPickItem">
    <i class="icon"></i>
    <div class="Label">2</div>
  </div>
</div>
`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.ElementsAdd,
      index: 0,
      newDom: [
        {
          childCount: 2,
          props: {
            className: 'QuickPickItem',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'icon',
          },
          type: VirtualDomElements.I,
        },
        {
          childCount: 1,
          props: {
            className: 'Label',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            text: '1',
          },
          type: VirtualDomElements.Text,
        },
        {
          childCount: 2,
          props: {
            className: 'QuickPickItem',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'icon',
          },
          type: VirtualDomElements.I,
        },
        {
          childCount: 1,
          props: {
            className: 'Label',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            text: '2',
          },
          type: VirtualDomElements.Text,
        },
      ],
    },
    {
      index: 4,
      key: 'text',
      operation: VirtualDomDiffType.AttributeSet,
      value: '0',
    },
  ])
})

test('diff - remove all elements from parent', () => {
  const oldDom = html(`
<div id="QuickPickItems">
  <div class="QuickPickItem">
    <i class="icon"></i>
    <div class="Label">1</div>
  </div>
  <div class="QuickPickItem">
    <i class="icon"></i>
    <div class="Label">2</div>
  </div>
  <div class="QuickPickItem">
    <i class="icon"></i>
    <div class="Label">3</div>
  </div>
</div>`)
  const newDom = html(`<div id="QuickPickItems"></div>`)
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 1,
      operation: VirtualDomDiffType.ElementsRemove,
      keepCount: 0,
    },
  ])
})
