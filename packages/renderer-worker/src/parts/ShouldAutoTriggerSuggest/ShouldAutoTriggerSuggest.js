const isNumeric = (word) => {
  return !isNaN(Number(word))
}

export const shouldAutoTriggerSuggest = (word) => {
  return word && !isNumeric(word)
}
