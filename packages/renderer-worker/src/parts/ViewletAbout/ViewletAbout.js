export const create = () => {
  return {
    productName: '',
    version: '',
    commit: '',
    date: '',
    browser: '',
  }
}

export const loadContent = async (state) => {
  return {
    ...state,
    productName: 'Lvce Editor',
    version: '0.0.0-dev',
    commit: 'abc',
    date: '',
    browser: '',
  }
}
