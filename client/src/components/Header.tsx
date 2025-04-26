import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <h1 className="ml-2 text-2xl font-semibold text-neutral-900">TenderLens</h1>
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-neutral-700 hover:text-primary">
                <CircleHelp className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help & Documentation</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
