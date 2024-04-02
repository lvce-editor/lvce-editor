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
    dom[0].childCount++
    dom.push(
      {
        type: VirtualDomElements.Span,
        childCount: 1,
      },
      text(ProblemStrings.noResultsFoundWithProvidedFilterCriteria()),
      {
        type: VirtualDomElements.A,
        className: 'MessageAction',
        childCount: 1,
        onClick: 'handleClearFilterClick',
      },
      text(ProblemStrings.clearFilter()),
    )
  } else {
    dom.push(text(ProblemStrings.noProblemsDetected()))
  }
  return dom
}
