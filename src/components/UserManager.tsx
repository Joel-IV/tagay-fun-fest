
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { addPlayer } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";

interface UserManagerProps {
  onAddPlayer: () => void;
}

const UserManager = ({ onAddPlayer }: UserManagerProps) => {
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleAddPlayer = () => {
    if (!name.trim()) {
      toast({
        title: "Please enter a name",
        description: "Player name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    addPlayer(name.trim());
    setName("");
    onAddPlayer();
    
    toast({
      title: "Player added",
      description: `${name} has joined the Tagay Tracker!`,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddPlayer();
    }
  };

  return (
    <div className="glass-card p-4 rounded-2xl animate-fade-in">
      <h2 className="text-lg font-semibold mb-4">Add Players</h2>
      
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleAddPlayer} className="bg-primary">
          <UserPlus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default UserManager;
