import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import CourseDetails from "@/pages/course-details";
import Courses from "@/pages/courses";
import Profile from "@/pages/profile";
import Subject from "@/pages/subject";
import Calendar from "@/pages/calendar";
import Achievements from "@/pages/achievements";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetails} />
      <Route path="/profile" component={Profile} />
      <Route path="/subjects/:name" component={Subject} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/achievements" component={Achievements} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
