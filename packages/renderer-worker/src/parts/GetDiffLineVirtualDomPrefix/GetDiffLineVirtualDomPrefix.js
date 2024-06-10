import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DiffType from '../DiffType/DiffType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const deletion = {
  type: VirtualDomElements.Div,
  className: ClassNames.EditorRowDeletion,
  childCount: 1,
}

const insertion = {
  type: VirtualDomElements.Div,
  className: ClassNames.EditorRowInsertion,
  childCount: 1,
}

const normal = {
  type: VirtualDomElements.Div,
  className: ClassNames.EditorRow,
  childCount: 1,
}

export const getPrefix = (type) => {
  switch (type) {
    case DiffType.Insertion:
      return insertion
    case DiffType.Deletion:
      return deletion
    case DiffType.None:
      return normal
  }
}
