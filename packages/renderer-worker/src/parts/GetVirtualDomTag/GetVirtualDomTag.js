import * as ElementTags from '../ElementTags/ElementTags.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getVirtualDomTag = (text) => {
  switch (text) {
    case ElementTags.H1:
      return VirtualDomElements.H1
    case ElementTags.H2:
      return VirtualDomElements.H2
    case ElementTags.H3:
      return VirtualDomElements.H3
    case ElementTags.H4:
      return VirtualDomElements.H4
    case ElementTags.H5:
      return VirtualDomElements.H5
    case ElementTags.Div:
      return VirtualDomElements.Div
    case ElementTags.Article:
      return VirtualDomElements.Article
    case ElementTags.Aside:
      return VirtualDomElements.Aside
    case ElementTags.Footer:
      return VirtualDomElements.Footer
    case ElementTags.Header:
      return VirtualDomElements.Header
    case ElementTags.Nav:
      return VirtualDomElements.Nav
    case ElementTags.Section:
      return VirtualDomElements.Section
    case ElementTags.Search:
      return VirtualDomElements.Search
    case ElementTags.Dd:
      return VirtualDomElements.Dd
    case ElementTags.Dl:
      return VirtualDomElements.Dl
    case ElementTags.Figcaption:
      return VirtualDomElements.Figcaption
    case ElementTags.Figure:
      return VirtualDomElements.Figure
    case ElementTags.Hr:
      return VirtualDomElements.Hr
    case ElementTags.Li:
      return VirtualDomElements.Li
    case ElementTags.Ol:
      return VirtualDomElements.Ol
    case ElementTags.P:
      return VirtualDomElements.P
    case ElementTags.Pre:
      return VirtualDomElements.Pre
    case ElementTags.A:
      return VirtualDomElements.A
    case ElementTags.Abbr:
      return VirtualDomElements.Abbr
    case ElementTags.Br:
      return VirtualDomElements.Br
    case ElementTags.Cite:
      return VirtualDomElements.Cite
    case ElementTags.Data:
      return VirtualDomElements.Data
    case ElementTags.Time:
      return VirtualDomElements.Time
    case ElementTags.Tfoot:
      return VirtualDomElements.Tfoot
    case ElementTags.Img:
      return VirtualDomElements.Img
    default:
      return VirtualDomElements.Div
  }
}
