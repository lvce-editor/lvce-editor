import * as TokenizeCodeBlock from '../TokenizeCodeBlock/TokenizeCodeBlock.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'

export const commandMap = {
  'Tokenizer.tokenizeCodeBlock': TokenizeCodeBlock.tokenizeCodeBlock,
  'Tokenizer.load': Tokenizer.loadTokenizer,
}
