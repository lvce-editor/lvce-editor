const validateResult = (result, resultShape) => {
  // TODO use json schema to validate result
  return undefined
}

export const create = ({ name, resultShape, textDocumentRegistry }) => {
  const providers = Object.create(null)
  return {
    [`register${name}Provider`](provider) {
      providers[provider.languageId] = provider
    },
    async [`execute${name}Provider`](textDocumentId, ...params) {
      try {
        const textDocument = textDocumentRegistry.get(textDocumentId)
        const provider = providers[textDocument.languageId]
        console.log(provider)
        const methodName =
          resultShape.type === 'array' ? `provide${name}s` : `provide${name}`
        const result = await provider[methodName](textDocumentId, ...params)
        const error = validateResult(result, resultShape)
        if (error) {
          throw error
        }
        return result
      } catch (error) {
        const lowerCaseName = name.toLowerCase()
        throw new Error(`Failed to execute ${lowerCaseName} provider`, {
          // @ts-ignore
          cause: error,
        })
      }
    },
  }
}
