import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { LogOut } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isAuthEnabled, useSession } from "@/auth/provider";
import { authFetch } from "@/auth/tokens";
import { Thread } from "@/components/assistant-ui/thread";
import { TimbalRuntimeProvider } from "@/components/assistant-ui/timbal-runtime";

interface Workforce {
  id: string;
  name: string;
}

const Home = () => {
  const { theme, systemTheme } = useTheme();
  const { logout } = useSession();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const [workforces, setWorkforces] = useState<Workforce[]>([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authFetch("/api/workforce");
        if (!res.ok) return;
        const data: Workforce[] = (await res.json()).map((w: any) => ({
          id: w.id,
          name: w.name ?? w.id,
        }));
        setWorkforces(data);
        if (data.length > 0) setSelectedId(data[0].id);
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
                  {workforces.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
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
      <TimbalRuntimeProvider workforceId={selectedId}>
        <div className="min-h-0 flex-1">
          <Thread />
        </div>
      </TimbalRuntimeProvider>
    </div>
  );
};

export default Home;
