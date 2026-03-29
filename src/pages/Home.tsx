import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { LogOut } from "lucide-react";
import type { WorkforceItem } from "@timbal-ai/timbal-sdk";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TimbalChat,
  Button,
  authFetch,
  useSession,
} from "@timbal-ai/timbal-react";

const isAuthEnabled = !!import.meta.env.VITE_TIMBAL_PROJECT_ID;

const Home = () => {
  const { theme, systemTheme } = useTheme();
  const { logout } = useSession();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const [workforces, setWorkforces] = useState<WorkforceItem[]>([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authFetch("/api/workforce");
        if (!res.ok) return;
        const data: WorkforceItem[] = await res.json();
        setWorkforces(data);
        if (data.length > 0) {
          const agent = data.find((w) => w.type === "agent");
          const item = agent ?? data[0];
          setSelectedId(item.id ?? item.uid ?? item.name ?? "");
        }
      } catch {
        // silently fail
      }
    };
    load();
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border/50 bg-background/90 px-5 py-2 backdrop-blur-md">
        <div className="flex items-center">
          <img
            src={currentTheme === "dark" ? "/timbal_w.svg" : "/timbal_b.svg"}
            alt="Timbal"
            className="h-4 w-auto"
          />
          {workforces.length > 0 && (
            <>
              <div className="mx-3.5 h-3.5 w-px bg-border" />
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="h-7 w-auto min-w-0 gap-1.5 border-none bg-transparent px-1.5 text-xs font-medium text-muted-foreground shadow-none ring-0 hover:text-foreground focus:ring-0 [&>svg]:size-3">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {workforces.map((w) => {
                    const val = w.id ?? w.uid ?? w.name ?? "";
                    return (
                      <SelectItem key={val} value={val}>
                        {w.name ?? val}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <ModeToggle />
          {isAuthEnabled && (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Logout"
              className="size-8 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-3.5" />
            </Button>
          )}
        </div>
      </header>

      {/* Chat */}
      <TimbalChat
        workforceId={selectedId}
        key={selectedId}
        className="min-h-0 flex-1"
        welcome={{
          heading: import.meta.env.VITE_WELCOME_HEADING || "How can I help you today?",
          subheading: import.meta.env.VITE_WELCOME_SUBHEADING || "Send a message to start a conversation.",
        }}
      />
    </div>
  );
};

export default Home;
