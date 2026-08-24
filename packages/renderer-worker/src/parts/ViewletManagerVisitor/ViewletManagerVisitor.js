import * as ViewletManagerVisitorCss from '../ViewletManagerVisitorCss/ViewletManagerVisitorCss.js'
import * as ViewletManagerVisitorMenuEntries from '../ViewletManagerVisitorMenuEntries/ViewletManagerVisitorMenuEntries.js'

const visitors = [ViewletManagerVisitorMenuEntries]

export const loadModule = async (id, module) => {
  for (const visitor of visitors) {
    await visitor.loadModule(id, module)
  }
}

export const loadInstance = (id, module) => {
  return ViewletManagerVisitorCss.loadInstance(id, module)
}

export const disposeInstance = (id, module) => {
  return ViewletManagerVisitorCss.disposeInstance(id, module)
}
