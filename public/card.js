export default class Card {
    constructor(suit, value) {
      this.suit = suit
      this.value = value
    }
  
    get color() {
      return this.suit === "♣" || this.suit === "♠" ? "black" : "red"
    }
  
    getHTML(icardtype, icardlayer) {
      const cardDiv = document.createElement("div")
      cardDiv.innerText = this.suit
      cardDiv.classList.add("card", "card"+icardtype, this.color)
      cardDiv.dataset.value = `${this.value} ${this.suit}`
      cardDiv.style.zIndex = `${icardlayer}`
      return cardDiv
    }
  }
  