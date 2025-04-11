
import { useState } from "react";
import { Coins, BadgeCheck, Star, Heart, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { UserRewards, getAvailableRewards, canRedeemReward } from "@/services/rewardsService";

interface RewardsCardProps {
  rewards: UserRewards;
  onRedeemReward: (cost: number) => void;
}

const RewardsCard = ({ rewards, onRedeemReward }: RewardsCardProps) => {
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const availableRewards = getAvailableRewards();

  const handleRedeem = (rewardId: string, cost: number) => {
    if (canRedeemReward(rewards.coins, cost)) {
      onRedeemReward(cost);
      toast.success("Reward redeemed successfully!");
      setRedeemDialogOpen(false);
    } else {
      toast.error("Not enough coins to redeem this reward");
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <Award className="h-5 w-5 mr-2 text-primary" />
          Your Rewards
        </CardTitle>
        <CardDescription>
          Earn coins and badges by reporting incidents and volunteering to help
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-3 border border-primary/10">
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coins</p>
              <p className="text-xl font-semibold">{rewards.coins}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-3 border border-primary/10">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Badges</p>
              <p className="text-xl font-semibold">{rewards.badges.length}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-3 border border-primary/10">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-xl font-semibold">{rewards.level}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-3 border border-primary/10">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rescues</p>
              <p className="text-xl font-semibold">{rewards.rescues}</p>
            </div>
          </div>
        </div>
        
        {rewards.badges.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Your Badges:</p>
            <div className="flex flex-wrap gap-2">
              {rewards.badges.map((badge, index) => (
                <Badge key={index} variant="outline" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <Dialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-primary">
                <Coins className="mr-2 h-4 w-4" />
                Redeem Coins
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Redeem Rewards</DialogTitle>
                <DialogDescription>
                  Use your earned coins to claim these rewards
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="text-center text-lg font-medium mb-4">
                  Available Coins: <span className="text-primary">{rewards.coins}</span>
                </div>
                
                {availableRewards.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{reward.name}</p>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="flex items-center text-sm font-medium">
                        <Coins className="h-3 w-3 mr-1" />
                        {reward.cost}
                      </span>
                      <Button 
                        size="sm" 
                        variant={rewards.coins >= reward.cost ? "default" : "outline"}
                        disabled={rewards.coins < reward.cost}
                        onClick={() => handleRedeem(reward.id, reward.cost)}
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsCard;
