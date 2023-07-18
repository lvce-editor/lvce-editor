import * as ElementTags from '../ElementTags/ElementTags.js'

export const isSelfClosingTag = (tag) => {
  switch (tag) {
    case ElementTags.Img:
      return true
    default:
      return false
  }
}
