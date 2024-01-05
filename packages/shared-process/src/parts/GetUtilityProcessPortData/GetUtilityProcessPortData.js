export const getUtilityProcessPortData = (event) => {
  const { data, ports } = event
  if (ports.length === 0) {
    return data
  }
  return {
    ...data,
    params: [...ports, ...data.params],
  }
}
