import { jest } from '@jest/globals'
import * as Navigation from '../src/parts/Navigation/Navigation.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

test('focusTitleBar', () => {
  RendererProcess.state.send = jest.fn()
  Navigation.focusTitleBar()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([1331])
})

test('focusActivityBar', () => {
  RendererProcess.state.send = jest.fn()
  Navigation.focusActivityBar()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([717115])
})

test('focusStatusBar', () => {
  RendererProcess.state.send = jest.fn()
  Navigation.focusStatusBar()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([8882])
})

test('focusPanel', () => {
  RendererProcess.state.send = jest.fn()
  Navigation.focusPanel()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([6664])
})

test('focusSideBar', () => {
  RendererProcess.state.send = jest.fn()
  Navigation.focusSideBar()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([5554])
})

test('focusMain', () => {
  RendererProcess.state.send = jest.fn()
  Navigation.focusMain()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([2145])
})

test('focusPart', () => {
  RendererProcess.state.send = jest.fn()
  Navigation.focusPart(/* PART_TITLE_BAR */ 1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([1331])
  RendererProcess.state.send = jest.fn()
  Navigation.focusPart(/* PART_MAIN */ 2)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([2145])
  RendererProcess.state.send = jest.fn()
  Navigation.focusPart(/* PART_PANEL */ 3)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([6664])
  RendererProcess.state.send = jest.fn()
  Navigation.focusPart(/* PART_STATUS_BAR */ 4)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([8882])
  RendererProcess.state.send = jest.fn()
  Navigation.focusPart(/* PART_SIDE_BAR */ 5)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([5554])
  RendererProcess.state.send = jest.fn()
  Navigation.focusPart(/* PART_ACTIVITY_BAR */ 6)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([717115])
})

test('focusNextPart', () => {
  Navigation.state.focusedPart = /* PART_TITLE_BAR */ 1
  Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_MAIN */ 2)
  Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_PANEL */ 3)
  Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_STATUS_BAR */ 4)
  Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_SIDE_BAR */ 5)
  Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_ACTIVITY_BAR */ 6)
  Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_TITLE_BAR */ 1)
})

test('focusPreviousPart', () => {
  Navigation.state.focusedPart = /* PART_TITLE_BAR */ 1
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_ACTIVITY_BAR */ 6)
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_SIDE_BAR */ 5)
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_STATUS_BAR */ 4)
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_PANEL */ 3)
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_MAIN */ 2)
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_TITLE_BAR */ 1)
})
