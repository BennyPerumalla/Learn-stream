import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutGrid,
  List,
  BookOpen
} from "lucide-react";

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });
  
  // Fetch courses data
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/courses"],
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
  
  // Get the current month and year
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = date ? monthNames[date.getMonth()] : "";
  const currentYear = date ? date.getFullYear() : new Date().getFullYear();
  
  // Function to get the previous month
  const goToPreviousMonth = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() - 1);
      setDate(newDate);
    }
  };
  
  // Function to get the next month
  const goToNextMonth = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + 1);
      setDate(newDate);
    }
  };
  
  // Generate dummy events for demo purposes
  const generateEvents = () => {
    if (!courses) return [];
    
    const events = [];
    const today = new Date();
    
    // Create events based on enrolled courses
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      
      // Create events in the current month
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() - today.getDay() + i + 1); // Create events in the current week
      
      events.push({
        id: i,
        title: `Study: ${course.title}`,
        date: eventDate,
        type: "study",
        courseId: course.id
      });
      
      // Create a second event for some courses
      if (i % 2 === 0) {
        const secondEventDate = new Date(today);
        secondEventDate.setDate(today.getDate() + 7 + i); // Create events in the next week
        
        events.push({
          id: i + 100,
          title: `Assignment: ${course.title}`,
          date: secondEventDate,
          type: "assignment",
          courseId: course.id
        });
      }
    }
    
    return events;
  };
  
  const events = generateEvents();
  
  // Filter events for the current date
  const getEventsForDate = (dateToCheck: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === dateToCheck.getDate() &&
        eventDate.getMonth() === dateToCheck.getMonth() &&
        eventDate.getFullYear() === dateToCheck.getFullYear()
      );
    });
  };
  
  // Format date for display
  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Get streak days for highlighting in calendar
  const streakDays = streaks?.map(streak => new Date(streak.date)) || [];
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={userData} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
        <Header onSearch={handleSearch} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold mb-2 md:mb-0">Learning Calendar</h1>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={view === "calendar" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setView("calendar")}
                className="flex items-center"
              >
                <LayoutGrid className="mr-1 h-4 w-4" />
                <span>Calendar</span>
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setView("list")}
                className="flex items-center"
              >
                <List className="mr-1 h-4 w-4" />
                <span>List</span>
              </Button>
            </div>
          </div>
          
          {view === "calendar" ? (
            <Card className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-medium">{currentMonth} {currentYear}</h2>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    streak: streakDays
                  }}
                  modifiersClassNames={{
                    streak: "bg-green-100 text-green-800 font-bold"
                  }}
                />
              </div>
              
              {date && events.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">
                    Events for {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </h3>
                  
                  <div className="space-y-2">
                    {getEventsForDate(date).length > 0 ? (
                      getEventsForDate(date).map(event => (
                        <div 
                          key={event.id} 
                          className={`p-3 rounded-md border ${
                            event.type === 'study' 
                              ? 'border-blue-200 bg-blue-50' 
                              : 'border-amber-200 bg-amber-50'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`p-2 rounded-full mr-3 ${
                              event.type === 'study' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-amber-100 text-amber-600'
                            }`}>
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-sm text-neutral-500">{formatEventDate(event.date)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-neutral-500">No events scheduled for this day.</p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-4 md:p-6">
              <h2 className="text-xl font-medium mb-4">Upcoming Schedule</h2>
              
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map(event => (
                      <div 
                        key={event.id} 
                        className="p-4 rounded-md border hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${
                            event.type === 'study' 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-amber-100 text-amber-600'
                          }`}>
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-neutral-500">{formatEventDate(event.date)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <p className="text-neutral-500">No upcoming events.</p>
              )}
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}