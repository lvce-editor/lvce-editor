const githubRepositoryPrefix = 'github.com/'

export const getBuiltinExtensionRepository = (extension) => {
  if (!extension.repository.startsWith(githubRepositoryPrefix)) {
    throw new Error(`expected extension repository to start with ${githubRepositoryPrefix}`)
  }
  return extension.repository.slice(githubRepositoryPrefix.length)
}
