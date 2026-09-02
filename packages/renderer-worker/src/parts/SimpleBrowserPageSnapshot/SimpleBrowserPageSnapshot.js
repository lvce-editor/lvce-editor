import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const maxCssLength = 1_500_000
const maxNodeCount = 12_000
const maxTextLength = 500_000

const captureCode = `(() => {
  const maxCssLength = ${maxCssLength}
  const maxNodeCount = ${maxNodeCount}
  const maxTextLength = ${maxTextLength}
  const ignoredTags = new Set(['AUDIO', 'EMBED', 'HEAD', 'IFRAME', 'LINK', 'NOSCRIPT', 'OBJECT', 'SCRIPT', 'STYLE', 'VIDEO'])
  const urlAttributes = new Set(['href', 'poster', 'src'])
  const shadowStyleSheets = []
  let nodeCount = 0
  let textLength = 0

  const serializeAttribute = (name, value) => {
    if (name.startsWith('on')) {
      return undefined
    }
    if (textLength >= maxTextLength) {
      return undefined
    }
    const boundedValue = value.slice(0, maxTextLength - textLength)
    textLength += boundedValue.length
    if (urlAttributes.has(name)) {
      try {
        return [name, new URL(boundedValue, document.baseURI).href]
      } catch {
        return undefined
      }
    }
    if (name === 'class') {
      return ['className', boundedValue]
    }
    if (name === 'type') {
      return ['inputType', boundedValue]
    }
    if (name === 'id' || name === 'style' || name === 'title' || name === 'alt' || name === 'role' || name.startsWith('data-')) {
      return [name, boundedValue]
    }
    if (name === 'checked' || name === 'disabled' || name === 'selected') {
      return [name, true]
    }
    return undefined
  }

  const serializeNode = (node) => {
    if (nodeCount >= maxNodeCount) {
      return undefined
    }
    if (node.nodeType === Node.TEXT_NODE) {
      if (textLength >= maxTextLength) {
        return undefined
      }
      const text = node.data.slice(0, maxTextLength - textLength)
      textLength += text.length
      nodeCount++
      return text ? { type: '#text', text } : undefined
    }
    if (node.nodeType !== Node.ELEMENT_NODE || ignoredTags.has(node.tagName)) {
      return undefined
    }
    nodeCount++
    const attributes = {}
    for (const attribute of node.attributes) {
      const serialized = serializeAttribute(attribute.name, attribute.value)
      if (serialized) {
        const [name, value] = serialized
        attributes[name] = value
      }
    }
    if (node.tagName === 'IMG' && node.currentSrc && textLength < maxTextLength) {
      const src = node.currentSrc.slice(0, maxTextLength - textLength)
      attributes.src = src
      textLength += src.length
    }
    const children = []
    const shadowRoot = node.shadowRoot
    if (shadowRoot) {
      shadowStyleSheets.push(...shadowRoot.adoptedStyleSheets)
      for (const style of shadowRoot.querySelectorAll('style')) {
        if (style.sheet) {
          shadowStyleSheets.push(style.sheet)
        }
      }
    }
    for (const child of shadowRoot ? shadowRoot.childNodes : node.childNodes) {
      const serialized = serializeNode(child)
      if (serialized) {
        children.push(serialized)
      }
    }
    return { type: node.tagName.toLowerCase(), attributes, children }
  }

  const rewriteUrls = (css, baseUrl) => css.replace(/url\\(\\s*(['"]?)([^'"\\)]+)\\1\\s*\\)/gi, (match, quote, value) => {
    const trimmed = value.trim()
    if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('#')) {
      return match
    }
    try {
      return 'url("' + new URL(trimmed, baseUrl).href.replaceAll('"', '%22') + '")'
    } catch {
      return match
    }
  })

  const dom = serializeNode(document.documentElement)
  const sheets = [...document.styleSheets, ...document.adoptedStyleSheets, ...shadowStyleSheets]
  const cssParts = []
  let cssLength = 0
  const addRules = (sheet, seen) => {
    if (!sheet || seen.has(sheet) || cssLength >= maxCssLength) {
      return
    }
    seen.add(sheet)
    for (const rule of sheet.cssRules) {
      if (rule.styleSheet) {
        addRules(rule.styleSheet, seen)
        continue
      }
      const rewritten = rewriteUrls(rule.cssText, sheet.href || document.baseURI)
      if (cssLength + rewritten.length + 1 > maxCssLength) {
        return
      }
      cssParts.push(rewritten)
      cssLength += rewritten.length + 1
    }
  }

  const seen = new Set()
  for (const sheet of new Set(sheets)) {
    if (cssLength >= maxCssLength) {
      break
    }
    try {
      addRules(sheet, seen)
    } catch {
      // Cross-origin stylesheets do not expose cssRules. The rest of the snapshot is still useful.
    }
  }

  return {
    css: cssParts.join('\\n'),
    dom,
    url: location.href,
  }
})()`

