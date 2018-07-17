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
}