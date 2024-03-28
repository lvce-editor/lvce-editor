import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import * as VirtualDomParser from '../src/parts/VirtualDomParser/VirtualDomParser.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('parse - empty', () => {
  const dom = VirtualDomParser.parse('')
  expect(dom).toEqual([])
})

test('parse - one element', () => {
  const dom = VirtualDomParser.parse('<div></div>')
  expect(dom).toEqual([
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
})

test('parse - one element with one child', () => {
  const dom = VirtualDomParser.parse('<div><div></div></div>')
  expect(dom).toEqual([
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
})

test('parse - one element with class', () => {
  const dom = VirtualDomParser.parse('<div class="abc"></div>')
  expect(dom).toEqual([
    {
      type: VirtualDomElements.Div,
      props: {
        className: 'abc',
      },
      childCount: 0,
    },
  ])
})

test('parse - one element with class and id', () => {
  const dom = VirtualDomParser.parse('<div class="abc" id="def"></div>')
  expect(dom).toEqual([
    {
      type: VirtualDomElements.Div,
      props: {
        className: 'abc',
        id: 'def',
      },
      childCount: 0,
    },
  ])
})

test('parse - two elements', () => {
  const dom = VirtualDomParser.parse('<div></div><div></div>')
  expect(dom).toEqual([
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
  ])
})

test('parse - nesting level 3', () => {
  const dom = VirtualDomParser.parse('<div><div><div></div></div></div>')
  expect(dom).toEqual([
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
})

test('parse - nesting level 4', () => {
  const dom = VirtualDomParser.parse('<div><div><div><div></div></div></div></div>')
  expect(dom).toEqual([
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
})

test('parse - attribute with dash', () => {
  const dom = VirtualDomParser.parse('<div aria-selected="true"></div>')
  expect(dom).toEqual([
    {
      type: VirtualDomElements.Div,
      props: {
        ariaSelected: true,
      },
      childCount: 0,
    },
  ])
})

test('parse - attribute without value', () => {
  const dom = VirtualDomParser.parse('<input disabled>')
  expect(dom).toEqual([
    {
      type: VirtualDomElements.Input,
      props: {
        disabled: true,
      },
      childCount: 0,
    },
  ])
})

test('parse - element with text', () => {
  const dom = VirtualDomParser.parse('<div>hello world</div>')
  expect(dom).toEqual([
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
  ])
})

test('parse - element with multiple children', () => {
  const dom = VirtualDomParser.parse(`<div class="QuickPickItem">
  <i class="Icon"></i>
  <div class="Label">1</div>
</div>`)
  expect(dom).toEqual([
    {
      type: VirtualDomElements.Div,
      props: {
        className: 'QuickPickItem',
      },
      childCount: 2,
    },
    {
      type: VirtualDomElements.I,
      props: {
        className: 'Icon',
      },
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      props: { className: 'Label' },
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      props: {
        text: '1',
      },
      childCount: 0,
    },
  ])
})
