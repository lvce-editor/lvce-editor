/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as LayerText3 from '../src/parts/Editor/LayerText.js'

const create$EditorRow = () => {
  const $EditorRow = document.createElement('div')
  $EditorRow.className = 'EditorRow'
  return $EditorRow
}

const create$Token = (text, className) => {
  const $Token = document.createElement('span')
  $Token.className = className
  $Token.textContent = text
  return $Token
}

afterEach(() => {
  jest.restoreAllMocks()
})

test('setLineInfo - renderLinesLess', () => {
  const state = {
    $LayerText: document.createElement('div'),
  }
  const lineInfos = [[]]
  const spy = jest.spyOn(document, 'createElement')
  LayerText3.setLineInfos(state, lineInfos)
  expect(state.$LayerText.innerHTML).toBe('<div class="EditorRow"></div>')
  expect(spy).toHaveBeenCalledTimes(1)
})

test('setLineInfo - renderLinesLess - single line already exists', () => {
  const state = {
    $LayerText: document.createElement('div'),
  }
  state.$LayerText.append(create$EditorRow())
  const lineInfos = [[], []]
  const spy = jest.spyOn(document, 'createElement')
  LayerText3.setLineInfos(state, lineInfos)
  expect(state.$LayerText.innerHTML).toBe(
    '<div class="EditorRow"></div><div class="EditorRow"></div>'
  )
  expect(spy).toHaveBeenCalledTimes(1)
})

test('setLineInfo - renderLinesEqual', () => {
  const state = {
    $LayerText: document.createElement('div'),
  }
  state.$LayerText.append(create$EditorRow())
  const lineInfos = [[]]
  const spy = jest.spyOn(document, 'createElement')
  LayerText3.setLineInfos(state, lineInfos)
  expect(state.$LayerText.innerHTML).toBe('<div class="EditorRow"></div>')
  expect(spy).not.toHaveBeenCalled()
})

test('setLineInfo - renderLinesMore', () => {
  const state = {
    $LayerText: document.createElement('div'),
  }
  state.$LayerText.append(create$EditorRow())
  state.$LayerText.append(create$EditorRow())
  const lineInfos = [[]]
  const spy = jest.spyOn(document, 'createElement')
  LayerText3.setLineInfos(state, lineInfos)
  expect(state.$LayerText.innerHTML).toBe('<div class="EditorRow"></div>')
  expect(spy).not.toHaveBeenCalled()
})

test('setLineInfo - renderLineLess', () => {
  const state = {
    $LayerText: document.createElement('div'),
  }
  state.$LayerText.append(create$EditorRow())
  const lineInfos = [['<', 'Token PunctuationTag']]
  const spy = jest.spyOn(document, 'createElement')
  LayerText3.setLineInfos(state, lineInfos)
  expect(state.$LayerText.innerHTML).toBe(
    '<div class="EditorRow"><span class="Token PunctuationTag">&lt;</span></div>'
  )
  expect(spy).toHaveBeenCalledTimes(1)
})

