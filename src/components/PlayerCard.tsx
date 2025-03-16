
import { Player } from "@/utils/localStorage";
import { Badge } from "@/components/ui/badge";
import { Beer, AlertTriangle, Clock, SkipForward } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  maxShots: number;
  onRemove: (id: string) => void;
}

const PlayerCard = ({
  player,
  isCurrentPlayer,
  maxShots,
  onRemove
}: PlayerCardProps) => {
  const averageTime = player.timeRecord.length 
    ? Math.round(player.timeRecord.reduce((sum, time) => sum + time, 0) / player.timeRecord.length) 
    : 0;

  const isWarning = player.shotsTaken >= maxShots * 0.7;
  const isDanger = player.shotsTaken >= maxShots;

  return (
    <div className={`player-card ${isCurrentPlayer ? 'ring-2 ring-primary animate-pulse-scale' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{player.name}</h3>
        <button 
          onClick={() => onRemove(player.id)}
          className="text-gray-400 hover:text-destructive transition-colors"
          aria-label="Remove player"
        >
          &times;
        </button>
      </div>
      
      <div className="flex items-center gap-2 mb-1">
        <Beer className="h-4 w-4 text-secondary" />
        <div className="flex-1 flex items-center gap-1">
          <span className="text-sm text-gray-600">Shots:</span>
          <span className={`font-medium ${isDanger ? 'text-destructive' : isWarning ? 'text-orange-500' : ''}`}>
            {player.shotsTaken}
          </span>
          {isDanger && (
            <AlertTriangle className="h-4 w-4 text-destructive ml-1" />
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-1">
        <SkipForward className="h-4 w-4 text-secondary" />
        <div className="flex-1 flex items-center gap-1">
          <span className="text-sm text-gray-600">Skipped:</span>
          <span className="font-medium">{player.skippedTurns}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-secondary" />
        <div className="flex-1 flex items-center gap-1">
          <span className="text-sm text-gray-600">Avg Time:</span>
          <span className="font-medium">{averageTime ? `${averageTime}s` : '-'}</span>
        </div>
      </div>
      
      {isCurrentPlayer && (
        <Badge className="mt-2 bg-primary text-xs animate-fade-in">Current Player</Badge>
      )}
    </div>
  );
};

export default PlayerCard;
