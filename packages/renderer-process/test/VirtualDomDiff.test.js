/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as VirtualDomDiff from '../src/parts/VirtualDomDiff/VirtualDomDiff.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('renderDiff - update class name', () => {
  const oldHtml = `<div class="a"></div>`
  const diff = [
    {
      type: 'updateProp',
      key: 'className',
      value: 'b',
      index: 0,
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(`<div class="b"></div>`)
})

test('renderDiff - remove a text node', () => {
  const oldHtml = `a`
  const diff = [
    {
      type: 'remove',
      nodes: [0],
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(``)
})

test('renderDiff - sub node attribute modified', () => {
  const oldHtml = `<div class="List"><div class="ListItems"></div><div class="ScrollBar"><div class="ScrollBarThumb"></div></div>`
  const diff = [
    {
      type: 'updateProp',
      index: 3,
      key: 'height',
      value: 20,
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(
    '<div class="List"><div class="ListItems"></div><div class="ScrollBar"><div class="ScrollBarThumb" style="height: 20px;"></div></div></div>',
  )
})

test('renderDiff - sub node removed at end', () => {
  const oldHtml = `<div class="List"><div class="ListItems"></div><div class="ScrollBar"><div class="ScrollBarThumb"></div></div>`
  const diff = [
    {
      type: 'remove',
      nodes: [2],
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe('<div class="List"><div class="ListItems"></div></div>')
})

test('renderDiff - sub node removed at start', () => {
  const oldHtml = `<div class="List"><div class="ScrollBar"><div class="ScrollBarThumb"></div><div class="ListItems"></div></div>`
  const diff = [
    {
      index: 1,
      key: 'className',
      type: 'updateProp',
      value: 'ListItems',
    },
    {
      type: 'remove',
      nodes: [2],
    },
    {
      type: 'remove',
      nodes: [3],
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe('<div class="List"><div class="ListItems"></div></div>')
})

test.skip('renderDiff - insert node - start', () => {
  const oldHtml = `<div><div class="b"></div></div>`
  const diff = [
    {
      type: 'insert',
      nodes: [
        {
          type: VirtualDomElements.Div,
          className: 'a',
          childCount: 0,
        },
      ],
      index: 0,
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(`<div><div class="a"></div><div class="b"></div></div>`)
})

test.skip('renderDiff - insert node - middle', () => {
  const oldHtml = `<div><div class="a"></div><div class="c"></div></div>`
  const diff = [
    {
      type: 'insert',
      nodes: [
        {
          type: VirtualDomElements.Div,
          className: 'b',
          childCount: 0,
        },
      ],
      index: 1,
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(`<div><div class="a"></div><div class="b"></div><div class="c"></div></div>`)
})

test('renderDiff - insert node - end', () => {
  const oldHtml = `<div><div class="a"></div></div>`
  const diff = [
    {
      type: 'insert',
      nodes: [
        {
          type: VirtualDomElements.Div,
          className: 'b',
          childCount: 0,
        },
      ],
      index: 0,
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(`<div><div class="a"></div><div class="b"></div></div>`)
})

test.skip('renderDiff - toggle replace - collapse', () => {
  const oldHtml = ``
  const diff = []
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(``)
})

test('renderDiff - remove and add nodes', () => {
  const oldHtml = `<div class="a"><i class="b"></i></div><div class="a"></div>`
  const diff = [
    {
      type: 'remove',
      nodes: [1],
    },
    {
      index: 2,
      nodes: [
        {
          type: VirtualDomElements.I,
          className: 'b',
          childCount: 0,
        },
      ],
      type: 'insert',
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe('<div class="a"></div><div class="a"><i class="b"></i></div>')
})

test.skip('renderDiff - source control', () => {
  const oldHtml = `<div class="Viewlet SourceControl" tabindex="0"><div class="SourceControlHeader"><input class="InputBox" spellcheck="false" autocapitalize="off" placeholder="Message (Enter) to commit on 'master'" aria-label="Source Control Input"></div><div class="SplitButton "><div class="SplitButtonContent " tabindex="0">Commit</div><div class="SplitButtonSeparator"></div><div class="SplitButtonDropDown " tabindex="0"><div class="MaskIcon MaskIconChevronDown"></div></div></div><div class="SourceControlItems" role="tree"><div class="TreeItem" role="treeitem" aria-expanded="true" aria-posinset="1" aria-setsize="1" style="padding-left: 1rem; padding-right: 12px;"><div class="Chevron MaskIconChevronDown"></div><div class="Label Grow">Changes</div><div class="Badge SourceControlBadge">2</div></div><div class="TreeItem" role="treeitem" aria-posinset="1" aria-setsize="2" title="package-lock.json" style="padding-left: 1rem; padding-right: 12px;"><img class="FileIcon" src="/test/extensions/builtin.vscode-icons//icons/file_type_npm.svg" role="none"><div class="Label Grow">package-lock.json</div><img class="DecorationIcon" title="Modified" src="/extensions/builtin.git/icons/dark/status-modified.svg"></div><div class="TreeItem" role="treeitem" aria-posinset="2" aria-setsize="2" title="package.json" style="padding-left: 1rem; padding-right: 12px;"><img class="FileIcon" src="/test/extensions/builtin.vscode-icons//icons/file_type_npm.svg" role="none"><div class="Label Grow">package.json</div><img class="DecorationIcon" title="Modified" src="/extensions/builtin.git/icons/dark/status-modified.svg"></div></div></div>`
  const diff = [
    {
      type: 'updateProp',
      key: 'src',
      value: '/test/extensions/builtin.vscode-icons//icons/file_type_npm.svg',
      index: 16,
    },
    {
      index: 19,
      type: 'replace',
      nodes: [
        {
          type: 1,
          className: 'SourceControlButton',
          title: 'Open File',
          ariaLabel: 'Open File',
          childCount: 1,
        },
        {
          type: 8,
          className: 'MaskIcon MaskIconGoToFile',
          role: 'none',
          childCount: 0,
        },
      ],
    },
    {
      index: 20,
      type: 'insert',
      nodes: [
        {
          type: 1,
          className: 'SourceControlButton',
          title: 'Discard',
          ariaLabel: 'Discard',
          childCount: 1,
        },
        {
          type: 8,
          className: 'MaskIcon MaskIconDiscard',
          role: 'none',
          childCount: 0,
        },
        {
          type: 1,
          className: 'SourceControlButton',
          title: 'Stage',
          ariaLabel: 'Stage',
          childCount: 1,
        },
        {
          type: 8,
          className: 'MaskIcon MaskIconAdd',
          role: 'none',
          childCount: 0,
        },
        {
          type: 17,
          className: 'DecorationIcon',
          title: 'Modified',
          src: '/extensions/builtin.git/icons/dark/status-modified.svg',
          childCount: 0,
        },
        {
          type: 4,
          className: 'TreeItem',
          role: 'treeitem',
          ariaPosInSet: 2,
          ariaSetSize: 2,
          title: 'package.json',
          childCount: 3,
          paddingLeft: '1rem',
          paddingRight: '12px',
        },
        {
          type: 17,
          className: 'FileIcon',
          src: '/test/extensions/builtin.vscode-icons//icons/file_type_npm.svg',
          role: 'none',
          childCount: 0,
        },
        {
          type: 4,
          className: 'Label Grow',
          childCount: 1,
        },
        {
          type: 12,
          text: 'package.json',
          childCount: 0,
        },
        {
          type: 17,
          className: 'DecorationIcon',
          title: 'Modified',
          src: '/extensions/builtin.git/icons/dark/status-modified.svg',
          childCount: 0,
        },
      ],
    },
    {
      type: 'updateProp',
      key: 'src',
      value: '/test/extensions/builtin.vscode-icons//icons/file_type_npm.svg',
      index: 21,
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe('<div class="a"></div><div class="a"><i class="b"></i></div>')
})
