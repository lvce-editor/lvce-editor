import * as QuerySelector from './QuerySelector.js'

export const toBeVisible = (locator) => {
  return `expected selector to be visible ${locator.selector}`
}

export const toHaveText = (locator, { text }) => {
  return `expected selector to have text ${locator.selector} ${text}`
}

export const toHaveAttribute = (locator, { key, value }) => {
  const [element] = QuerySelector.querySelector(locator.selector)
  if (!element) {
    return `expected ${locator.selector} to have attribute ${key} ${value} but element was not found`
  }
  const actual = element.getAttribute(key)
  return `expected ${locator.selector} to have attribute ${key} ${value} but was ${actual}`
}

export const toHaveCount = (locator, { count }) => {
  return `expected ${locator.selector} to have count ${count}`
}

export const toBeFocused = (locator) => {
  return `expected ${locator.selector} to be focused`
}

export const toHaveClass = (locator, { className }) => {
  const [element] = QuerySelector.querySelector(locator.selector)
  if (!element) {
    return `expected ${locator.selector} to have class ${className} but element was not found`
  }
  return `expected ${locator.selector} to have class ${className}`
}

export const toBeHidden = (locator) => {
  return `expected ${locator.selector} to be hidden`
}

export const toHaveCss = (locator, { key, value }) => {
  const [element] = QuerySelector.querySelector(locator.selector)
  if (!element) {
    return `expected ${locator.selector} to have css ${key} ${value}`
  }
  const style = getComputedStyle(element)
  const actual = style[key]
  return `expected ${locator.selector} to have css ${key} ${value} but was ${actual}`
}
