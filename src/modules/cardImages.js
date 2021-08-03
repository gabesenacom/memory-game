import Animal1 from '../assets/images/animals/animal-1.svg'
import Animal2 from '../assets/images/animals/animal-2.svg'
import Animal3 from '../assets/images/animals/animal-3.svg'
import Animal4 from '../assets/images/animals/animal-4.svg'
import Animal5 from '../assets/images/animals/animal-5.svg'
import Animal6 from '../assets/images/animals/animal-6.svg'
import Animal7 from '../assets/images/animals/animal-7.svg'
import Animal8 from '../assets/images/animals/animal-8.svg'
import Animal9 from '../assets/images/animals/animal-9.svg'
import Animal10 from '../assets/images/animals/animal-10.svg'
import Animal11 from '../assets/images/animals/animal-11.svg'
import Animal12 from '../assets/images/animals/animal-12.svg'

const animalImages = [
  Animal1,
  Animal2,
  Animal3,
  Animal4,
  Animal5,
  Animal6,
  Animal7,
  Animal8,
  Animal9,
  Animal10,
  Animal11,
  Animal12,
]

let cardImages = []

function addAnimalImage (src) {
  cardImages.push({ src })
}

for (let i = 0; i <= 11; i++) {
  addAnimalImage(animalImages[i])
}

export default cardImages
