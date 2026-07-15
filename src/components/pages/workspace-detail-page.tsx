import * as React from "react";
import {
  ActivityIcon,
  ArrowLeftIcon,
  BoltIcon,
  CopyIcon,
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  PencilIcon,
  RefreshIcon,
  ServerIcon,
  ShieldIcon,
  type IconComponent,
} from "@/components/icons";

import { PageBody } from "@/components/blocks/page-body";
import { PageHeader } from "@/components/blocks/page-header";
import {
  DetailSection,
  MetadataGrid,
  RecordDetailHeader,
} from "@/components/blocks/detail-panel";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { SECONDARY_CHROME } from "@/components/base/buttons/secondary-chrome";
import { cx as cn } from "@/utils/cx";
import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/base/table/table";
import { Tab, TabList, TabPanel, Tabs } from "@/components/base/tabs/tabs";

/**
 * WorkspaceDetailPage — condensed infra/zone record detail (Cloudflare
 * dashboard grammar): breadcrumb eyebrow, compact header with globe tile,
 * MetadataGrid, tabbed DNS / SSL / Security / Analytics sections. Fork for
 * domains, workspaces, projects, or any infrastructure record route.
 */

interface Workspace {
  id: string;
  name: string;
  status: "active" | "pending" | "paused";
  plan: string;
  created: string;
  nameservers: string;
  sslMode: string;
  traffic: string;
}

interface DnsRecord {
  type: string;
  name: string;
  content: string;
  proxied: boolean;
  ttl: string;
}

const DEMO_WORKSPACE: Workspace = {
  id: "zone_8f3a2b1c",
  name: "example.com",
  status: "active",
  plan: "Pro",
  created: "Mar 4, 2023",
  nameservers: "ada.ns.cloudflare.com",
  sslMode: "Full (strict)",
  traffic: "1.2M requests / 30d",
};

const DEMO_DNS: DnsRecord[] = [
  { type: "A", name: "example.com", content: "192.0.2.1", proxied: true, ttl: "Auto" },
  { type: "CNAME", name: "www", content: "example.com", proxied: true, ttl: "Auto" },
  { type: "MX", name: "example.com", content: "mail.example.com", proxied: false, ttl: "1h" },
  { type: "TXT", name: "_dmarc", content: "v=DMARC1; p=reject", proxied: false, ttl: "1h" },
];

const STATUS_BADGE: Record<
  Workspace["status"],
  { label: string; color: React.ComponentProps<typeof Chip>["color"] }
> = {
  active: { label: "Active", color: "lime" },
  pending: { label: "Pending", color: "yellow" },
  paused: { label: "Paused", color: "soft" },
};

function DnsTable({ records }: { records: DnsRecord[] }) {
  return (
    <Table aria-label="DNS records" size="sm">
      <TableHeader>
        <TableColumn isRowHeader>Type</TableColumn>
        <TableColumn>Name</TableColumn>
        <TableColumn>Content</TableColumn>
        <TableColumn>Proxy</TableColumn>
        <TableColumn className="text-right">TTL</TableColumn>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={`${record.type}-${record.name}`}>
            <TableCell>
              <Chip variant="caption" color="soft" className="font-mono">
                {record.type}
              </Chip>
            </TableCell>
            <TableCell className="font-medium">{record.name}</TableCell>
            <TableCell className="max-w-[12rem] truncate font-mono text-xs text-muted-foreground">
              {record.content}
            </TableCell>
            <TableCell>
              {record.proxied ? (
                <Chip variant="caption" color="blue">Proxied</Chip>
              ) : (
                <span className="text-sm text-muted-foreground">DNS only</span>
              )}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">{record.ttl}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SecurityRow({
  icon: Icon,
  title,
  description,
  status,
}: {
  icon: IconComponent;
  title: string;
  description: string;
  status: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {status}
    </div>
  );
}

