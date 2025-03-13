import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { CourseCard } from "@/components/dashboard/course-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, ArrowLeft } from "lucide-react";

export default function Subject() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get the subject name from the URL
  const [, params] = useRoute("/subjects/:name");
  const subjectName = params?.name ? params.name.replace(/-/g, " ") : "";
  
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });
  
  // Fetch subjects
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["/api/subjects"],
  });
  
  // Fetch all courses
  const { data: allCourses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/courses/all"],
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const userData = isLoadingUser 
    ? { name: "Loading...", email: "loading@example.com" }
    : user || { name: "Guest User", email: "guest@example.com" };
  
  // Find the current subject from the subjects list
  const currentSubject = subjects?.find(
    subject => subject.name.toLowerCase() === subjectName.toLowerCase()
  );
  
  // Filter courses by the current subject ID and search query
  const filteredCourses = allCourses?.filter(course => {
    // Match the subject ID
    const matchesSubject = currentSubject ? course.subjectId === currentSubject.id : false;
    
    // Match the search query
    const matchesSearch = searchQuery === "" || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSubject && matchesSearch;
  }) || [];

  if (isLoadingSubjects || isLoadingCourses) {
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
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-neutral-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // If subject not found
  if (!currentSubject) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={userData} />
        <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
          <Header onSearch={handleSearch} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold mb-4">Subject Not Found</h1>
              <p className="text-neutral-600 mb-6">
                The subject you are looking for does not exist or has been removed.
              </p>
              <Link href="/">
                <Button className="inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Dashboard
                </Button>
              </Link>
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
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="pl-0 text-neutral-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            
            <h1 className="text-3xl font-bold mt-2 mb-1 capitalize">{currentSubject.name}</h1>
            <p className="text-neutral-600 mb-6">
              Explore courses and lessons in the field of {currentSubject.name.toLowerCase()}.
            </p>
            
            {/* Search */}
            <div className="relative mb-6">
              <div className="flex">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <Input
                    className="pl-10"
                    placeholder={`Search ${currentSubject.name} courses...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured Course */}
          {filteredCourses.length > 0 && (
            <div className="mb-8">
              <Card className="overflow-hidden">
                <div className="p-6 md:p-8 md:flex items-start">
                  <div className="md:w-7/12 md:pr-8">
                    <div className="text-sm text-primary font-medium mb-2">Featured Course</div>
                    <h2 className="text-2xl font-bold mb-2">{filteredCourses[0].title}</h2>
                    <p className="text-neutral-600 mb-4">{filteredCourses[0].description}</p>
                    
                    <div className="flex items-center mb-6">
                      <div className="flex items-center text-sm text-neutral-500 mr-4">
                        <BookOpen className="mr-1 h-4 w-4" />
                        <span>{filteredCourses[0].lessonCount} lessons</span>
                      </div>
                      <div className="text-sm text-neutral-500">
                        {filteredCourses[0].duration}
                      </div>
                    </div>
                    
                    <Link href={`/courses/${filteredCourses[0].id}`}>
                      <Button>View Course</Button>
                    </Link>
                  </div>
                  
                  <div className="md:w-5/12 mt-6 md:mt-0">
                    <div className="aspect-video rounded-lg bg-neutral-200 overflow-hidden">
                      {filteredCourses[0].thumbnailUrl ? (
                        <img 
                          src={filteredCourses[0].thumbnailUrl} 
                          alt={filteredCourses[0].title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <BookOpen className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {/* All Courses */}
          <div>
            <h2 className="text-xl font-semibold mb-4">All {currentSubject.name} Courses</h2>
            
            {filteredCourses.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No courses found</h3>
                <p className="text-neutral-600 mb-4">
                  There are no courses available for this subject yet or no courses match your search.
                </p>
                {searchQuery && (
                  <Button onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="h-full">
                    <CourseCard
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      thumbnailUrl={course.thumbnailUrl ?? undefined}
                      duration={course.duration}
                      lessonCount={course.lessonCount}
                      progress={course.progress ?? 0}
                      status={course.status ?? "not-started"}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}