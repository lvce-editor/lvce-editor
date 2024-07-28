import * as CommandId from '../CommandId/CommandId.ts'
import * as TokenizeCodeBlock from '../TokenizeCodeBlock/TokenizeCodeBlock.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'

export const commandMap = {
  [CommandId.TokenizeCodeBlock]: TokenizeCodeBlock.tokenizeCodeBlock,
  [CommandId.LoadTokenizer]: Tokenizer.loadTokenizer,
}