function WorkspaceDetailPage({
  workspace = DEMO_WORKSPACE,
  dnsRecords = DEMO_DNS,
  parentLabel = "Zones",
  onBack,
  onAction,
}: {
  workspace?: Workspace;
  dnsRecords?: DnsRecord[];
  parentLabel?: string;
  onBack?: () => void;
  onAction?: (action: string) => void;
}) {
  const status = STATUS_BADGE[workspace.status];
  const [menuOpen, setMenuOpen] = React.useState(false);
  const selectMenuAction = (action: string) => {
    setMenuOpen(false);
    onAction?.(action);
  };

  return (
    <PageBody className="mx-auto w-full max-w-3xl gap-10">
      <div className="flex flex-col gap-5">
        <PageHeader
          eyebrow={
            <button
              type="button"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
              onClick={onBack}
            >
              <ArrowLeftIcon className="size-3.5" />
              <span>
                {parentLabel}
                <span className="text-muted-foreground/50"> / </span>
                <span className="text-foreground">{workspace.name}</span>
              </span>
            </button>
          }
          title=""
          description=""
          className="gap-2"
        />

        <RecordDetailHeader
          leading={
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
              <GlobeIcon className="size-5 text-muted-foreground" />
            </div>
          }
          title={workspace.name}
          subtitle={`Zone ID ${workspace.id}`}
          badges={
            <>
              <Chip variant="caption" color={status.color}>{status.label}</Chip>
              <Chip variant="caption" color="gray">{workspace.plan}</Chip>
            </>
          }
          actions={
            <>
              <Button
                variant="secondary"
                size="small"
                leadingIcon={RefreshIcon}
                onClick={() => onAction?.("purge")}
              >
                Purge cache
              </Button>
              <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownTrigger
                  aria-label="More actions"
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground-icon-primary transition-colors [&_svg]:size-4",
                    SECONDARY_CHROME,
                  )}
                >
                  <MoreHorizontalIcon />
                </DropdownTrigger>
                <DropdownPopover aria-label="More actions" placement="bottom end" className="w-56">
                  <DropdownGroup>
                    <DropdownItem onSelect={() => selectMenuAction("edit")}>
                      <PencilIcon className="size-4 shrink-0 text-foreground-icon-secondary" />
                      <span className="text-body-medium text-text-primary">Edit zone</span>
                    </DropdownItem>
                    <DropdownItem onSelect={() => selectMenuAction("copy-id")}>
                      <CopyIcon className="size-4 shrink-0 text-foreground-icon-secondary" />
                      <span className="text-body-medium text-text-primary">Copy zone ID</span>
                    </DropdownItem>
                  </DropdownGroup>
                </DropdownPopover>
              </Dropdown>
            </>
          }
        />
      </div>

      <MetadataGrid
        className="gap-y-4 lg:grid-cols-2"
        items={[
          { label: "Zone ID", value: workspace.id },
          { label: "Created", value: workspace.created },
          { label: "Nameserver", value: workspace.nameservers },
          { label: "SSL mode", value: workspace.sslMode },
          { label: "Traffic (30d)", value: workspace.traffic },
          { label: "Plan", value: workspace.plan },
        ]}
      />

      <Tabs defaultSelectedKey="dns" className="gap-6">
        <TabList aria-label="Zone sections">
          <Tab id="dns">DNS</Tab>
          <Tab id="ssl">SSL</Tab>
          <Tab id="security">Security</Tab>
          <Tab id="analytics">Analytics</Tab>
        </TabList>
        <TabPanel id="dns">
          <DetailSection
            title="DNS records"
            action={
              <Button variant="secondary" size="small" onClick={() => onAction?.("add-record")}>
                Add record
              </Button>
            }
          >
            <DnsTable records={dnsRecords} />
          </DetailSection>
        </TabPanel>
        <TabPanel id="ssl" className="flex flex-col gap-3">
          <SecurityRow
            icon={LockIcon}
            title="SSL/TLS encryption mode"
            description={workspace.sslMode}
            status={<Chip variant="caption" color="lime">Enabled</Chip>}
          />
          <SecurityRow
            icon={ShieldIcon}
            title="Always use HTTPS"
            description="Redirect all HTTP requests to HTTPS"
            status={<Chip variant="caption" color="lime">On</Chip>}
          />
        </TabPanel>
        <TabPanel id="security" className="flex flex-col gap-3">
          <SecurityRow
            icon={ShieldIcon}
            title="Web Application Firewall"
            description="Managed ruleset blocking common threats"
            status={<Chip variant="caption" color="lime">Active</Chip>}
          />
          <SecurityRow
            icon={BoltIcon}
            title="DDoS protection"
            description="Automatic L3/L4 mitigation"
            status={<Chip variant="caption" color="blue">Always on</Chip>}
          />
          <SecurityRow
            icon={ServerIcon}
            title="Bot fight mode"
            description="Challenge automated traffic"
            status={<Chip variant="caption" color="soft">Off</Chip>}
          />
        </TabPanel>
        <TabPanel id="analytics" className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Requests", value: "1.2M", icon: ActivityIcon },
              { label: "Bandwidth", value: "84 GB", icon: ServerIcon },
              { label: "Threats blocked", value: "12.4K", icon: ShieldIcon },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
              >
                <stat.icon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-medium tabular-nums">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </PageBody>
  );
}

export { WorkspaceDetailPage, DEMO_WORKSPACE, DEMO_DNS };
export type { Workspace, DnsRecord };
