import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Book, Play, CheckCircle } from "lucide-react";

export default function CourseDetails() {
  const [, params] = useRoute("/courses/:id");
  const courseId = params?.id ? parseInt(params.id) : 0;

  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });
  
  // Fetch course data
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["/api/courses", courseId],
  });
  
  // Fetch lessons
  const { data: lessons, isLoading: isLoadingLessons } = useQuery({
    queryKey: ["/api/courses", courseId, "lessons"],
  });

  const [activeLesson, setActiveLesson] = useState<number | null>(null);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const userData = isLoadingUser 
    ? { name: "Loading...", email: "loading@example.com" }
    : user || { name: "Guest User", email: "guest@example.com" };

  if (isLoadingCourse || !course) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={userData} />
        <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
          <Header onSearch={handleSearch} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
            <div className="h-96 bg-white rounded-xl shadow-sm animate-pulse"></div>
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
          <div className="mb-4">
            <Link href="/courses">
              <Button variant="ghost" className="pl-0 text-neutral-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
              </Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-48 md:h-64 bg-neutral-200 relative">
              {course.thumbnailUrl ? (
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  No image available
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="text-sm mb-2">Advanced Mathematics</div>
                <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-0">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">About this course</h2>
                    <p className="text-neutral-700">{course.description}</p>
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <div className="flex items-center text-sm text-neutral-700">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="mx-4 text-neutral-300">|</div>
                    <div className="flex items-center text-sm text-neutral-700">
                      <Book className="mr-1 h-4 w-4" />
                      <span>{course.lessonCount} lessons</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Your Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Course Content</h2>
                    
                    {isLoadingLessons ? (
                      <div className="space-y-3">
                        <div className="h-12 bg-neutral-100 rounded animate-pulse"></div>
                        <div className="h-12 bg-neutral-100 rounded animate-pulse"></div>
                        <div className="h-12 bg-neutral-100 rounded animate-pulse"></div>
                      </div>
                    ) : lessons && lessons.length > 0 ? (
                      <div className="space-y-2">
                        {lessons.map((lesson: any, index: number) => (
                          <div 
                            key={lesson.id} 
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              activeLesson === lesson.id 
                                ? "border-primary bg-blue-50" 
                                : "border-neutral-200 hover:border-primary hover:bg-neutral-50"
                            }`}
                            onClick={() => setActiveLesson(lesson.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-3">
                                  {index + 1}
                                </div>
                                <div>
                                  <h3 className="font-medium">{lesson.title}</h3>
                                </div>
                              </div>
                              {lesson.completed ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                              ) : (
                                <Play className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-500">No lessons available for this course.</p>
                    )}
                  </div>
                </div>
                
                <div className="w-full md:w-80">
                  <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                    <h3 className="text-lg font-semibold mb-4">Course Details</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-neutral-500">Instructor</div>
                        <div className="font-medium">Prof. Sarah Johnson</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-neutral-500">Level</div>
                        <div className="font-medium">Intermediate</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-neutral-500">Prerequisites</div>
                        <div className="font-medium">Basic Algebra</div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="text-sm text-neutral-500">Students Enrolled</div>
                        <div className="font-medium">2,345</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-neutral-500">Last Updated</div>
                        <div className="font-medium">June 15, 2023</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button className="w-full">
                        {course.progress > 0 ? "Continue Learning" : "Start Learning"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
