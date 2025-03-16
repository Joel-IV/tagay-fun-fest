
import { Player, resetGame } from "@/utils/localStorage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trophy, Clock, SkipForward, RotateCcw, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AnalyticsDashboardProps {
  players: Player[];
  maxShots: number;
  onReset: () => void;
}

const AnalyticsDashboard = ({
  players,
  maxShots,
  onReset
}: AnalyticsDashboardProps) => {
  const { toast } = useToast();
  
  // Sort players by shots taken (descending)
  const sortedByShots = [...players].sort((a, b) => b.shotsTaken - a.shotsTaken);
  
  // Find player with fastest average time
  const playersWithTime = players.filter(p => p.timeRecord.length > 0);
  const fastestPlayer = playersWithTime.length > 0
    ? playersWithTime.reduce((fastest, current) => {
        const currentAvg = current.timeRecord.reduce((sum, time) => sum + time, 0) / current.timeRecord.length;
        const fastestAvg = fastest.timeRecord.reduce((sum, time) => sum + time, 0) / fastest.timeRecord.length;
        return currentAvg < fastestAvg ? current : fastest;
      }, playersWithTime[0])
    : null;
  
  // Find player with most skipped turns
  const skipChampion = [...players].sort((a, b) => b.skippedTurns - a.skippedTurns)[0];
  
  // Find players who exceeded shot limit
  const soberangLasing = players.filter(p => p.shotsTaken >= maxShots);

  const handleResetGame = () => {
    resetGame();
    onReset();
    
    toast({
      title: "Game Reset",
      description: "All player stats have been reset",
    });
  };

  return (
    <div className="glass-card p-6 rounded-2xl animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetGame}
          className="text-xs"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      {players.length > 0 ? (
        <>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                Shot Leaderboard
              </h3>
              <div className="space-y-2">
                {sortedByShots.slice(0, 3).map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-5 text-sm font-medium text-gray-400">{index + 1}.</span>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <span className={`font-bold ${player.shotsTaken >= maxShots ? 'text-destructive' : ''}`}>
                      {player.shotsTaken} shots
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fastestPlayer && (
                <div className="glass-card p-3 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                    <Clock className="h-4 w-4 text-secondary mr-1" />
                    Fastest Drinker
                  </h3>
                  <p className="font-medium">{fastestPlayer.name}</p>
                  <p className="text-sm text-gray-600">
                    {Math.round(fastestPlayer.timeRecord.reduce((sum, time) => sum + time, 0) / fastestPlayer.timeRecord.length)}s avg
                  </p>
                </div>
              )}

              {skipChampion && skipChampion.skippedTurns > 0 && (
                <div className="glass-card p-3 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                    <SkipForward className="h-4 w-4 text-secondary mr-1" />
                    Skip Champion
                  </h3>
                  <p className="font-medium">{skipChampion.name}</p>
                  <p className="text-sm text-gray-600">{skipChampion.skippedTurns} turns skipped</p>
                </div>
              )}
            </div>

            {soberangLasing.length > 0 && (
              <>
                <Separator />
                
                <div className="animate-pulse-scale">
                  <h3 className="text-sm font-medium text-destructive mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Sobrang Lasing Alert
                  </h3>
                  <div className="glass-card p-3 rounded-xl border border-destructive/30 bg-destructive/5">
                    <p className="text-sm text-gray-600 mb-1">These players have reached the shot limit:</p>
                    <div className="flex flex-wrap gap-2">
                      {soberangLasing.map(player => (
                        <span key={player.id} className="inline-block bg-destructive/10 text-destructive px-2 py-1 rounded-full text-xs font-medium">
                          {player.name} ({player.shotsTaken})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No player data yet</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
