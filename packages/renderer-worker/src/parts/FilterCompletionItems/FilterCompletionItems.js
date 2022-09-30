export const filterCompletionItems = (completionItems, word) => {
  const includesWord = (completionItem) => {
    return completionItem.label.includes(word)
  }
  const filteredCompletions = completionItems.filter(includesWord)
  return filteredCompletions
}
