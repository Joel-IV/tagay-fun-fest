
export type Player = {
  id: string;
  name: string;
  shotsTaken: number;
  skippedTurns: number;
  timeRecord: number[];
  isActive: boolean;
};

export type GameSettings = {
  countdownDuration: number;
  maxShots: number;
};

const PLAYERS_KEY = 'tagaytracker_players';
const SETTINGS_KEY = 'tagaytracker_settings';
const CURRENT_PLAYER_KEY = 'tagaytracker_current_player';

export const getPlayers = (): Player[] => {
  const players = localStorage.getItem(PLAYERS_KEY);
  return players ? JSON.parse(players) : [];
};

export const savePlayers = (players: Player[]): void => {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
};

export const addPlayer = (name: string): void => {
  const players = getPlayers();
  const newPlayer: Player = {
    id: Date.now().toString(),
    name,
    shotsTaken: 0,
    skippedTurns: 0,
    timeRecord: [],
    isActive: true
  };
  
  players.push(newPlayer);
  savePlayers(players);
};

export const removePlayer = (id: string): void => {
  const players = getPlayers().filter(player => player.id !== id);
  savePlayers(players);
};

export const updatePlayer = (updatedPlayer: Player): void => {
  const players = getPlayers();
  const index = players.findIndex(player => player.id === updatedPlayer.id);
  
  if (index !== -1) {
    players[index] = updatedPlayer;
    savePlayers(players);
  }
};

export const getSettings = (): GameSettings => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings 
    ? JSON.parse(settings) 
    : { countdownDuration: 30, maxShots: 10 };
};

export const saveSettings = (settings: GameSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getCurrentPlayerIndex = (): number => {
  const index = localStorage.getItem(CURRENT_PLAYER_KEY);
  return index ? parseInt(index, 10) : 0;
};

export const saveCurrentPlayerIndex = (index: number): void => {
  localStorage.setItem(CURRENT_PLAYER_KEY, index.toString());
};

export const resetGame = (): void => {
  const players = getPlayers().map(player => ({
    ...player,
    shotsTaken: 0,
    skippedTurns: 0,
    timeRecord: []
  }));
  
  savePlayers(players);
  saveCurrentPlayerIndex(0);
};
