import { useState } from "react";
import { Search, Bell, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread notifications",
    });
  };

  const handleHelpClick = () => {
    toast({
      title: "Help Center",
      description: "The help center will be available soon!",
    });
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
          <Input
            type="text"
            placeholder="Search for courses, lessons..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
        </form>
          
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative rounded-full text-neutral-700 hover:bg-neutral-100"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-white text-xs">
              3
            </span>
          </Button>
            
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-neutral-700 hover:bg-neutral-100"
            onClick={handleHelpClick}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
