import { useState, type ReactNode } from "react";
import { RiQuestionLine } from "@remixicon/react";
import { Button as AriaButton } from "react-aria-components";
import { DataTableExample } from "@/components/application/data-table/data-table";
import { EarningsChartCard } from "@/components/application/dashboard/earnings-chart-card";
import { LineChartCard } from "@/components/application/dashboard/line-chart-card";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Switch } from "@/components/base/switch/switch";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverTrigger,
  Sheet,
  SheetBody,
  SheetFooter,
  SheetHeader,
  toast,
} from "@/components/timbal/overlays";

/** Demo pages shared by the shell examples. Demos, not templates. */

/** Overview: vendored BoardUI blocks composed the dashboard-template way. */
export function OverviewDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <StatCards />
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <LineChartCard />
        <EarningsChartCard className="xl:w-full" />
      </div>
      <DataTableExample pageSize={5} showSizeToggle={false} />
    </div>
  );
}

function SettingsRow({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-body-medium text-text-primary">{title}</span>
        <span className="text-body-regular text-text-secondary">{hint}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

const TOAST_DEMOS = [
  { label: "Success", fire: () => toast.success("Saved", { description: "Your changes are live." }) },
  { label: "Error", fire: () => toast.error("Export failed", { action: { label: "Retry", onClick: () => toast.info("Retrying…") } }) },
  { label: "Info", fire: () => toast.info("New version available") },
  { label: "Warning", fire: () => toast.warning("Storage almost full", { description: "92% of 10 GB used." }) },
];

/** Settings: opens the Modal and a Sheet, fires every toast kind, a Popover. */
export function SettingsDemo() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <section className="flex flex-col divide-y divide-separator-border rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      <SettingsRow title="Profile" hint="Name and email shown to your team.">
        <Button variant="secondary" onClick={() => setProfileOpen(true)}>
          Edit profile
        </Button>
      </SettingsRow>
      <SettingsRow title="Notifications" hint="Choose what reaches your inbox.">
        <Button variant="secondary" onClick={() => setNotificationsOpen(true)}>
          Open panel
        </Button>
      </SettingsRow>
      <SettingsRow title="Toasts" hint="Feedback for saves, failures and warnings.">
        {TOAST_DEMOS.map(({ label, fire }) => (
          <Button key={label} size="small" variant="secondary" onClick={fire}>
            {label}
          </Button>
        ))}
      </SettingsRow>
      <SettingsRow title="Help" hint="An anchored popover for inline guidance.">
        <PopoverTrigger>
          <AriaButton className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-border-button-default bg-background-primary-default px-2 text-body-medium text-text-primary shadow-xs outline-none transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            <RiQuestionLine className="size-[18px] text-foreground-icon-secondary" aria-hidden />
            Why these settings?
          </AriaButton>
          <Popover aria-label="About settings" placement="bottom end" className="w-72 p-4" dialogClassName="gap-2">
            {({ close }) => (
              <>
                <p className="text-body-medium text-text-primary">Workspace defaults</p>
                <p className="text-body-regular text-text-secondary">
                  These apply to every member unless they override them in their own profile.
                </p>
                <Button size="small" variant="secondary" className="self-end" onClick={close}>
                  Got it
                </Button>
              </>
            )}
          </Popover>
        </PopoverTrigger>
      </SettingsRow>

      <Modal isOpen={profileOpen} onOpenChange={setProfileOpen} size="md">
        <ModalHeader title="Edit profile" description="Changes apply across the workspace." />
        <ModalBody className="flex flex-col gap-4">
          <Input label="Full name" defaultValue="Ada Lovelace" />
          <Input label="Email" type="email" defaultValue="ada@acme.com" />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setProfileOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setProfileOpen(false);
              toast.success("Profile updated");
            }}
          >
            Save changes
          </Button>
        </ModalFooter>
      </Modal>

      <Sheet isOpen={notificationsOpen} onOpenChange={setNotificationsOpen} side="right" size="md">
        <SheetHeader title="Notifications" description="Delivered to ada@acme.com." />
        <SheetBody className="flex flex-col gap-4">
          {["Weekly digest", "Mentions", "Billing alerts"].map((label) => (
            <Switch key={label} size="sm" defaultSelected className="w-full flex-row-reverse justify-between">
              {label}
            </Switch>
          ))}
        </SheetBody>
        <SheetFooter>
          <Button
            onClick={() => {
              setNotificationsOpen(false);
              toast.success("Preferences saved");
            }}
          >
            Done
          </Button>
        </SheetFooter>
      </Sheet>
    </section>
  );
}
