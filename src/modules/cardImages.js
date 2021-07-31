let cardImages = []

function addAnimalImage (src) {
  cardImages.push({ src })
}

for (let i = 1; i <= 12; i++) {
  addAnimalImage(`images/animals/animal-${i}.svg`)
}

export default cardImages
