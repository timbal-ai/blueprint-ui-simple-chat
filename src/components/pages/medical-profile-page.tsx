import { useState } from "react";
import { RiAddFill, RiFilter3Fill } from "@remixicon/react";

import { PageBody } from "@/components/blocks/page-body";
import { PageHeader } from "@/components/blocks/page-header";
import { ActivityRingsCard } from "@/components/application/medical/activity-rings-card";
import { ImportantAlertsCard } from "@/components/application/medical/important-alerts-card";
import type { SelectedDay } from "@/components/application/medical/medical-data";
import { MostActiveDaysCard } from "@/components/application/medical/most-active-days-card";
import { PatientInfoCard } from "@/components/application/medical/patient-info-card";
import { PatientsTable } from "@/components/application/medical/patients-table";
import { SleepScoreCard } from "@/components/application/medical/sleep-score-card";
import { StepsCard } from "@/components/application/medical/steps-card";
import { Button } from "@/components/base/buttons/button";

/**
 * MedicalProfilePage — the BoardUI Pro "Medical Report" template (Figma
 * node 3950:5573), rehosted on the house shell grammar (`RoutedAppShell` +
 * `PageHeader`; the Pro template's own sidebar/header chrome is dropped).
 *
 * Rhythm: PageHeader with actions → a 3-per-row (2 at md, 1 stacked) grid
 * of six 330px cards — patient info, weekly steps (count-up + week
 * switcher), sleep score ring, most-active-days month calendar (click a
 * day…), activity rings (…and this card swaps to that day), important
 * alerts — then the patients table.
 *
 * The steps/sleep/rings/most-active cards are the BoardUI Pro versions
 * (application/medical/*) — richer than the house interactive-charts kit
 * for health verticals. Fork this page for patient/member/wellbeing
 * report screens.
 */
export function MedicalProfilePage({
  onAction,
}: {
  onAction?: (action: string) => void;
} = {}) {
  // Selected calendar day — Most active days reports clicks here, and the
  // Activity card swaps its rings/values to that day's data.
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>({ month: 6, day: 10 });

  return (
    <PageBody>
      <PageHeader
        title="Medical profile"
        description="Patient vitals, activity, and care alerts."
        actions={
          <>
            <Button
              variant="secondary"
              size="medium"
              leadingIcon={RiFilter3Fill}
              onClick={() => onAction?.("Filters")}
            >
              Filters
            </Button>
            <Button
              variant="primary"
              size="medium"
              leadingIcon={RiAddFill}
              onClick={() => onAction?.("File a report")}
            >
              File a report
            </Button>
          </>
        }
      />

      {/* One grid for all six cards: 2-per-row at md with no empty cell,
          3-per-row at xl (the Figma layout). */}
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PatientInfoCard />
        <StepsCard />
        <SleepScoreCard />
        <MostActiveDaysCard selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        <ActivityRingsCard selectedDay={selectedDay} />
        <ImportantAlertsCard />
      </div>

      <PatientsTable />
    </PageBody>
  );
}
