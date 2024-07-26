import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as GetReplaceAllConfirmText from '../GetReplaceAllConfirmText/GetReplaceAllConfirmText.js'
import * as TextSearchReplaceAll from '../TextSearchReplaceAll/TextSearchReplaceAll.js'
import * as ViewletSearchStrings from '../ViewletSearch/ViewletSearchStrings.ts'

export const replaceAllAndPrompt = async (workspacePath, items, replacement, matchCount, fileCount) => {
  Assert.string(workspacePath)
  Assert.array(items)
  Assert.string(replacement)
  Assert.number(matchCount)
  Assert.number(fileCount)
  const confirmTitle = ViewletSearchStrings.replaceAll()
  const confirmAccept = ViewletSearchStrings.replace()
  const confirmText = GetReplaceAllConfirmText.getReplaceAllConfirmText(matchCount, fileCount, replacement)
  const shouldReplace = await Command.execute('ConfirmPrompt.prompt', confirmText, { title: confirmTitle, confirmMessage: confirmAccept })
  if (!shouldReplace) {
    return false
  }
  await TextSearchReplaceAll.replaceAll(workspacePath, items, replacement)
  return true
}
