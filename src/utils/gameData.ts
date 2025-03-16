
export type Dare = {
  id: number;
  text: string;
  action: 'takeShots' | 'skipTurn' | 'challenge' | 'wildcard';
  value?: number;
};

export const dares: Dare[] = [
  { id: 1, text: "Take 2 shots!", action: 'takeShots', value: 2 },
  { id: 2, text: "Skip a turn!", action: 'skipTurn' },
  { id: 3, text: "Karaoke Challenge! Sing a Filipino song", action: 'challenge' },
  { id: 4, text: "Truth or Tagay! Answer a question or take a shot", action: 'wildcard' },
  { id: 5, text: "Take a shot with someone of your choice", action: 'takeShots', value: 1 },
  { id: 6, text: "Group Toast! Everyone takes a shot", action: 'takeShots', value: 1 },
  { id: 7, text: "Dance Challenge! Show your best moves", action: 'challenge' },
  { id: 8, text: "Take 3 shots!", action: 'takeShots', value: 3 },
  { id: 9, text: "Skip two turns!", action: 'skipTurn', value: 2 },
  { id: 10, text: "Tagalog Tongue Twister Challenge", action: 'challenge' },
  { id: 11, text: "Lucky! No shots this round", action: 'skipTurn' },
  { id: 12, text: "Fastest Shot Challenge! Race with another player", action: 'challenge' }
];

export const getRandomDare = (): Dare => {
  const randomIndex = Math.floor(Math.random() * dares.length);
  return dares[randomIndex];
};

export type DiceFace = {
  value: number;
  color: string;
};

export const diceFaces: DiceFace[] = [
  { value: 1, color: 'bg-purple-500' },
  { value: 2, color: 'bg-blue-500' },
  { value: 3, color: 'bg-green-500' },
  { value: 4, color: 'bg-yellow-500' },
  { value: 5, color: 'bg-orange-500' },
  { value: 6, color: 'bg-red-500' }
];

export const rollDice = (): number => {
  return Math.floor(Math.random() * 6) + 1;
};
