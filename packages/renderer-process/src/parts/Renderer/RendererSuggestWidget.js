export const renderTemplate = () => {
  const label = document.createElement('div')
  label.className = 'SuggestionItemLabel'

  const root = document.createElement('div')
  root.className = 'SuggestionItem'
  root.append(label)

  return {
    root,
    label,
  }
}

export const renderElement = (template, data, index) => {
  template.label.textContent = data.label
}
