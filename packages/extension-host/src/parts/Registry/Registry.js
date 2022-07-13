import VError from 'verror'

export const create = ({ name }) => {
  const providers = Object.create(null)
  return {
    [`register${name}Provider`](provider) {
      providers[provider.id] = provider
    },
    async [`execute${name}Provider`](textDocumentId, ...params) {
      try {
        const textDocument = {}
        const provider = providers[textDocument.languageId]
        const result = await provider[`provide${name}`]()
        return result
      } catch (error) {
        // @ts-ignore
        throw new VError(error, `Failed to execute ${name} provider`)
      }
    },
  }
}
