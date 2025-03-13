import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, BookOpen, GraduationCap, 
  Calendar, Trophy, Settings, 
  ChevronUp, ChevronDown, 
  Menu, X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center px-4 py-3 rounded-lg font-medium cursor-pointer",
        active 
          ? "text-primary bg-blue-50" 
          : "text-neutral-700 hover:bg-neutral-100"
      )}>
        <span className="mr-3 text-xl">{icon}</span>
        <span>{label}</span>
      </div>
    </Link>
  );
};

interface SubjectProps {
  name: string;
  href: string;
}

const subjects: SubjectProps[] = [
  { name: "Mathematics", href: "/subjects/mathematics" },
  { name: "Physics", href: "/subjects/physics" },
  { name: "Computer Science", href: "/subjects/computer-science" },
  { name: "Biology", href: "/subjects/biology" },
  { name: "Chemistry", href: "/subjects/chemistry" },
];

interface SidebarProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const [location] = useLocation();
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSubjects = () => {
    setIsSubjectOpen(!isSubjectOpen);
  };

  const sidebarClasses = cn(
    "bg-white w-64 h-full shadow-lg fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 ease-in-out",
    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-neutral-700"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <aside className={sidebarClasses}>
        <div className="p-5 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <span className="text-primary text-2xl font-bold">LearnHub</span>
              </div>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-neutral-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            <SidebarItem 
              icon={<Home />} 
              label="Home" 
              href="/" 
              active={location === "/"} 
            />
            <SidebarItem 
              icon={<BookOpen />} 
              label="My Courses" 
              href="/courses" 
              active={location === "/courses"} 
            />
            
            <div className="relative">
              <button 
                className="w-full flex items-center justify-between px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium"
                onClick={toggleSubjects}
              >
                <div className="flex items-center">
                  <GraduationCap className="mr-3 text-xl" />
                  <span>Subject Areas</span>
                </div>
                {isSubjectOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              
              <div className={cn("pl-10 mt-1", isSubjectOpen ? "block" : "hidden")}>
                {subjects.map((subject) => (
                  <Link key={subject.name} href={subject.href}>
                    <div className="block py-2 text-neutral-700 hover:text-primary cursor-pointer">
                      {subject.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <SidebarItem 
              icon={<Calendar />} 
              label="Calendar" 
              href="/calendar" 
              active={location === "/calendar"} 
            />
            <SidebarItem 
              icon={<Trophy />} 
              label="Achievements" 
              href="/achievements" 
              active={location === "/achievements"} 
            />
            <SidebarItem 
              icon={<Settings />} 
              label="Settings" 
              href="/settings" 
              active={location === "/settings"} 
            />
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-neutral-200">
          <Link href="/profile">
            <div className="flex items-center cursor-pointer hover:bg-neutral-100 p-2 rounded-lg">
              <Avatar className="h-8 w-8">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-700">{user.name}</p>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
