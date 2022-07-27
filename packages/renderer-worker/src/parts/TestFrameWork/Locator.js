import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const create = (selector, options) => {
  return new Locator(selector, options)
}

const Locator = function (selector, { nth = -1, hasText = '' } = {}) {
  this.selector = selector
  this.nth = nth
  this.hasText = hasText
}

const performAction = async (locator, fnName, options) => {
  return RendererProcess.invoke(
    'TestFrameWork.performAction',
    locator,
    fnName,
    options
  )
}

const toButtonNumber = (buttonType) => {
  switch (buttonType) {
    case 'left':
      return 0
    case 'middle':
      return 1
    case 'right':
      return 2
    default:
      throw new Error(`unsupported button type: ${buttonType}`)
  }
}

Locator.prototype.click = async ({ button = 'left' } = {}) => {
  const options = {
    cancable: true,
    bubbles: true,
    button: toButtonNumber(button),
    detail: 1,
  }
  return performAction(this, 'click', options)
}

Locator.prototype.hover = async () => {
  const options = {
    cancable: true,
    bubbles: true,
  }
  return performAction(this, 'hover', options)
}

Locator.prototype.first = function () {
  return Locator(this.selector, {
    nth: 0,
  })
}

Locator.prototype.locator = function (subSelector) {
  return Locator(`${this.selector} ${subSelector}`)
}

Locator.prototype.nth = function (nth) {
  return Locator(this.selector, { nth })
}

Locator.prototype.type = async (text) => {
  const options = { text }
  return performAction(this, 'type', options)
}
