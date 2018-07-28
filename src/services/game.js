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
  game.players.forEach(player => {
    if (player.id === king) {
      player.waterLevel = Math.min(game.waterLevels1[0], game.waterLevels2[0]);
    }
    if (player.id === prince) {
      player.waterLevel = Math.max(game.waterLevels1[0], game.waterLevels2[0]);
    }
    player.hand = player.hand.filter(card => card != game.bets[player.id]);
    game.bets[player.id] = null;
  });
  game.waterLevels1 = game.waterLevels1.slice(1);
  game.waterLevels2 = game.waterLevels2.slice(1);
}

function updateFloats(game) {
  const maxLevel = Math.max(...game.players.map(p => p.waterLevel));
  game.players.forEach(player => {
    if (player.waterLevel === maxLevel) {
      player.remainingFloats--;
    }
  })
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

      return {...player, totalFloats, remainingFloats: totalFloats, hand, waterLevel: 0}
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
      status: 'playing'
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
    updateFloats(game);
    this.game.next(game)
  }
}