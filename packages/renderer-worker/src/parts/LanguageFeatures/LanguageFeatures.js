export const state = {
  contributions: Object.create(null),
}

export const registerContribution = (contribution) => {
  state.contributions.push(contribution)
}
