/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ViewletList from '../src/parts/Viewlet/ViewletList.js'

beforeEach(() => {
  jest.restoreAllMocks()
})

test('name', () => {
  expect(ViewletList.name).toBe('List')
})

test('create', () => {
  const state = ViewletList.create({
    create$ListItem() {},
    render$ListItem() {},
    handleClick() {},
  })
  expect(state).toBeDefined()
})

test('setItems - empty', () => {
  const state = ViewletList.create({
    create$ListItem() {},
    render$ListItem() {},
    handleClick() {},
  })
  ViewletList.setItems(state, [])
})

test('setItems - single item', () => {
  const state = ViewletList.create({
    render$ListItem($ListItem, item) {
      $ListItem.textContent = `${item}`
    },
    create$ListItem() {
      const $ListItem = document.createElement('div')
      $ListItem.className = 'ListItem'
      return $ListItem
    },
    handleClick() {},
  })
  ViewletList.setItems(state, [1])
  const $List = state.$List
  expect($List.children).toHaveLength(1)
  expect($List.children[0].textContent).toBe('1')
})

test('setItems - multiple items', () => {
  const state = ViewletList.create({
    render$ListItem($ListItem, item) {
      $ListItem.textContent = `${item}`
    },
    create$ListItem() {
      const $ListItem = document.createElement('div')
      $ListItem.className = 'ListItem'
      return $ListItem
    },
    handleClick() {},
  })
  ViewletList.setItems(state, [1, 2, 3])
  const $List = state.$List
  expect($List.children).toHaveLength(3)
  expect($List.children[0].textContent).toBe('1')
  expect($List.children[1].textContent).toBe('2')
  expect($List.children[2].textContent).toBe('3')
})

test('setItems - renderListLess', () => {
  const state = ViewletList.create({
    render$ListItem($ListItem, item) {
      $ListItem.textContent = `${item}`
    },
    create$ListItem() {
      const $ListItem = document.createElement('div')
      $ListItem.className = 'ListItem'
      return $ListItem
    },
    handleClick() {},
  })
  ViewletList.setItems(state, [1, 2])
  const spy = jest.spyOn(document, 'createElement')
  ViewletList.setItems(state, [1, 2, 3])
  const $List = state.$List
  expect($List.children).toHaveLength(3)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('setItems - renderListEqual', () => {
  const state = ViewletList.create({
    render$ListItem($ListItem, item) {
      $ListItem.textContent = `${item}`
    },
    create$ListItem() {
      const $ListItem = document.createElement('div')
      $ListItem.className = 'ListItem'
      return $ListItem
    },
    handleClick() {},
  })
  ViewletList.setItems(state, [1, 2])
  const spy = jest.spyOn(document, 'createElement')
  ViewletList.setItems(state, [3, 4])
  const $List = state.$List
  expect($List.children).toHaveLength(2)
  expect(spy).not.toHaveBeenCalled()
})

test('setItems - renderListMore', () => {
  const state = ViewletList.create({
    render$ListItem($ListItem, item) {
      $ListItem.textContent = `${item}`
    },
    create$ListItem() {
      const $ListItem = document.createElement('div')
      $ListItem.className = 'ListItem'
      return $ListItem
    },
    handleClick() {},
  })
  ViewletList.setItems(state, [1, 2, 3])
  const spy = jest.spyOn(document, 'createElement')
  ViewletList.setItems(state, [1, 2])
  const $List = state.$List
  expect($List.children).toHaveLength(2)
  expect(spy).not.toHaveBeenCalled()
})

test('setItems - error - items is not of type array', () => {
  const state = ViewletList.create({
    render$ListItem($ListItem, item) {
      $ListItem.textContent = `${item}`
    },
    create$ListItem() {
      const $ListItem = document.createElement('div')
      $ListItem.className = 'ListItem'
      return $ListItem
    },
    handleClick() {},
  })
  expect(() => ViewletList.setItems(state, 123)).toThrowError(
    new Error('expected value to be of type array')
  )
})

test('setItems - error - items is not of type array', () => {
  const state = ViewletList.create({
    create$ListItem() {},
    render$ListItem() {},
    handleClick() {},
  })
  expect(() => ViewletList.setItems(state, 42)).toThrowError(
    new Error('expected value to be of type array')
  )
})

test('event - click', () => {
  const handleClick = jest.fn()
  const state = ViewletList.create({
    render$ListItem($ListItem, item) {
      $ListItem.textContent = `${item}`
    },
    create$ListItem() {
      const $ListItem = document.createElement('div')
      $ListItem.className = 'ListItem'
      return $ListItem
    },
    handleClick,
  })
  const event = new MouseEvent('click', {
    bubbles: true,
    clientX: 0,
    clientY: 0,
  })
  state.$List.dispatchEvent(event)
  expect(handleClick).toHaveBeenCalledTimes(1)
  expect(handleClick).toHaveBeenCalledWith(event)
})
