const isNumeric = (word: string) => {
  return !isNaN(Number(word))
}

export const shouldAutoTriggerSuggest = (word: any) => {
  return word && !isNumeric(word)
}
