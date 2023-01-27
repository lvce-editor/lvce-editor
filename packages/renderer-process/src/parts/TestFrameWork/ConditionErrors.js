import * as QuerySelector from './QuerySelector.js'

export const toBeVisible = (locator) => {
  return `expected selector to be visible ${locator._selector}`
}

export const toHaveValue = (locator, { value }) => {
  return `expected selector ${locator._selector} to have value ${value}`
}

const printLocator = (locator) => {
  if (locator._nth !== -1) {
    return `${locator._selector}:nth(${locator._nth})`
  }
  if (locator._hasText) {
    return `${locator._selector} "${locator._hasText}"`
  }
  return `${locator._selector}`
}

export const toHaveText = (locator, { text }) => {
  const element = QuerySelector.querySelectorWithOptions(locator._selector, {
    nth: locator._nth,
    hasText: locator._hasText,
  })
  const locatorString = printLocator(locator)
  if (!element) {
    return `expected selector ${locatorString} to have text "${text}" element was not found`
  }
  return `expected selector ${locatorString} to have text "${text}" but was "${element.textContent}"`
}

export const toHaveAttribute = (locator, { key, value }) => {
  const element = QuerySelector.querySelectorWithOptions(locator._selector, {
    nth: locator._nth,
    hasText: locator._hasText,
  })
  const locatorString = printLocator(locator)
  if (!element) {
    return `expected ${locatorString} to have attribute ${key} ${value} but element was not found`
  }
  const actual = element.getAttribute(key)
  return `expected ${locatorString} to have attribute ${key} ${value} but was ${actual}`
}

export const toHaveCount = (locator, { count }) => {
  const locatorString = printLocator(locator)
  const elements = QuerySelector.querySelector(locator._selector)
  const actualCount = elements.length
  return `expected ${locatorString} to have count ${count} but was ${actualCount}`
}

const stringifyElement = (element) => {
  if (element.id) {
    return `#${element.id}`
  }
  if (element.className) {
    return `.${element.className}`
  }
  if (element === document.body) {
    return 'document.body'
  }
  return element.tagName
}

export const toBeFocused = (locator) => {
  const locatorString = printLocator(locator)
  const activeElement = document.activeElement
  const stringifiedActiveElement = stringifyElement(activeElement)
  return `expected ${locatorString} to be focused but active element is ${stringifiedActiveElement}`
}

export const toHaveClass = (locator, { className }) => {
  const [element] = QuerySelector.querySelector(locator._selector)
  const locatorString = printLocator(locator)
  if (!element) {
    return `expected ${locatorString} to have class ${className} but element was not found`
  }
  return `expected ${locatorString} to have class ${className}`
}

export const toHaveId = (locator, { id }) => {
  const [element] = QuerySelector.querySelector(locator._selector)
  const locatorString = printLocator(locator)
  if (!element) {
    return `expected ${locatorString} to have id ${id} but element was not found`
  }
  return `expected ${locatorString} to have id ${id} but was ${element.id}`
}

export const toBeHidden = (locator) => {
  const locatorString = printLocator(locator)
  return `expected ${locatorString} to be hidden`
}

export const toHaveCss = (locator, { key, value }) => {
  const [element] = QuerySelector.querySelector(locator._selector)
  const locatorString = printLocator(locator)
  if (!element) {
    return `expected ${locatorString} to have css ${key} ${value} but element was not found`
  }
  const style = getComputedStyle(element)
  const actual = style[key]
  return `expected ${locatorString} to have css ${key} ${value} but was ${actual}`
}
