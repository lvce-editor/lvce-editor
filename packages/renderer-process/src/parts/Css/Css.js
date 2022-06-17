export const setInlineStyle = (id, css) => {
  const $ExistingStyle = document.getElementById(id)
  if ($ExistingStyle) {
    $ExistingStyle.textContent = css
  } else {
    const $Style = document.createElement('style')
    $Style.id = id
    $Style.textContent = css
    document.head.append($Style)
  }
}
