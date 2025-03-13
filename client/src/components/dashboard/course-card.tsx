import { Clock, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration: string;
  lessonCount: number;
  progress: number;
  status: "not-started" | "in-progress" | "completed";
}

export function CourseCard({
  id,
  title,
  description,
  thumbnailUrl,
  duration,
  lessonCount,
  progress,
  status
}: CourseCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "in-progress":
        return (
          <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
            In Progress
          </div>
        );
      case "completed":
        return (
          <div className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded-full">
            Completed
          </div>
        );
      case "not-started":
        return (
          <div className="absolute top-3 right-3 bg-neutral-700 text-white text-xs px-2 py-1 rounded-full">
            New
          </div>
        );
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "in-progress":
        return "Continue";
      case "completed":
        return "Review Course";
      case "not-started":
        return "Start Course";
    }
  };

  const getButtonStyle = () => {
    if (status === "completed") {
      return "bg-neutral-200 text-neutral-700 hover:bg-neutral-300";
    }
    return "bg-primary text-white hover:bg-blue-700";
  };

  const getProgressColor = () => {
    if (status === "completed") {
      return "bg-success";
    }
    return "bg-primary";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-40 bg-neutral-200 relative">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={`${title} course thumbnail`} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No image available
          </div>
        )}
        {getStatusBadge()}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-neutral-700 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center mb-3">
          <div className="flex items-center text-sm text-neutral-700">
            <Clock className="mr-1 h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="mx-2 text-neutral-300">|</div>
          <div className="flex items-center text-sm text-neutral-700">
            <Book className="mr-1 h-4 w-4" />
            <span>{lessonCount} lessons</span>
          </div>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2" 
            indicatorColor={getProgressColor()}
          />
        </div>
        <Link href={`/courses/${id}`}>
          <Button 
            className={cn("w-full", getButtonStyle())}
          >
            {getButtonText()}
          </Button>
        </Link>
      </div>
    </div>
  );
}
