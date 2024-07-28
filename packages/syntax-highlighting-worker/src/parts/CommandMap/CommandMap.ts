import * as CommandId from '../CommandId/CommandId.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import * as TokenizeCodeBlock from '../TokenizeCodeBlock/TokenizeCodeBlock.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'

export const commandMap = {
  [CommandId.TokenizeCodeBlock]: TokenizeCodeBlock.tokenizeCodeBlock,
  [CommandId.LoadTokenizer]: Tokenizer.loadTokenizer,
  [CommandId.HandleMessagePort]: HandleMessagePort.handleMessagePort,
}
