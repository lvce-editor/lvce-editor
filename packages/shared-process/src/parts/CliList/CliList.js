import * as ExtensionList from '../ExtensionList/ExtensionList.js'
import * as Json from '../Json/Json.js'

export const handleCliArgs = async (argv, console) => {
  const extensions = await ExtensionList.list()
  console.info(Json.stringify(extensions))
}
