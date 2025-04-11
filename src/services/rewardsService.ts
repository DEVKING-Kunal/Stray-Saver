
import { Tables } from "@/integrations/supabase/types";

type Report = Tables<"reports">;

export interface UserRewards {
  coins: number;
  badges: string[];
  level: number;
  rescues: number;
}

/**
 * Calculate user rewards based on their activity
 */
export const calculateUserRewards = (reports: Report[], userId: string): UserRewards => {
  if (!userId || !reports.length) {
    return {
      coins: 0,
      badges: [],
      level: 1,
      rescues: 0
    };
  }
  
  // Count reports submitted and resolved
  const submitted = reports.filter(r => r.reporter_id === userId).length;
  const volunteered = reports.filter(r => r.volunteer_id === userId).length;
  const resolved = reports.filter(r => r.volunteer_id === userId && r.status === "resolved").length;
  
  // Calculate coins (10 per report, 25 per rescue)
  const earnedCoins = (submitted * 10) + (resolved * 25);
  
  // Determine badges based on activity
  const earnedBadges = [];
  
  if (submitted >= 1) earnedBadges.push("First Report");
  if (submitted >= 5) earnedBadges.push("Active Reporter");
  if (submitted >= 10) earnedBadges.push("Dedicated Reporter");
  
  if (volunteered >= 1) earnedBadges.push("First Rescue");
  if (volunteered >= 5) earnedBadges.push("Hero");
  if (volunteered >= 10) earnedBadges.push("Legendary Rescuer");
  
  if (resolved >= 1) earnedBadges.push("Problem Solver");
  if (resolved >= 5) earnedBadges.push("Animal Guardian");
  
  // Calculate level (1 level per 50 coins)
  const level = Math.max(1, Math.floor(earnedCoins / 50) + 1);
  
  return {
    coins: earnedCoins,
    badges: earnedBadges,
    level,
    rescues: volunteered
  };
};

/**
 * Check if a user can redeem a reward
 */
export const canRedeemReward = (coins: number, rewardCost: number): boolean => {
  return coins >= rewardCost;
};

/**
 * Get all available rewards for redeeming
 */
export const getAvailableRewards = () => {
  return [
    { id: 'reward1', name: 'Premium Pet Food Coupon', cost: 100, description: '10% off at local pet stores' },
    { id: 'reward2', name: 'Veterinary Care Discount', cost: 250, description: '15% off at partner vet clinics' },
    { id: 'reward3', name: 'Custom Pet Tag', cost: 50, description: 'Free personalized pet tag' },
    { id: 'reward4', name: 'Donation to Shelters', cost: 75, description: 'Donate to local animal shelters' },
    { id: 'sponsor1', name: 'Sponsor Basic Rescue', cost: 500, description: 'Sponsor rescue (5 rescues)' },
    { id: 'sponsor2', name: 'Sponsor Standard Rescue', cost: 1000, description: 'Sponsor rescue (20 rescues)' },
    { id: 'sponsor3', name: 'Sponsor Premium Rescue', cost: 2000, description: 'Sponsor rescue (50 rescues)' }
  ];
};
