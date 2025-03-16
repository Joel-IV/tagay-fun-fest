
import { useState, useEffect } from "react";
import UserManager from "@/components/UserManager";
import PlayerCard from "@/components/PlayerCard";
import ShotTimer from "@/components/ShotTimer";
import DiceOfDares from "@/components/DiceOfDares";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { 
  getPlayers, 
  Player, 
  removePlayer, 
  getSettings, 
  getCurrentPlayerIndex, 
  saveCurrentPlayerIndex 
} from "@/utils/localStorage";
import { Separator } from "@/components/ui/separator";
import { Beer } from "lucide-react";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [settings, setSettings] = useState({
    countdownDuration: 30,
    maxShots: 10
  });
  
  // Load players and game state from localStorage
  useEffect(() => {
    const loadedPlayers = getPlayers();
    const loadedSettings = getSettings();
    const loadedIndex = getCurrentPlayerIndex();
    
    setPlayers(loadedPlayers);
    setSettings(loadedSettings);
    setCurrentPlayerIndex(loadedIndex);
  }, []);
  
  const handleAddPlayer = () => {
    setPlayers(getPlayers());
  };
  
  const handleRemovePlayer = (id: string) => {
    removePlayer(id);
    setPlayers(getPlayers());
    
    // Update current player index if needed
    if (players.length <= 1) {
      saveCurrentPlayerIndex(0);
      setCurrentPlayerIndex(0);
    } else if (currentPlayerIndex >= players.length - 1) {
      const newIndex = currentPlayerIndex - 1;
      saveCurrentPlayerIndex(newIndex);
      setCurrentPlayerIndex(newIndex);
    }
  };
  
  const handleNextPlayer = (index: number) => {
    setCurrentPlayerIndex(index);
  };
  
  const handleResetGame = () => {
    setPlayers(getPlayers());
    setCurrentPlayerIndex(0);
  };

  const currentPlayer = players.length > 0 ? players[currentPlayerIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/70">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Beer className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Tagay Tracker
            </h1>
          </div>
          <p className="text-muted-foreground">Track your Filipino drinking sessions!</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <UserManager onAddPlayer={handleAddPlayer} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ShotTimer 
                players={players}
                currentPlayerIndex={currentPlayerIndex}
                countdownDuration={settings.countdownDuration}
                onNextPlayer={handleNextPlayer}
              />
              
              <DiceOfDares
                currentPlayer={currentPlayer}
                onPlayerUpdate={() => setPlayers(getPlayers())}
              />
            </div>
            
            <AnalyticsDashboard 
              players={players}
              maxShots={settings.maxShots}
              onReset={handleResetGame}
            />
          </div>
          
          <div className="lg:col-span-4">
            <div className="glass-card p-4 rounded-2xl animate-fade-in">
              <h2 className="text-lg font-semibold mb-4">Players</h2>
              {players.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {players.map((player, index) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      isCurrentPlayer={index === currentPlayerIndex}
                      maxShots={settings.maxShots}
                      onRemove={handleRemovePlayer}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No players yet</p>
                  <p className="text-sm text-gray-400">Add players to start the game</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Tagay Tracker &copy; {new Date().getFullYear()} | Drink responsibly!</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
