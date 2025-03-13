import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, Mail, BookOpen, Clock, Trophy, Award, Calendar
} from "lucide-react";

export default function Profile() {
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });
  
  // Fetch enrolled courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/courses"],
  });
  
  // Fetch achievements
  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ["/api/achievements"],
  });
  
  // Fetch streaks
  const { data: streaks, isLoading: isLoadingStreaks } = useQuery({
    queryKey: ["/api/streaks"],
  });

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const userData = isLoadingUser 
    ? { name: "Loading...", email: "loading@example.com" }
    : user || { name: "Guest User", email: "guest@example.com" };

  const totalCoursesCompleted = courses?.filter(course => course.status === "completed").length || 0;
  const totalAchievements = achievements?.length || 0;
  const currentStreak = streaks?.length > 0 ? streaks[streaks.length - 1].count : 0;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={userData} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
        <Header onSearch={handleSearch} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          <h1 className="text-2xl font-bold mb-6">User Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary */}
            <Card className="p-6 col-span-1">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  {userData.avatar ? (
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                  ) : (
                    <AvatarFallback className="text-3xl">{userData.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-neutral-500 mb-4">{userData.email}</p>
                
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                  <Button size="sm">
                    Change Avatar
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="font-medium mb-4">User Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500">Full Name</p>
                      <p>{userData.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500">Email</p>
                      <p>{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500">Joined</p>
                      <p>March 1, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Stats & Activity */}
            <Card className="p-6 col-span-1 lg:col-span-2">
              <h3 className="font-bold text-lg mb-4">Learning Stats</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    <h4 className="font-medium">Courses</h4>
                  </div>
                  <p className="text-2xl font-bold">{totalCoursesCompleted}</p>
                  <p className="text-sm text-neutral-500">completed</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Trophy className="h-5 w-5 mr-2 text-green-600" />
                    <h4 className="font-medium">Achievements</h4>
                  </div>
                  <p className="text-2xl font-bold">{totalAchievements}</p>
                  <p className="text-sm text-neutral-500">earned</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 mr-2 text-orange-600" />
                    <h4 className="font-medium">Streak</h4>
                  </div>
                  <p className="text-2xl font-bold">{currentStreak}</p>
                  <p className="text-sm text-neutral-500">days in a row</p>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-4">Recent Achievements</h3>
              
              {isLoadingAchievements ? (
                <div className="animate-pulse flex flex-col space-y-2">
                  <div className="h-12 bg-neutral-200 rounded-md"></div>
                  <div className="h-12 bg-neutral-200 rounded-md"></div>
                </div>
              ) : achievements && achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center bg-white p-3 rounded-lg border">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary mr-3">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{achievement.name}</p>
                        <p className="text-sm text-neutral-500">
                          Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">No achievements earned yet.</p>
              )}
            </Card>
            
            {/* Learning History */}
            <Card className="p-6 col-span-1 lg:col-span-3">
              <h3 className="font-bold text-lg mb-4">Learning History</h3>
              
              {isLoadingCourses ? (
                <div className="animate-pulse flex flex-col space-y-2">
                  <div className="h-16 bg-neutral-200 rounded-md"></div>
                  <div className="h-16 bg-neutral-200 rounded-md"></div>
                </div>
              ) : courses && courses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Course</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Progress</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {courses.map((course) => (
                        <tr key={course.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded bg-neutral-200"></div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-neutral-900">{course.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.status === "completed" 
                                ? "bg-green-100 text-green-800" 
                                : course.status === "in-progress" 
                                  ? "bg-blue-100 text-blue-800" 
                                  : "bg-neutral-100 text-neutral-800"
                            }`}>
                              {course.status === "completed" 
                                ? "Completed" 
                                : course.status === "in-progress" 
                                  ? "In Progress" 
                                  : "Not Started"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-1">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-neutral-500">{course.progress}%</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                            3 days ago
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-neutral-500">No courses enrolled yet.</p>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}