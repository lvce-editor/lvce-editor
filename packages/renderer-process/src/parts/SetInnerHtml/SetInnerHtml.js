import * as Assert from '../Assert/Assert.js'

export const setInnerHtml = ($Element, sanitizedHtml) => {
  Assert.string(sanitizedHtml)
  $Element.innerHTML = sanitizedHtml
}
