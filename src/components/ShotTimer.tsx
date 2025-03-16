
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Beer, ArrowRight, SkipForward } from "lucide-react";
import { Player, updatePlayer, saveCurrentPlayerIndex } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";

interface ShotTimerProps {
  players: Player[];
  currentPlayerIndex: number;
  countdownDuration: number;
  onNextPlayer: (index: number) => void;
}

const ShotTimer = ({
  players,
  currentPlayerIndex,
  countdownDuration,
  onNextPlayer
}: ShotTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(countdownDuration);
  const [isTakingShot, setIsTakingShot] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const { toast } = useToast();

  const currentPlayer = players[currentPlayerIndex];
  
  useEffect(() => {
    setTimeLeft(countdownDuration);
  }, [currentPlayerIndex, countdownDuration]);

  useEffect(() => {
    let timer: number;
    
    if (isTimerRunning && timeLeft > 0) {
      timer = window.setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      handleTimeUp();
    }
    
    return () => clearTimeout(timer);
  }, [isTimerRunning, timeLeft]);

  const handleTakeShot = () => {
    if (!currentPlayer) return;
    
    setIsTakingShot(true);
    startTimeRef.current = Date.now();
    setIsTimerRunning(true);
    
    toast({
      title: "Shot Timer Started",
      description: `${currentPlayer.name} is taking a shot!`,
    });
  };

  const handleShotTaken = () => {
    if (!currentPlayer || !startTimeRef.current) return;
    
    setIsTimerRunning(false);
    setIsTakingShot(false);
    
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    
    // Update player stats
    const updatedPlayer = {
      ...currentPlayer,
      shotsTaken: currentPlayer.shotsTaken + 1,
      timeRecord: [...currentPlayer.timeRecord, timeTaken]
    };
    
    updatePlayer(updatedPlayer);
    
    // Move to next player
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    saveCurrentPlayerIndex(nextIndex);
    onNextPlayer(nextIndex);
    
    toast({
      title: "Shot Taken!",
      description: `${currentPlayer.name} took a shot in ${timeTaken} seconds!`,
    });
  };

  const handleSkipTurn = () => {
    if (!currentPlayer) return;
    
    // Update player stats
    const updatedPlayer = {
      ...currentPlayer,
      skippedTurns: currentPlayer.skippedTurns + 1
    };
    
    updatePlayer(updatedPlayer);
    
    // Move to next player
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    saveCurrentPlayerIndex(nextIndex);
    onNextPlayer(nextIndex);
    
    toast({
      title: "Turn Skipped",
      description: `${currentPlayer.name} skipped their turn.`,
    });
  };

  const handleTimeUp = () => {
    if (!currentPlayer) return;
    
    setIsTimerRunning(false);
    setIsTakingShot(false);
    
    toast({
      title: "Time's Up!",
      description: `${currentPlayer.name}'s turn is over.`,
      variant: "destructive",
    });
    
    // Move to next player
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    saveCurrentPlayerIndex(nextIndex);
    onNextPlayer(nextIndex);
  };

  // Calculate the rotation angle for the countdown bar
  const rotationAngle = (timeLeft / countdownDuration) * 360;

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col items-center animate-fade-in">
      {currentPlayer && (
        <>
          <div className="text-center mb-6">
            <div className="inline-block text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full mb-2">
              Current Player
            </div>
            <h2 className="text-2xl font-bold">{currentPlayer.name}</h2>
          </div>
          
          {isTakingShot ? (
            <>
              <div className="countdown-circle mb-6">
                <div 
                  className="countdown-bar"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`
                  }}
                ></div>
                <span>{timeLeft}</span>
              </div>
              
              <Button 
                className="shot-button mb-3 w-full" 
                onClick={handleShotTaken}
              >
                <Beer className="h-5 w-5 mr-2" />
                Shot Taken!
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsTimerRunning(false);
                  setIsTakingShot(false);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="shot-button mb-3 w-full" 
                onClick={handleTakeShot}
              >
                <Beer className="h-5 w-5 mr-2" />
                Take a Shot
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleSkipTurn}
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Skip Turn
              </Button>
            </>
          )}
        </>
      )}
      
      {!currentPlayer && (
        <div className="text-center py-6">
          <p className="text-lg font-medium text-gray-500">No players yet!</p>
          <p className="text-sm text-gray-400">Add players to start the game</p>
        </div>
      )}
    </div>
  );
};

export default ShotTimer;