test('setLineInfo - renderLineEqual', () => {
  const state = {
    $LayerText: document.createElement('div'),
  }
  state.$LayerText.append(create$EditorRow())
  state.$LayerText.children[0].append(create$Token('<', 'PunctuationTag'))
  const lineInfos = [['<', 'Token PunctuationTag']]
  const spy = jest.spyOn(document, 'createElement')
  LayerText3.setLineInfos(state, lineInfos)
  expect(state.$LayerText.innerHTML).toBe(
    '<div class="EditorRow"><span class="Token PunctuationTag">&lt;</span></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('setLineInfo - renderLineEqual - should recycle text node', () => {
  const state = {
    $LayerText: document.createElement('div'),
  }
  state.$LayerText.append(create$EditorRow())
  state.$LayerText.children[0].append(create$Token('<', 'PunctuationTag'))
  const lineInfos = [['<', 'Token PunctuationTag']]
  const spy = jest.spyOn(HTMLElement.prototype, 'textContent', 'set')
  LayerText3.setLineInfos(state, lineInfos)
  expect(state.$LayerText.innerHTML).toBe(
    '<div class="EditorRow"><span class="Token PunctuationTag">&lt;</span></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('setLineInfo - renderLineMore', () => {
  const state = {
    $LayerText: document.createElement('div'),
  }
  state.$LayerText.append(create$EditorRow())
  state.$LayerText.children[0].append(
    create$Token('<', 'PunctuationTag'),
    create$Token('!DOCTYPE', 'Token TagName')
  )
  const lineInfos = [['<', 'Token PunctuationTag']]
  const spy = jest.spyOn(document, 'createElement')
  LayerText3.setLineInfos(state, lineInfos)
  expect(state.$LayerText.innerHTML).toBe(
    '<div class="EditorRow"><span class="Token PunctuationTag">&lt;</span></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('rendering bug', () => {
  const state = {
    $LayerText: document.createElement('div'),
  }
  LayerText3.setLineInfos(state, [
    [
      '<',
      'Token PunctuationTag',
      '!DOCTYPE',
      'Token TagName',
      ' ',
      'Token Whitespace',
      'html',
      'Token AttributeName',
      '>',
      'Token PunctuationTag',
    ],
    [
      '<',
      'Token PunctuationTag',
      'html',
      'Token TagName',
      ' ',
      'Token Whitespace',
      'lang',
      'Token AttributeName',
      '=',
      'Token Punctuation',
      '"',
      'Token PunctuationString',
      'en',
      'Token String',
      '"',
      'Token PunctuationString',
      '>',
      'Token PunctuationTag',
      '<',
      'Token PunctuationTag',
      '/',
      'Token PunctuationTag',
      'html',
      'Token TagName',
      '>',
      'Token PunctuationTag',
    ],
    [],
    [
      '<',
      'Token PunctuationTag',
      '!DOCTYPE',
      'Token TagName',
      ' ',
      'Token Whitespace',
      'html',
      'Token AttributeName',
      '>',
      'Token PunctuationTag',
    ],
    [
      '<',
      'Token PunctuationTag',
      'html',
      'Token TagName',
      ' ',
      'Token Whitespace',
      'lang',
      'Token AttributeName',
      '=',
      'Token Punctuation',
      '"',
      'Token PunctuationString',
      'en',
      'Token String',
      '"',
      'Token PunctuationString',
      '>',
      'Token PunctuationTag',
    ],
    [
      '  ',
      'Token Text',
      '<',
      'Token PunctuationTag',
      'head',
      'Token TagName',
      '>',
      'Token PunctuationTag',
    ],
    [
      '    ',
      'Token Text',
      '<',
      'Token PunctuationTag',
      'meta',
      'Token TagName',
      ' ',
      'Token Whitespace',
      'charset',
      'Token AttributeName',
      '=',
      'Token Punctuation',
      '"',
      'Token PunctuationString',
      'UTF-8',
      'Token String',
      '"',
      'Token PunctuationString',
      ' ',
      'Token Whitespace',
      '/>',
      'Token PunctuationTag',
    ],
    [
      '  ',
      'Token Text',
      '<',
      'Token PunctuationTag',
      '/',
      'Token PunctuationTag',
      'head',
      'Token TagName',
      '>',
      'Token PunctuationTag',
    ],
    [
      '<',
      'Token PunctuationTag',
      '/',
      'Token PunctuationTag',
      'html',
      'Token TagName',
      '>',
      'Token PunctuationTag',
    ],
    [],
  ])
  LayerText3.setLineInfos(state, [
    [],
    [
      '<',
      'Token PunctuationTag',
      '!DOCTYPE',
      'Token TagName',
      ' ',
      'Token Whitespace',
      'html',
      'Token AttributeName',
      '>',
      'Token PunctuationTag',
    ],
    [
      '<',
      'Token PunctuationTag',
      'html',
      'Token TagName',
      ' ',
      'Token Whitespace',
      'lang',
      'Token AttributeName',
      '=',
      'Token Punctuation',
      '"',
      'Token PunctuationString',
      'en',
      'Token String',
      '"',
      'Token PunctuationString',
      '>',
      'Token PunctuationTag',
    ],
    [
      '  ',
      'Token Text',
      '<',
      'Token PunctuationTag',
      'head',
      'Token TagName',
      '>',
      'Token PunctuationTag',
    ],
    [
      '    ',
      'Token Text',
      '<',
      'Token PunctuationTag',
      'meta',
      'Token TagName',
      ' ',
      'Token Whitespace',
      'charset',
      'Token AttributeName',
      '=',
      'Token Punctuation',
      '"',
      'Token PunctuationString',
      'UTF-8',
      'Token String',
      '"',
      'Token PunctuationString',
      ' ',
      'Token Whitespace',
      '/>',
      'Token PunctuationTag',
    ],
    [
      '  ',
      'Token Text',
      '<',
      'Token PunctuationTag',
      '/',
      'Token PunctuationTag',
      'head',
      'Token TagName',
      '>',
      'Token PunctuationTag',
    ],
    [
      '<',
      'Token PunctuationTag',
      '/',
      'Token PunctuationTag',
      'html',
      'Token TagName',
      '>',
      'Token PunctuationTag',
    ],
    [],
  ])
  expect(state.$LayerText.innerHTML).toBe(
    '<div class="EditorRow"></div><div class="EditorRow"><span class="Token PunctuationTag">&lt;</span><span class="Token TagName">!DOCTYPE</span><span class="Token Whitespace"> </span><span class="Token AttributeName">html</span><span class="Token PunctuationTag">&gt;</span></div><div class="EditorRow"><span class="Token PunctuationTag">&lt;</span><span class="Token TagName">html</span><span class="Token Whitespace"> </span><span class="Token AttributeName">lang</span><span class="Token Punctuation">=</span><span class="Token PunctuationString">"</span><span class="Token String">en</span><span class="Token PunctuationString">"</span><span class="Token PunctuationTag">&gt;</span></div><div class="EditorRow"><span class="Token Text">  </span><span class="Token PunctuationTag">&lt;</span><span class="Token TagName">head</span><span class="Token PunctuationTag">&gt;</span></div><div class="EditorRow"><span class="Token Text">    </span><span class="Token PunctuationTag">&lt;</span><span class="Token TagName">meta</span><span class="Token Whitespace"> </span><span class="Token AttributeName">charset</span><span class="Token Punctuation">=</span><span class="Token PunctuationString">"</span><span class="Token String">UTF-8</span><span class="Token PunctuationString">"</span><span class="Token Whitespace"> </span><span class="Token PunctuationTag">/&gt;</span></div><div class="EditorRow"><span class="Token Text">  </span><span class="Token PunctuationTag">&lt;</span><span class="Token PunctuationTag">/</span><span class="Token TagName">head</span><span class="Token PunctuationTag">&gt;</span></div><div class="EditorRow"><span class="Token PunctuationTag">&lt;</span><span class="Token PunctuationTag">/</span><span class="Token TagName">html</span><span class="Token PunctuationTag">&gt;</span></div><div class="EditorRow"></div>'
  )
})
