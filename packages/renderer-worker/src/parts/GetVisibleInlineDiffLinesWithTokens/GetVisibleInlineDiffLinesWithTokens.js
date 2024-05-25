import * as GetTokensViewport from '../GetTokensViewport/GetTokensViewport.js'
import * as GetVisibleDiffLines from '../GetVisibleDiffLines/GetVisibleDiffLines.js'
import * as MergeDiffLinesWithTokens from '../MergeDiffLinesWithTokens/MergeDiffLinesWithTokens.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'

export const getVisibleInlineDiffLinesWithTokens = (lines, changes, minLineY, maxLineY, languageId) => {
  const visible = GetVisibleDiffLines.getVisibleDiffLines(lines, changes, minLineY, maxLineY)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const { tokens } = GetTokensViewport.getTokensViewport(
    {
      invalidStartIndex: 0,
      lineCache: [],
      tokenizer,
      lines,
      languageId,
    },
    minLineY,
    Math.min(lines.length, maxLineY),
  )
  const merged = MergeDiffLinesWithTokens.mergeDiffLinesWithTokens(visible, tokens, tokenizer.TokenMap)
  return merged
}
