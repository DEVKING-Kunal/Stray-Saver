import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";
import { calculateUserRewards, UserRewards, getAvailableRewards } from "@/services/rewardsService";
import RewardsCard from "@/components/rewards/RewardsCard";
import SponsorsBanner from "@/components/sponsors/SponsorsBanner";
import ReportsList from "@/components/reports/ReportsList";
import ReportFilter from "@/components/reports/ReportFilter";

type Report = Tables<"reports">;
type UIReportStatus = "waiting" | "in-progress" | "resolved" | "seen";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<UserRewards>({
    coins: 0,
    badges: [],
    level: 1,
    rescues: 0
  });
  
  const [seenReportIds, setSeenReportIds] = useState<Set<string>>(new Set());

  const fetchReports = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (tab === "mine" && user) {
        query = query.eq("reporter_id", user.id);
      } else if (tab === "volunteered" && user) {
        query = query.eq("volunteer_id", user.id);
      }

      if (search) {
        query = query.or(`species.ilike.%${search}%,notes.ilike.%${search}%,landmark.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReports(data || []);
      
      // Load seen reports from localStorage
      if (user) {
        const storedSeenReports = localStorage.getItem(`seen_reports_${user.id}`);
        if (storedSeenReports) {
          setSeenReportIds(new Set(JSON.parse(storedSeenReports)));
        }
        
        const userRewards = calculateUserRewards(data || [], user.id);
        setRewards(userRewards);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
        },
        () => {
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tab, search, user]);

  const updateReportStatus = async (reportId: string, newStatus: UIReportStatus) => {
    if (!user) {
      toast.error("You must be logged in to update status");
      navigate("/auth");
      return;
    }

    try {
      if (newStatus === 'seen') {
        // Update seen reports in local state
        const updatedSeenReports = new Set(seenReportIds);
        updatedSeenReports.add(reportId);
        setSeenReportIds(updatedSeenReports);
        
        // Store in localStorage for persistence
        localStorage.setItem(
          `seen_reports_${user.id}`,
          JSON.stringify([...updatedSeenReports])
        );
        
        toast.success(`Report marked as seen`);
        return;
      }

      // For other statuses, update the database
      const { error } = await supabase
        .from("reports")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          volunteer_id: user.id // Add the current user as the volunteer who rescued
        })
        .eq("id", reportId);

      if (error) throw error;
      
      // Update local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: newStatus, volunteer_id: user.id, updated_at: new Date().toISOString() } 
            : report
        )
      );

      // If a report is marked as resolved, update the user's rewards
      if (newStatus === "resolved") {
        const updatedRewards = {
          ...rewards,
          coins: rewards.coins + 50,
          rescues: rewards.rescues + 1
        };
        
        if (updatedRewards.rescues % 5 === 0) {
          updatedRewards.badges.push(`Rescue Hero ${updatedRewards.rescues}`);
          toast.success(`🏆 New Badge Earned: Rescue Hero ${updatedRewards.rescues}!`);
        }
        
        setRewards(updatedRewards);
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleSponsorRescue = () => {
    if (!user) {
      toast.error("You must be logged in to sponsor a rescue");
      navigate("/auth");
      return;
    }
    
    // Check if user has enough coins for at least the basic sponsorship
    const sponsorOptions = getAvailableRewards().filter(reward => reward.id.startsWith('sponsor'));
    const basicOption = sponsorOptions[0];
    
    if (rewards.coins < basicOption.cost) {
      toast.error(`You need at least ${basicOption.cost} coins to sponsor a rescue. You currently have ${rewards.coins} coins.`);
      return;
    }
    
    navigate('/sponsor');
    toast.info("Sponsorship options loaded");
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <SponsorsBanner />
        
        {user && <RewardsCard rewards={rewards} onRedeemReward={handleRedeemReward} />}
        
        <ReportFilter 
          tab={tab}
          setTab={setTab}
          search={search}
          setSearch={setSearch}
        />

        <ReportsList 
          reports={reports} 
          loading={loading} 
          seenReportIds={seenReportIds}
          currentUser={user}
          onReportStatusUpdate={updateReportStatus}
        />
      </div>
    </MainLayout>
  );
  
  function handleRedeemReward(cost: number) {
    const updatedRewards = {
      ...rewards,
      coins: rewards.coins - cost
    };
    
    setRewards(updatedRewards);
  }
};

export default Dashboard;
