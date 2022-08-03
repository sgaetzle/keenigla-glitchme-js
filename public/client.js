import card from './card.js'

const mainCardSlot = document.querySelector(".main-card-slot")
const mainDeckSlot = document.querySelector(".main-deck-slot")
const btnShuffle = document.querySelector(".button-shuffle")
const btnSaveName = document.querySelector(".button-save-name")
const inputName = document.querySelector(".input-nickname")
const nicknameSlot = document.querySelector(".nickname")
const elementtitle = document.querySelector(".title")

const statustext = document.querySelector(".text")
const userlist = document.querySelector(".userlist")

let mainDeck, inRound, stop

mainDeckSlot.addEventListener("click", () => {
  const strnickname = window.sessionStorage.username
  if(strnickname){
    sock.emit('newCard', true)
  }else{
    updateStatusText("Erst Spielernamen speichern!")
  }
})

btnShuffle.addEventListener("click", () => {
  sock.emit('newGame', true)
  statustext.innerHTML = ""
})

btnSaveName.addEventListener("click", () => {
  const strnickname = inputName.value
  window.sessionStorage.username = strnickname
  //alert("nickname: " + strnickname)
  //alert("SaveName: " + window.sessionStorage.username)
  sock.emit('SaveName', strnickname)
  UpdateUsername()
})

elementtitle.addEventListener("dblclick", () => {
  sock.emit('newGame', true)
  statustext.innerHTML = ""
})

userlist.addEventListener("dblclick", () => {
  sock.emit('removePlayers', true)
  statustext.innerHTML = "Alle Spieler gelöscht!"
})

function fupdateDeckCountandCard(deckCount, arrCardsPlayed, useractioned) {
  console.log("deckCount:" + deckCount + ", arrCardsPlayed:"+ arrCardsPlayed + ", user-actioned:" + useractioned)
  //mainDeckElement.innerHTML = deckCount
  mainDeckSlot.innerHTML = ""
  if(deckCount > 0){
    const deckDiv = document.createElement("div")
    deckDiv.innerText = deckCount
    deckDiv.classList.add("main-deck", "deck")
    mainDeckSlot.appendChild(deckDiv)
  }else{
    mainDeckSlot.hidden = true
    btnShuffle.style.visibility = ""
  }
  
  console.log("arrCardsPlayed.length:" + arrCardsPlayed.length)
  
  mainCardSlot.innerHTML = ""
  if(arrCardsPlayed.hasOwnProperty([0])){
    if(arrCardsPlayed[0].suit || arrCardsPlayed[0].value){
      const currentCard = new card(arrCardsPlayed[0].suit,arrCardsPlayed[0].value)
      const cardLayer = (arrCardsPlayed.length % 3)
      const cardType = (arrCardsPlayed.length + 2) % 3
      //console.log("cardLayer0: " + cardLayer)
      console.log("cardType0: " + cardType)
      mainCardSlot.appendChild(currentCard.getHTML(cardType, 2))
    }
  }
  
  if(arrCardsPlayed.hasOwnProperty([1])){
    const playedCard2 = arrCardsPlayed[1].suit
    if(arrCardsPlayed[1].suit || arrCardsPlayed[1].value){
      const currentCard = new card(arrCardsPlayed[1].suit,arrCardsPlayed[1].value)
      const cardLayer = (arrCardsPlayed.length - 1) % 3
      const cardType = (arrCardsPlayed.length + 1) % 3
      //console.log("cardLayer1: " + cardLayer)
      console.log("cardType1: " + cardType)
      mainCardSlot.appendChild(currentCard.getHTML(cardType, 1))
    }
  }
  if(arrCardsPlayed.hasOwnProperty([2])){
    if(arrCardsPlayed[2].suit || arrCardsPlayed[2].value){
      const currentCard = new card(arrCardsPlayed[2].suit,arrCardsPlayed[2].value)
      const cardLayer = (arrCardsPlayed.length - 2) % 3
      const cardType = (arrCardsPlayed.length % 3)
      //console.log("cardLayer2: " + cardLayer)
      console.log("cardType2: " + cardType)
      mainCardSlot.appendChild(currentCard.getHTML(cardType, 0))
    }
  }

  if(useractioned){
    updateStatusText(useractioned + " hat eine Karte gezogen!")
  }
}

function fnewGame(deckCount, useractioned) {
  console.log("deckCount:" + deckCount + ", user-actioned:" + useractioned)
  //mainDeckElement.innerHTML = deckCount
  mainDeckSlot.innerHTML = ""
  if(deckCount > 0){
    mainDeckSlot.hidden = false
    btnShuffle.style.visibility = "hidden"
    const deckDiv = document.createElement("div")
    deckDiv.innerText = deckCount
    deckDiv.classList.add("main-deck", "deck")
    mainDeckSlot.appendChild(deckDiv)
  }
  
  mainCardSlot.innerHTML = ""
  
  if(useractioned){
    updateStatusText(useractioned + " hat neu gemischelt!")
  }
}

function fNameSaved(activeUsers){
  console.log(activeUsers)
  updateUserList(activeUsers)
}

function fDserDisconnected(activeUsers){
  console.log(activeUsers)
  updateUserList(activeUsers)
}

function fActiveUsers(activeUsers){
  console.log(activeUsers)
  updateUserList(activeUsers)
}

function updateStatusText(newText){
  statustext.innerHTML = newText
  const d = new Date()
  const time  = d.getTime()
  statustext.dataset.value = time
  setTimeout(function(){
    if(statustext.dataset.value == time){
      statustext.innerHTML = ""
    }
  }, 3000)
}

function updateUserList(activeUsers){
  userlist.innerHTML = "<h4>Wer spielt mit?</h4>"
  activeUsers.sort()
  activeUsers.forEach(function(username){
    const userelement = document.createElement("div")
    userelement.innerText = username
    userelement.classList.add("user")
    userlist.appendChild(userelement)
  });
}

function UpdateUsername(){
  let strnickname = window.sessionStorage.username
  if(strnickname){
    inputName.value = strnickname
    inputName.hidden = true
    btnSaveName.hidden = true
    //btnShuffle.hidden = false;
    nicknameSlot.innerText = "Du spielst mit als: " + strnickname
    sock.emit('SaveName', strnickname)
  }else{
    btnShuffle.style.visibility = "hidden";
  }
}

const sock = io();
sock.on('updateDeckCountandCard', fupdateDeckCountandCard)
sock.on('NameSaved', fNameSaved)
sock.on('user disconnected', fDserDisconnected)
sock.on('newGame', fnewGame)
sock.on('ActiveUsers', fActiveUsers)

sock.emit('joinGame', true);

UpdateUsername()