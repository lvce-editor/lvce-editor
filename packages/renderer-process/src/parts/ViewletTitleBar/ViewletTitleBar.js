import * as Layout from '../Layout/Layout.js'

export const create = () => {
  // TODO set aria label for title bar menu
  // TODO add tests for aria properties
  const $TitleBar = Layout.state.$TitleBar
  $TitleBar.ariaLabel = 'Title Bar'
  $TitleBar.role = 'contentinfo'
  return {
    $TitleBar,
    $Viewlet: $TitleBar,
  }
}
