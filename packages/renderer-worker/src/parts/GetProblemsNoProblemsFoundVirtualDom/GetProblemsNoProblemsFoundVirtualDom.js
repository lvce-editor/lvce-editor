import * as ClassNames from '../ClassNames/ClassNames.js'
import * as ViewletProblemsStrings from '../ViewletProblems/ViewletProblemsStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getProblemsNoProblemsFoundVirtualDom = (filterValue) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: ClassNames.Message,
    childCount: 1,
  })
  if (filterValue) {
    // TODO use i18nstring
    dom.push(text('No results found with provided filter criteria.'))
  } else {
    dom.push(text(ViewletProblemsStrings.noProblemsDetected()))
  }
  return dom
}
