const createPlayer = (name, imageSrc, id) => {
  return { name, imageSrc, id, finish_line: 2 }
}

function getPlayerById (array, id) {
  return array.filter(player => player.id === id)[0]
}

export { createPlayer, getPlayerById }
