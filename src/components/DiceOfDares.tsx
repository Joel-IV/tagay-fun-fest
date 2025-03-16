
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";
import { diceFaces, rollDice, getRandomDare, Dare } from "@/utils/gameData";
import { Player, updatePlayer } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";

interface DiceOfDaresProps {
  currentPlayer: Player | null;
  onPlayerUpdate: () => void;
}

const DiceOfDares = ({ currentPlayer, onPlayerUpdate }: DiceOfDaresProps) => {
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [currentDare, setCurrentDare] = useState<Dare | null>(null);
  const { toast } = useToast();

  const handleRollDice = () => {
    if (!currentPlayer) {
      toast({
        title: "No active player",
        description: "Please add players to start the game",
        variant: "destructive",
      });
      return;
    }

    setIsRolling(true);
    setCurrentDare(null);
    
    // Simulate dice rolling animation
    setTimeout(() => {
      const value = rollDice();
      setDiceValue(value);
      
      const dare = getRandomDare();
      setCurrentDare(dare);
      
      // Apply dare effect
      if (dare.action === 'takeShots' && dare.value) {
        const updatedPlayer = {
          ...currentPlayer,
          shotsTaken: currentPlayer.shotsTaken + dare.value
        };
        updatePlayer(updatedPlayer);
        onPlayerUpdate();
      } else if (dare.action === 'skipTurn' && dare.value) {
        const updatedPlayer = {
          ...currentPlayer,
          skippedTurns: currentPlayer.skippedTurns + (dare.value || 1)
        };
        updatePlayer(updatedPlayer);
        onPlayerUpdate();
      }
      
      setIsRolling(false);
      
      toast({
        title: "Dice Rolled!",
        description: `${currentPlayer.name} rolled a ${value}!`,
      });
    }, 1000);
  };

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col items-center animate-fade-in">
      <h2 className="text-lg font-semibold mb-4">Dice of Dares</h2>
      
      <div className="relative mb-6">
        <div className={`dice ${isRolling ? 'animate-dice-roll' : ''}`}>
          {diceFaces.map((face, index) => (
            <div
              key={index}
              className={`dice-face ${face.color} text-white`}
              style={{
                transform: [
                  'rotateY(0deg) translateZ(48px)',
                  'rotateY(180deg) translateZ(48px)',
                  'rotateX(90deg) translateZ(48px)',
                  'rotateX(-90deg) translateZ(48px)',
                  'rotateY(90deg) translateZ(48px)',
                  'rotateY(-90deg) translateZ(48px)',
                ][index],
                opacity: diceValue === face.value || !diceValue ? 1 : 0.3,
              }}
            >
              {face.value}
            </div>
          ))}
        </div>
      </div>
      
      {currentDare && (
        <div className="glass-card p-3 rounded-xl mb-4 w-full text-center animate-fade-in">
          <p className="font-medium">{currentDare.text}</p>
        </div>
      )}
      
      <Button
        className="bg-secondary w-full"
        onClick={handleRollDice}
        disabled={isRolling || !currentPlayer}
      >
        <Dices className="h-5 w-5 mr-2" />
        Roll the Dice
      </Button>
    </div>
  );
};

export default DiceOfDares;
