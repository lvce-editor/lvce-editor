const includesWord = (completionItem, word) => {
  return completionItem.label.includes(word)
}

export const filterCompletionItems = (completionItems, word) => {
  const filteredCompletions = []
  for (const completionItem of completionItems) {
    if (includesWord(completionItem, word)) {
      filteredCompletions.push(completionItem)
    }
  }
  return filteredCompletions
}
