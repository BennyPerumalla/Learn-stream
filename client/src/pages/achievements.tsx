import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Award, Trophy, Medal, Star, Crown, Zap, Target, BookOpen } from "lucide-react";

export default function Achievements() {
  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all");
  
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });
  
  // Fetch user achievements
  const { data: userAchievements, isLoading: isLoadingUserAchievements } = useQuery({
    queryKey: ["/api/achievements/user"],
  });
  
  // Fetch all achievements
  const { data: allAchievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };
  
  const userData = isLoadingUser 
    ? { name: "Loading...", email: "loading@example.com" }
    : user || { name: "Guest User", email: "guest@example.com" };
  
  // Calculate progress stats
  const calculateAchievementStats = () => {
    if (!allAchievements || !userAchievements) {
      return {
        earned: 0,
        total: 0,
        percentage: 0
      };
    }
    
    const earned = userAchievements.length;
    const total = allAchievements.length;
    const percentage = Math.round((earned / total) * 100);
    
    return {
      earned,
      total,
      percentage
    };
  };
  
  const stats = calculateAchievementStats();
  
  // Get icon based on achievement type
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "completion":
        return <Trophy className="h-5 w-5 text-amber-500" />;
      case "streak":
        return <Zap className="h-5 w-5 text-purple-500" />;
      case "mastery":
        return <Crown className="h-5 w-5 text-indigo-500" />;
      case "problem-solving":
        return <Target className="h-5 w-5 text-red-500" />;
      case "learning":
        return <BookOpen className="h-5 w-5 text-green-500" />;
      default:
        return <Award className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Filter achievements based on selected tab
  const getFilteredAchievements = () => {
    if (!allAchievements) return [];
    
    const earnedIds = userAchievements?.map(a => a.id) || [];
    
    return allAchievements.filter(achievement => {
      const isEarned = earnedIds.includes(achievement.id);
      
      if (filter === "earned") return isEarned;
      if (filter === "locked") return !isEarned;
      return true;
    });
  };
  
  const filteredAchievements = getFilteredAchievements();
  
  // Loading state
  if (isLoadingAchievements || isLoadingUserAchievements) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={userData} />
        <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
          <Header onSearch={handleSearch} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-neutral-200 rounded-lg w-64"></div>
              <div className="h-32 bg-neutral-200 rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-40 bg-neutral-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={userData} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
        <Header onSearch={handleSearch} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold mb-2 md:mb-0">Achievements</h1>
            <Badge variant="outline" className="px-3 py-1 text-sm bg-white">
              <Trophy className="mr-1 h-4 w-4 text-amber-500" />
              <span>{stats.earned}/{stats.total} Earned</span>
            </Badge>
          </div>
          
          {/* Progress Overview */}
          <Card className="p-4 md:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-primary mb-2">{stats.earned}</div>
                <div className="text-sm text-neutral-600">Achievements Earned</div>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-neutral-700 mb-2">{stats.total}</div>
                <div className="text-sm text-neutral-600">Total Achievements</div>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-green-600 mb-2">{stats.percentage}%</div>
                <div className="text-sm text-neutral-600">Completion Rate</div>
              </div>
            </div>
            
            <div className="md:px-8 mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span className="font-medium">{stats.percentage}%</span>
              </div>
              <Progress value={stats.percentage} className="h-2" />
            </div>
          </Card>
          
          {/* Achievement Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger 
                value="all" 
                onClick={() => setFilter("all")}
                className="px-8"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="earned" 
                onClick={() => setFilter("earned")}
                className="px-8"
              >
                Earned
              </TabsTrigger>
              <TabsTrigger 
                value="locked" 
                onClick={() => setFilter("locked")}
                className="px-8"
              >
                Locked
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAchievements.map((achievement) => {
                  const isEarned = userAchievements?.some(ua => ua.id === achievement.id);
                  const earnedDate = isEarned 
                    ? userAchievements?.find(ua => ua.id === achievement.id)?.earnedAt 
                    : null;
                  
                  return (
                    <Card 
                      key={achievement.id} 
                      className={`overflow-hidden ${isEarned ? 'border-green-200' : ''}`}
                    >
                      <div className={`p-4 flex items-start ${isEarned ? 'opacity-100' : 'opacity-60'}`}>
                        <div className={`p-3 rounded-full mr-3 ${isEarned ? 'bg-green-100' : 'bg-neutral-100'}`}>
                          {getAchievementIcon(achievement.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <p className="text-sm text-neutral-600 mb-2">{achievement.description}</p>
                          
                          {isEarned && earnedDate && (
                            <div className="flex items-center mt-2">
                              <Badge variant="secondary" className="text-xs">
                                <Star className="mr-1 h-3 w-3" />
                                Earned on {new Date(earnedDate).toLocaleDateString()}
                              </Badge>
                            </div>
                          )}
                          
                          {!isEarned && (
                            <Badge variant="outline" className="text-xs">
                              Locked
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              {filteredAchievements.length === 0 && (
                <Card className="p-6 text-center">
                  <Medal className="mx-auto h-12 w-12 text-neutral-300 mb-2" />
                  <h3 className="text-lg font-medium mb-1">No achievements found</h3>
                  <p className="text-neutral-600">
                    {filter === "earned" 
                      ? "You haven't earned any achievements yet. Keep learning!" 
                      : filter === "locked" 
                        ? "All achievements have been earned. Congratulations!" 
                        : "There are no achievements available yet."}
                  </p>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="earned" className="m-0">
              {/* Content for earned tab is handled by the filter */}
            </TabsContent>
            
            <TabsContent value="locked" className="m-0">
              {/* Content for locked tab is handled by the filter */}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}