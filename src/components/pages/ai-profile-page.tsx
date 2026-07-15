import { PageBody } from "@/components/blocks/page-body";
import { AgentsChartCard } from "@/components/application/ai-profile/agents-chart-card";
import { AiProfileCard } from "@/components/application/ai-profile/ai-profile-card";
import { TokensChartCard } from "@/components/application/ai-profile/tokens-chart-card";

/**
 * AiProfilePage — the BoardUI Pro "AI Profile" template (Figma node
 * 4063:5675), rehosted on the house shell grammar (the Pro template's own
 * sidebar chrome is dropped — mount as a route inside `RoutedAppShell`).
 *
 * A single centered 680px column: the profile cover card (avatar, stats,
 * contributions heat grid), the 30-day agents bar chart, and the tokens
 * trend chart. Intentionally no PageHeader — the profile card IS the
 * page's header (same pattern as a social profile).
 *
 * Fork this for any "public profile + activity charts" surface (member
 * profile, agent detail, contributor page).
 */
export function AiProfilePage() {
  return (
    <PageBody className="items-center">
      <div className="flex w-full max-w-[680px] flex-col gap-4">
        <AiProfileCard />
        <AgentsChartCard />
        <TokensChartCard />
      </div>
    </PageBody>
  );
}