const elementTypes = {
  a: VirtualDomElements.A,
  abbr: VirtualDomElements.Abbr,
  article: VirtualDomElements.Article,
  aside: VirtualDomElements.Aside,
  audio: VirtualDomElements.Audio,
  blockquote: VirtualDomElements.BlockQuote,
  br: VirtualDomElements.Br,
  button: VirtualDomElements.Button,
  canvas: VirtualDomElements.Canvas,
  cite: VirtualDomElements.Cite,
  code: VirtualDomElements.Code,
  col: VirtualDomElements.Col,
  colgroup: VirtualDomElements.ColGroup,
  data: VirtualDomElements.Data,
  dd: VirtualDomElements.Dd,
  del: VirtualDomElements.Del,
  dl: VirtualDomElements.Dl,
  dt: VirtualDomElements.Dt,
  em: VirtualDomElements.Em,
  figcaption: VirtualDomElements.Figcaption,
  figure: VirtualDomElements.Figure,
  footer: VirtualDomElements.Footer,
  form: VirtualDomElements.Form,
  h1: VirtualDomElements.H1,
  h2: VirtualDomElements.H2,
  h3: VirtualDomElements.H3,
  h4: VirtualDomElements.H4,
  h5: VirtualDomElements.H5,
  h6: VirtualDomElements.H6,
  header: VirtualDomElements.Header,
  hr: VirtualDomElements.Hr,
  html: VirtualDomElements.Html,
  i: VirtualDomElements.I,
  img: VirtualDomElements.Img,
  input: VirtualDomElements.Input,
  ins: VirtualDomElements.Ins,
  kbd: VirtualDomElements.Kbd,
  label: VirtualDomElements.Label,
  li: VirtualDomElements.Li,
  main: VirtualDomElements.Main,
  nav: VirtualDomElements.Nav,
  ol: VirtualDomElements.Ol,
  option: VirtualDomElements.Option,
  p: VirtualDomElements.P,
  pre: VirtualDomElements.Pre,
  q: VirtualDomElements.Quote,
  search: VirtualDomElements.Search,
  section: VirtualDomElements.Section,
  select: VirtualDomElements.Select,
  span: VirtualDomElements.Span,
  strong: VirtualDomElements.Strong,
  table: VirtualDomElements.Table,
  tbody: VirtualDomElements.TBody,
  td: VirtualDomElements.Td,
  textarea: VirtualDomElements.TextArea,
  tfoot: VirtualDomElements.Tfoot,
  th: VirtualDomElements.Th,
  thead: VirtualDomElements.THead,
  time: VirtualDomElements.Time,
  tr: VirtualDomElements.Tr,
  ul: VirtualDomElements.Ul,
  video: VirtualDomElements.Video,
}

const inlineFallbackTags = new Set(['b', 'big', 'mark', 's', 'small', 'sub', 'sup', 'u'])

const getElementType = (tagName) => {
  return elementTypes[tagName] || (inlineFallbackTags.has(tagName) ? VirtualDomElements.Span : VirtualDomElements.Div)
}

const addClassName = (attributes, className) => {
  return {
    ...attributes,
    className: attributes.className ? `${className} ${attributes.className}` : className,
  }
}

const toVirtualDom = (node) => {
  if (!node) {
    return []
  }
  if (node.type === '#text') {
    return [{ type: VirtualDomElements.Text, text: node.text, childCount: 0 }]
  }
  const children = node.children || []
  let attributes = node.attributes || {}
  if (node.type === 'html') {
    attributes = addClassName(attributes, 'SimpleBrowserPreviewDocument')
  } else if (node.type === 'body') {
    attributes = addClassName(attributes, 'SimpleBrowserPreviewBody')
  }
  const result = [
    {
      type: node.type === 'body' ? VirtualDomElements.Div : getElementType(node.type),
      ...attributes,
      childCount: children.length,
    },
  ]
  for (const child of children) {
    result.push(...toVirtualDom(child))
  }
  return result
}

const getDomainShort = (url) => {
  try {
    const parts = new URL(url).hostname.split('.').filter(Boolean)
    return parts.slice(-2).join('-') || 'page'
  } catch {
    return 'page'
  }
}

export const capture = async (browserViewId) => {
  const snapshot = await ElectronWebContentsViewFunctions.insertJavaScript(browserViewId, captureCode)
  const dom = toVirtualDom(snapshot?.dom)
  if (dom.length === 0) {
    throw new Error('Simple Browser page snapshot contained no DOM')
  }
  return {
    css: typeof snapshot.css === 'string' ? snapshot.css : '',
    dom,
    key: `webcontents-snapshot-${getDomainShort(snapshot.url)}`,
  }
}

export const getScopedCss = (css) => {
  return `.SimpleBrowserPreview {\n${css}\n}`
}

export const getStyleSheetId = (uid) => {
  return `simple-browser-preview-${uid}`
}
