import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
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
    dom[0].childCount += 2
    dom.push(
      {
        type: VirtualDomElements.Span,
        childCount: 1,
      },
      text(ProblemStrings.noResultsFoundWithProvidedFilterCriteria()),
      {
        type: VirtualDomElements.A,
        className: ClassNames.MessageAction,
        childCount: 1,
        onClick: DomEventListenerFunctions.HandleClearFilterClick,
      },
      text(ProblemStrings.clearFilter()),
      text('.'),
    )
  } else {
    dom.push(text(ProblemStrings.noProblemsDetected()))
  }
  return dom
}
