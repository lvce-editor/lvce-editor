import * as GetReferenceWithPreview from '../GetReferenceWithPreview/GetReferenceWithPreview.js'
import * as References from '../References/References.js'

export const getReferencesWithPreview = async (editor) => {
  const references = await References.getReferences(editor)
  const withPreview = await Promise.all(references.map(GetReferenceWithPreview.getReferenceWithPreview))
  return withPreview
}
