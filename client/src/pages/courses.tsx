import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { CourseCard } from "@/components/dashboard/course-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<number | null>(null);
  
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });
  
  // Fetch all courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/courses/all"],
  });
  
  // Fetch subjects
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["/api/subjects"],
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredCourses = () => {
    if (!courses) return [];
    return courses.filter(course => {
      const matchesSearch = searchQuery === "" || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubject = subjectFilter === null || course.subjectId === subjectFilter;
      
      return matchesSearch && matchesSubject;
    });
  };

  const userData = isLoadingUser 
    ? { name: "Loading...", email: "loading@example.com" }
    : user || { name: "Guest User", email: "guest@example.com" };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={userData} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
        <Header onSearch={handleSearch} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">All Courses</h1>
            <p className="text-neutral-700 mt-1">Explore our library of courses and expand your knowledge</p>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search courses by title or description..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={subjectFilter === null ? "secondary" : "outline"}
                  onClick={() => setSubjectFilter(null)}
                  className="whitespace-nowrap"
                >
                  All Subjects
                </Button>
                
                {!isLoadingSubjects && subjects && subjects.map((subject: any) => (
                  <Button
                    key={subject.id}
                    variant={subjectFilter === subject.id ? "secondary" : "outline"}
                    onClick={() => setSubjectFilter(subject.id)}
                    className="whitespace-nowrap"
                  >
                    {subject.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="my">My Courses</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingCourses ? (
                  <>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                  </>
                ) : filteredCourses().length > 0 ? (
                  filteredCourses().map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      thumbnailUrl={course.thumbnailUrl}
                      duration={course.duration}
                      lessonCount={course.lessonCount}
                      progress={course.progress || 0}
                      status={course.status || "not-started"}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-neutral-500">No courses matching your search criteria.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="my" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingCourses ? (
                  <>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                  </>
                ) : filteredCourses().filter(c => c.enrolled).length > 0 ? (
                  filteredCourses()
                    .filter(c => c.enrolled)
                    .map((course) => (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        description={course.description}
                        thumbnailUrl={course.thumbnailUrl}
                        duration={course.duration}
                        lessonCount={course.lessonCount}
                        progress={course.progress || 0}
                        status={course.status || "not-started"}
                      />
                    ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-neutral-500">You haven't enrolled in any courses yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="in-progress" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingCourses ? (
                  <>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                  </>
                ) : filteredCourses().filter(c => c.status === "in-progress").length > 0 ? (
                  filteredCourses()
                    .filter(c => c.status === "in-progress")
                    .map((course) => (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        description={course.description}
                        thumbnailUrl={course.thumbnailUrl}
                        duration={course.duration}
                        lessonCount={course.lessonCount}
                        progress={course.progress || 0}
                        status="in-progress"
                      />
                    ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-neutral-500">You don't have any courses in progress.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingCourses ? (
                  <>
                    <div className="h-80 bg-white rounded-xl shadow-sm animate-pulse"></div>
                  </>
                ) : filteredCourses().filter(c => c.status === "completed").length > 0 ? (
                  filteredCourses()
                    .filter(c => c.status === "completed")
                    .map((course) => (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        description={course.description}
                        thumbnailUrl={course.thumbnailUrl}
                        duration={course.duration}
                        lessonCount={course.lessonCount}
                        progress={100}
                        status="completed"
                      />
                    ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-neutral-500">You haven't completed any courses yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
