import * as ViewletManagerVisitorCss from '../ViewletManagerVisitorCss/ViewletManagerVisitorCss.js'
import * as ViewletManagerVisitorMenuEntries from '../ViewletManagerVisitorMenuEntries/ViewletManagerVisitorMenuEntries.js'

const visitors = [ViewletManagerVisitorCss, ViewletManagerVisitorMenuEntries]

export const loadModule = async (id, module) => {
  for (const visitor of visitors) {
    await visitor.loadModule(id, module)
  }
}
