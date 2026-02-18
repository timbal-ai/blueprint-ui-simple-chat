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
      <header className="flex shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <img
            src={currentTheme === "dark" ? "/timbal_w.svg" : "/timbal_b.svg"}
            alt="Timbal"
            className="h-5 w-auto"
          />
          {workforces.length > 0 && (
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-[220px]">
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
          )}
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isAuthEnabled && (
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="size-4" />
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
