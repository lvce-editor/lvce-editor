import * as Assert from '../Assert/Assert.ts'

export const setInnerHtml = ($Element, sanitizedHtml) => {
  Assert.string(sanitizedHtml)
  $Element.innerHTML = sanitizedHtml
}
