import * as ClassNames from '../ClassNames/ClassNames.js'
import * as ProblemStrings from '../ProblemStrings/ProblemStrings.js'
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
    dom.push(text(ProblemStrings.noResultsFoundWithProvidedFilterCriteria()))
  } else {
    dom.push(text(ProblemStrings.noProblemsDetected()))
  }
  return dom
}
