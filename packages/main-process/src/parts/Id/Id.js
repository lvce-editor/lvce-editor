exports.state = {
  id: 0,
}

exports.create = () => {
  return ++exports.state.id
}
