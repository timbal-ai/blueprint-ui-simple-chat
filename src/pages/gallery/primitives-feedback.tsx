import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/base/buttons/button";
import {
  PageHeaderSkeleton,
  StatGridSkeleton,
  TableSkeleton,
} from "@/components/blocks/page-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

import { DemoCard, DemoGrid, GalleryPage } from "./section";

export default function GalleryFeedback() {
  const [progress, setProgress] = React.useState(35);

  React.useEffect(() => {
    const t = setInterval(
      () => setProgress((p) => (p >= 100 ? 15 : p + 10)),
      1200,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <GalleryPage
      title="Feedback"
      description="Alerts, loading states, progress, and toasts."
    >
      <DemoGrid>
        <DemoCard title="Alert" contentClassName="flex-col items-stretch">
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>Neutral informational message.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Sync failed</AlertTitle>
            <AlertDescription>
              The last export did not complete. Retry from the integrations page.
            </AlertDescription>
          </Alert>
        </DemoCard>

        <DemoCard title="Progress" contentClassName="items-stretch">
          <Progress value={progress} aria-label="Upload progress" />
        </DemoCard>

        <DemoCard title="Skeleton · Spinner" contentClassName="flex-col items-stretch">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
          <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
            <Spinner /> Loading region
          </div>
        </DemoCard>

        <DemoCard
          title="PageSkeleton — the default loading state"
          contentClassName="flex-col items-stretch gap-4"
          className="lg:col-span-2"
        >
          <p className="text-sm text-muted-foreground">
            Pages gated on data render skeletons of the grammar they will
            show — never “…” text or a bare spinner. Full page:{" "}
            <code>PageSkeleton</code>; per band:{" "}
            <code>PageHeaderSkeleton</code> / <code>StatGridSkeleton</code> /{" "}
            <code>TableSkeleton</code> / <code>CardSkeleton</code>.
          </p>
          <PageHeaderSkeleton />
          <StatGridSkeleton count={4} />
          <TableSkeleton rows={3} />
        </DemoCard>

        <DemoCard title="Toast (sonner)">
          <Button
            variant="secondary"
            onClick={() => toast.success("Invoice INV-2026-115 sent")}
          >
            Show success toast
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.error("Export failed — retry")}
          >
            Show error toast
          </Button>
        </DemoCard>
      </DemoGrid>
    </GalleryPage>
  );
}
