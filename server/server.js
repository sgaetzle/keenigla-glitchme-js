/*var express = require("express");
var app = express(); 
var serv = require("http").Server(app);
var io = require("socket.io")(serv);
app.use(express.static('public'));*/

/*app.get('/', function(request, response) {
  response.sendFile(__dirname + '/src/pages/index.hbs');
});*/

/*const listener = serv.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});*/

// Static files
//app.use(express.static("public"));

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
//const Deck = require('./deck')

const app = express();

const clientPath = `${__dirname}/../public`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);
const activeUsers = new Set();

io.on('connection', (sock) => {
  sock.on('newGame', (bnewGame) => {
    //console.log("newGame: " + bnewGame)
    if(bnewGame == true){
      startGame(sock);
    }
  });
  sock.on('joinGame', (bjoinGame) => {
    //console.log("joinGame: " + bjoinGame)
    if(bjoinGame == true){
      joinGame();
    }
  });
  sock.on('newCard', (bnewCard) => {
    //console.log("newGame: " + bnewGame)
    if(bnewCard == true){
      newCard(sock);
    }
  });
  /*sock.on('SaveName', (nickname) => {
    console.log("SaveName: " + nickname)
    addPlayer(sock, nickname)
  });*/

  sock.on("SaveName", (data) => {
    sock.userId = data
    activeUsers.add(data)
    console.log(activeUsers)
    io.emit("NameSaved", [...activeUsers])
  });

  sock.on("removePlayers", (bremovePlayers) => {
    if(bremovePlayers == true){
      //console.log("removePlayers: activeUsers: " + activeUsers.size)
      activeUsers.clear()
      //console.log("removePlayers: activeUsers: " + activeUsers.size)
      io.emit("NameSaved", [...activeUsers])
    }
    //activeUsers.add(data)
    //console.log(activeUsers)
    
  });
  
  sock.on("disconnect", () => {
    activeUsers.delete(sock.userId);
    //console.log(sock.userId)
    //console.log(activeUsers)
    io.emit("user disconnected", [...activeUsers])
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(process.env.PORT, () => {
  console.log('RPS started 3 on ' + process.env.PORT);
});


class Players {
  constructor() {
    this.players = []
  }

  addPlayer(sock, nickname) {
    const player = [sock, nickname]
    this.players.push(player)
    console.log(this.players)
  }
}


const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
]

class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards
    //console.log("constructor: (0)"+ cards[0].suit + "/" + cards[0].value + "(1)"+ cards[1].suit + "/" + cards[1].value)
    this.cardsplayed = []
  }

  get numberOfCards() {
    return this.cards.length
  }
  
  get cardsPlayed(){
    return this.cardsplayed
  }

  newCard() {
    if(this.numberOfCards >= 1){      
      const newCard = new Card(this.cards[0].suit, this.cards[0].value)
      this.cardsplayed.unshift(newCard)
      
      this.cards.shift()
    }
    return
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit
    this.value = value
  }
}

function freshDeck() {
  const deck = SUITS.flatMap(suit => {
    return VALUES.map(value => {
      return new Card(suit, value)
    })
  })
  
  // Shuffle
  //console.log("freshDeck: deck.lenght: "+ deck.length)
  for (let i = deck.length - 1; i > 0; i--) {
    const newIndex = Math.floor(Math.random() * (i + 1))
    const oldValue = deck[newIndex]
    deck[newIndex] = deck[i]
    //console.log("freshDeck: newIndex" + newIndex)
    deck[i] = oldValue
  }
  return deck
}

let mainDeck = new Deck() //, inRound, stop;
let players = new Players()

//startGame()
function startGame(sock) {
  //console.log("startGame")
  let newDeck = new Deck()

  mainDeck = new Deck(newDeck.cards)
  
  let username = sock.userId
  io.emit('newGame', mainDeck.numberOfCards, username)
}

function newCard(sock){
  if(sock.userId){
    //console.log("newCard")
    mainDeck.newCard()
    
    let username = sock.userId
    //console.log("username: " + username)
    sendUpdate(mainDeck.numberOfCards, mainDeck.cardsPlayed, username)
  }
}

function sendUpdate(numberOfCards, CardSuit, CardValue, username){
  io.emit('updateDeckCountandCard', numberOfCards, CardSuit, CardValue, username)
}

function joinGame(){
  //console.log("joinGame")  
  sendUpdate(mainDeck.numberOfCards, mainDeck.cardsPlayed)
  io.emit("ActiveUsers", [...activeUsers])
}

function addPlayer(sock, nickname){
  players.addPlayer(sock, nickname)
}