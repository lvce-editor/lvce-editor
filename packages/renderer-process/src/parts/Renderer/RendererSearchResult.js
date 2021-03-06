export const renderTemplate = () => {
  const label = document.createElement('div')
  label.className = 'SearchResultLabel'
  const root = document.createElement('div')
  root.className = 'ListItem SearchResults'
  root.setAttribute('role', 'option')
  root.append(label)
  return {
    root,
    label,
  }
}

export const renderElement = (template, data, index) => {
  template.label.textContent = data.text
  template.root.id = `item-${index}`
  template.root.dataset.index = index
}
