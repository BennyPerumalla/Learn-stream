import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Trophy, Brain, Flashlight } from "lucide-react";

interface ProgressCardProps {
  title: string;
  subtitle: string;
  description: string;
  progress?: number;
  progressLabel?: string;
  link?: {
    text: string;
    href: string;
  };
  type: "course" | "streak" | "achievement";
  streakDays?: number[];
  achievements?: { icon: string; color: string }[];
}

export function ProgressCard({
  title,
  subtitle,
  description,
  progress,
  progressLabel,
  link,
  type,
  streakDays,
  achievements,
}: ProgressCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{title}</h3>
        {progressLabel && (
          <span className="text-sm text-primary">{progressLabel}</span>
        )}
      </div>
      <div className="mb-3">
        <div className="text-lg font-semibold mb-1">{subtitle}</div>
        <div className="text-neutral-700 text-sm">{description}</div>
      </div>

      {type === "course" && progress !== undefined && (
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {type === "streak" && streakDays && (
        <>
          <div className="flex justify-between space-x-1 mb-1">
            {streakDays.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 flex-1 rounded-full",
                  day ? "bg-primary" : "bg-neutral-200"
                )}
              ></div>
            ))}
          </div>
          <div className="text-neutral-700 text-xs mt-1">Mon, Tue, Wed, Thu, Fri</div>
        </>
      )}

      {type === "achievement" && achievements && (
        <div className="flex space-x-2 mt-2">
          {achievements.slice(0, 3).map((achievement, index) => (
            <div
              key={index}
              className="h-10 w-10 bg-neutral-200 rounded-full flex items-center justify-center"
            >
              {achievement.icon === "trophy" && (
                <Trophy className={`h-5 w-5 text-${achievement.color}`} />
              )}
              {achievement.icon === "brain" && (
                <Brain className={`h-5 w-5 text-${achievement.color}`} />
              )}
              {achievement.icon === "flashlight" && (
                <Flashlight className={`h-5 w-5 text-${achievement.color}`} />
              )}
            </div>
          ))}
          {achievements.length > 3 && (
            <div className="h-10 w-10 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-700 text-xs font-medium">
              +{achievements.length - 3}
            </div>
          )}
        </div>
      )}

      {link && (
        <div className="mt-4">
          <a
            href={link.href}
            className="text-primary text-sm font-medium hover:underline"
          >
            {link.text} →
          </a>
        </div>
      )}
    </div>
  );
}
