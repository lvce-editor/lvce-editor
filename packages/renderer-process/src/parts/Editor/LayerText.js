import * as Assert from '../Assert/Assert.js'
import * as SetBounds from '../SetBounds/SetBounds.js'

const create$Row = () => {
  const $Row = document.createElement('div')
  $Row.className = 'EditorRow'
  return $Row
}

const create$Token = () => {
  const $Token = document.createElement('span')
  $Token.className = 'Token'
  return $Token
}

// TODO maybe use createTextNode (codeMirror uses that)
// This function seems to be a hot spot
const render$Token = ($Token, text, className) => {
  $Token.className = className
  if ($Token.firstChild) {
    // recycle text node
    $Token.firstChild.nodeValue = text
  } else {
    $Token.textContent = text
  }
}

const render$LineLess = ($Line, lineInfo) => {
  let i = 0
  while (i < $Line.children.length * 2) {
    const text = lineInfo[i++]
    const className = lineInfo[i++]
    render$Token($Line.children[i / 2 - 1], text, className)
  }
  const fragment = document.createDocumentFragment()
  while (i < lineInfo.length) {
    const text = lineInfo[i++]
    const className = lineInfo[i++]
    const $Token = create$Token()
    render$Token($Token, text, className)
    fragment.append($Token)
  }
  $Line.append(fragment)
}

const render$LineEqual = ($Line, lineInfo) => {
  let i = 0
  while (i < lineInfo.length) {
    const text = lineInfo[i++]
    const className = lineInfo[i++]
    render$Token($Line.children[i / 2 - 1], text, className)
  }
}

const render$LineMore = ($Line, lineInfo) => {
  let i = 0
  while (i < lineInfo.length) {
    const text = lineInfo[i++]
    const className = lineInfo[i++]
    render$Token($Line.children[i / 2 - 1], text, className)
  }
  const diff = $Line.children.length - lineInfo.length / 2
  for (let i = lineInfo.length; i < lineInfo.length + diff; i++) {
    $Line.lastChild.remove()
  }
}

const render$Line = ($Line, lineInfo, difference) => {
  if ($Line.children.length < lineInfo.length / 2) {
    render$LineLess($Line, lineInfo)
  } else if ($Line.children.length === lineInfo.length / 2) {
    render$LineEqual($Line, lineInfo)
  } else {
    render$LineMore($Line, lineInfo)
  }
  SetBounds.setXAndYTransform($Line, difference, 100)
}

const render$LinesLess = ($Lines, lineInfos, differences) => {
  for (let i = 0; i < $Lines.children.length; i++) {
    render$Line($Lines.children[i], lineInfos[i], differences[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $Lines.children.length; i < lineInfos.length; i++) {
    const $Line = create$Row()
    render$Line($Line, lineInfos[i], differences[i])
    fragment.append($Line)
  }
  $Lines.append(fragment)
}

const render$LinesEqual = ($Lines, lineInfos, differences) => {
  for (let i = 0; i < lineInfos.length; i++) {
    render$Line($Lines.children[i], lineInfos[i], differences[i])
  }
}

const render$LinesMore = ($Lines, lineInfos, differences) => {
  for (let i = 0; i < lineInfos.length; i++) {
    render$Line($Lines.children[i], lineInfos[i], differences[i])
  }
  const diff = $Lines.children.length - lineInfos.length
  for (let i = lineInfos.length; i < lineInfos.length + diff; i++) {
    $Lines.lastChild.remove()
  }
}

const render$Lines = ($Lines, lineInfos, differences) => {
  Assert.object($Lines)
  Assert.array(lineInfos)
  if ($Lines.children.length < lineInfos.length) {
    render$LinesLess($Lines, lineInfos, differences)
  } else if ($Lines.children.length === lineInfos.length) {
    render$LinesEqual($Lines, lineInfos, differences)
  } else {
    render$LinesMore($Lines, lineInfos, differences)
  }
}

export const setLineInfos = (state, lineInfos, differences) => {
  Assert.object(state)
  Assert.array(lineInfos)
  Assert.array(differences)
  console.log({ lineInfos, differences })
  render$Lines(state.$LayerText, lineInfos, differences)
}
