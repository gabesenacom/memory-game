let cardImages = []

function addAnimalImage (src) {
  cardImages.push({ src })
}

for (let i = 1; i <= 7; i++) {
  addAnimalImage(`images/animal${i}.png`)
}

export default cardImages
