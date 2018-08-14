import deepClone from 'lodash.clonedeep';
import { BehaviorSubject } from 'rxjs';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const points = {
  0: 0.0,
  1: 0.5,
  2: 1.0,
  3: 0.5,
  4: 0.0
}

function calculateFloats(cards) {
  const numberOfFloats = cards.reduce(
    (totalFloats, card) => totalFloats + points[Math.floor((card - 1)/12)], 0)

  return Math.ceil(numberOfFloats);
}

function resolveBets(game) {
  const [king, prince] = Object.keys(game.bets)
    .map(userId => ({id: userId, bet: game.bets[userId]}))
    .sort((a, b) => a.bet < b.bet ? 1 : -1)
    .map(x => x.id);
  game.previousBets = {...game.bets};
  game.previousPlayers = deepClone(game.players);
  game.players.forEach(player => {
    if (player.id === king) {
      player.waterLevel = Math.min(game.waterLevels1[0], game.waterLevels2[0]);
    }
    if (player.id === prince) {
      player.waterLevel = Math.max(game.waterLevels1[0], game.waterLevels2[0]);
    }
    player.hand = player.hand.filter(card => card !== game.bets[player.id]);
    game.bets[player.id] = null;
  });
  game.waterLevels1 = game.waterLevels1.slice(1);
  game.waterLevels2 = game.waterLevels2.slice(1);
}

function updateFloatsAndStatus(game) {
  const maxLevel = Math.max(...game.players.filter(p => p.active).map(p => p.waterLevel));
  let hasOnePlayerDied = false;
  game.players.forEach(player => {
    if (player.waterLevel === maxLevel) {
      if (player.remainingFloats === 0) {
        player.active = false;
        hasOnePlayerDied = true;
      } else {
        player.remainingFloats--;
      }
    }
  })
  if (hasOnePlayerDied) {
    updateFloatsAndStatus(game);
  }
}

function goToNextGame(game) {
  const [minWaterLevel] = Array.from(game.players)
    .sort((a, b) => a.waterLevel < b.waterLevel ? 1 : -1)
    .map(player => player.waterLevel)
  ;

  const nbPlayers = Object.keys(game.players).length;
  let previousHand = game.players[nbPlayers - 1].startingHand;

  game.players.forEach((player, i) => {
    // Pass hand
    const tmp = player.startingHand;
    player.startingHand = Array.from(previousHand);
    player.hand = Array.from(previousHand);
    previousHand = tmp;

    // Count points
    player.points += player.active ? player.remainingFloats : -1;
    if ((player.waterLevel === minWaterLevel) && player.active) player.points += 1

    // Reset status
    player.active = true;
    const floats = calculateFloats(player.hand);
    player.totalFloats = floats;
    player.remainingFloats = floats;
    player.waterLevel = 0;
  })

  // Reset the state
  game.waterLevels1 = shuffle(Array.from({length: 12}, (v, k) => k+1));
  game.waterLevels2 = shuffle(Array.from({length: 12}, (v, k) => k+1));
  Object.keys(game.bets).forEach(playerId => game.bets[playerId] = null);
  game.previousBets = null;
  game.previousPlayers = null;

  game.turn += 1;
}

export default class GameService {
  constructor() {
    this.game = new BehaviorSubject({})
  }

  createGame(admin) {
    const game = {
      adminId: admin.id,
      players: [
        {...admin}
      ],
      status: 'waiting'
    }
    this.game.next(game);

    return 0;
  }

  fakeJoin(gameId, user) {
    const game = {...this.game.getValue()};
    game.players = game.players.concat(user);
    this.game.next(game);
  }

  startGame(gameId) {
    const game = {...this.game.getValue()};

    const cards = shuffle(Array.from({length: 60}, (v, k) => k+1));
    const waterLevels1 = shuffle(Array.from({length: 12}, (v, k) => k+1));
    const waterLevels2 = shuffle(Array.from({length: 12}, (v, k) => k+1));

    const players = game.players.map(((player, i) => {
      const hand = cards.slice(i * 12, (i + 1) * 12);
      const totalFloats = calculateFloats(hand);

      return {
        ...player,
        totalFloats,
        remainingFloats: totalFloats,
        hand,
        waterLevel: 0,
        startingHand: [...hand],
        active: true,
        points: 0
      }
    }));

    const bets = {};
    players.forEach(player => {
      bets[player.id] = null;
    });

    this.game.next({
      ...game,
      waterLevels1,
      waterLevels2,
      players,
      bets,
      status: 'playing',
      turn: 1
    })
  }

  getGame(gameId) {
    return this.game;
  }

  selectCard(gameId, userId, card) {
    const game = {...this.game.getValue()};
    game.bets[userId] = card;
    this.game.next(game);
  }

  computeTurn(gameId) {
    const game = {...this.game.getValue()};
    resolveBets(game);
    updateFloatsAndStatus(game);
    if (game.waterLevels1.length === 0) {
      if (game.turn === game.players.length - 1) {
        game.status = 'finished';
      } else {
        goToNextGame(game);
      }
    }
    this.game.next(game)
  }
}