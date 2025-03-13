import { User } from "lucide-react";

interface RecommendedCardProps {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  studentCount: string;
  duration: string;
}

export function RecommendedCard({
  id,
  title,
  description,
  thumbnailUrl,
  studentCount,
  duration
}: RecommendedCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex">
      <div className="h-20 w-20 bg-neutral-200 rounded-lg overflow-hidden flex-shrink-0">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No image
          </div>
        )}
      </div>
      <div className="ml-4">
        <h3 className="font-medium text-neutral-900">{title}</h3>
        <p className="text-sm text-neutral-700 my-1 line-clamp-2">{description}</p>
        <div className="flex items-center mt-2">
          <div className="text-xs text-neutral-500 flex items-center">
            <User className="mr-1 h-3 w-3" />
            <span>{studentCount} students</span>
          </div>
          <div className="mx-2 text-neutral-300">•</div>
          <div className="text-xs text-neutral-500">{duration}</div>
        </div>
      </div>
    </div>
  );
}
