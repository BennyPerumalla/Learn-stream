import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { CourseCard } from "@/components/dashboard/course-card";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { RecommendedCard } from "@/components/dashboard/recommended-card";

export default function Dashboard() {
  const [courseFilter, setCourseFilter] = useState<"all" | "in-progress" | "completed">("all");
  
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  // Fetch courses data
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/courses"],
  });

  // Fetch recommended courses
  const { data: recommendedCourses, isLoading: isLoadingRecommended } = useQuery({
    queryKey: ["/api/courses/recommended"],
  });

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // You would typically update state here or navigate to search results
  };

  const filterCourses = () => {
    if (!courses) return [];
    if (courseFilter === "all") return courses;
    return courses.filter(course => course.status === courseFilter);
  };

  // Use a placeholder user if data is still loading
  const userData = isLoadingUser 
    ? { name: "Loading...", email: "loading@example.com" }
    : user || { name: "Guest User", email: "guest@example.com" };
  
  const filteredCourses = filterCourses();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={userData} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
        <Header onSearch={handleSearch} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          {/* Welcome Section */}
          <section className="mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                    Welcome back, {userData.name.split(" ")[0]}!
                  </h1>
                  <p className="text-neutral-700">Continue your learning journey where you left off.</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button className="inline-flex items-center bg-primary text-white hover:bg-blue-700">
                    <Play className="mr-2 h-4 w-4" />
                    <span>Resume Learning</span>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Progress Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProgressCard
                title="Current Course"
                subtitle="Calculus I: Derivatives"
                description="Advanced Mathematics"
                progress={75}
                progressLabel="75% Complete"
                link={{ text: "Continue", href: "/courses/1" }}
                type="course"
              />
              
              <ProgressCard
                title="Weekly Goal"
                subtitle="Learning Streak"
                description="You're on a 4-day streak!"
                progressLabel="4/5 Days"
                link={{ text: "View Details", href: "/streak" }}
                type="streak"
                streakDays={[true, true, true, true, false]}
              />
              
              <ProgressCard
                title="Achievements"
                subtitle="Recent Badge"
                description="Problem Solver - Level 2"
                progressLabel="12 Earned"
                link={{ text: "View All", href: "/achievements" }}
                type="achievement"
                achievements={[
                  { icon: "trophy", color: "accent" },
                  { icon: "flashlight", color: "primary" },
                  { icon: "brain", color: "secondary" },
                  { icon: "trophy", color: "primary" },
                  { icon: "trophy", color: "primary" },
                  { icon: "trophy", color: "primary" },
                  { icon: "trophy", color: "primary" },
                  { icon: "trophy", color: "primary" },
                  { icon: "trophy", color: "primary" },
                  { icon: "trophy", color: "primary" },
                  { icon: "trophy", color: "primary" },
                  { icon: "trophy", color: "primary" },
                ]}
              />
            </div>
          </section>
          
          {/* Course Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Courses</h2>
              <div className="flex space-x-2">
                <Button
                  variant={courseFilter === "all" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCourseFilter("all")}
                  className="text-sm"
                >
                  All
                </Button>
                <Button
                  variant={courseFilter === "in-progress" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCourseFilter("in-progress")}
                  className="text-sm"
                >
                  In Progress
                </Button>
                <Button
                  variant={courseFilter === "completed" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCourseFilter("completed")}
                  className="text-sm"
                >
                  Completed
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingCourses ? (
                <>
                  <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                  <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                  <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                </>
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    thumbnailUrl={course.thumbnailUrl}
                    duration={course.duration}
                    lessonCount={course.lessonCount}
                    progress={course.progress}
                    status={course.status}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-neutral-500">No courses found. Try adjusting your filter.</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/courses">
                <Button 
                  variant="outline" 
                  className="inline-flex items-center border-primary text-primary hover:bg-blue-50"
                >
                  <span>Explore All Courses</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>
          
          {/* Recommended Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoadingRecommended ? (
                <>
                  <div className="h-28 bg-white rounded-xl shadow-sm animate-pulse"></div>
                  <div className="h-28 bg-white rounded-xl shadow-sm animate-pulse"></div>
                </>
              ) : recommendedCourses && recommendedCourses.length > 0 ? (
                recommendedCourses.map((course) => (
                  <RecommendedCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    thumbnailUrl={course.thumbnailUrl}
                    studentCount={course.studentCount}
                    duration={course.duration}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-10">
                  <p className="text-neutral-500">No recommendations available at this time.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
