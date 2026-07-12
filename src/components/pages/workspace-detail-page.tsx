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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  active: { label: "Active", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  paused: { label: "Paused", variant: "outline" },
};

function DnsTable({ records }: { records: DnsRecord[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Proxy</TableHead>
          <TableHead className="text-right">TTL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={`${record.type}-${record.name}`}>
            <TableCell>
              <Badge variant="outline" className="font-mono text-xs">
                {record.type}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{record.name}</TableCell>
            <TableCell className="max-w-[12rem] truncate font-mono text-xs text-muted-foreground">
              {record.content}
            </TableCell>
            <TableCell>
              {record.proxied ? (
                <Badge variant="info">Proxied</Badge>
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

  return (
    <PageBody className="gap-4">
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
            <Badge variant={status.variant}>{status.label}</Badge>
            <Badge variant="secondary">{workspace.plan}</Badge>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => onAction?.("purge")}>
              <RefreshIcon />
              Purge cache
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm" aria-label="More actions">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onAction?.("edit")}>
                  <PencilIcon />
                  Edit zone
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction?.("copy-id")}>
                  <CopyIcon />
                  Copy zone ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <MetadataGrid
        items={[
          { label: "Zone ID", value: workspace.id },
          { label: "Created", value: workspace.created },
          { label: "Nameserver", value: workspace.nameservers },
          { label: "SSL mode", value: workspace.sslMode },
          { label: "Traffic (30d)", value: workspace.traffic },
          { label: "Plan", value: workspace.plan },
        ]}
      />

      <Tabs defaultValue="dns" className="gap-4">
        <TabsList>
          <TabsTrigger value="dns">DNS</TabsTrigger>
          <TabsTrigger value="ssl">SSL</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="dns">
          <DetailSection
            title="DNS records"
            action={
              <Button variant="outline" size="sm" onClick={() => onAction?.("add-record")}>
                Add record
              </Button>
            }
          >
            <DnsTable records={dnsRecords} />
          </DetailSection>
        </TabsContent>
        <TabsContent value="ssl" className="flex flex-col gap-3">
          <SecurityRow
            icon={LockIcon}
            title="SSL/TLS encryption mode"
            description={workspace.sslMode}
            status={<Badge variant="success">Enabled</Badge>}
          />
          <SecurityRow
            icon={ShieldIcon}
            title="Always use HTTPS"
            description="Redirect all HTTP requests to HTTPS"
            status={<Badge variant="success">On</Badge>}
          />
        </TabsContent>
        <TabsContent value="security" className="flex flex-col gap-3">
          <SecurityRow
            icon={ShieldIcon}
            title="Web Application Firewall"
            description="Managed ruleset blocking common threats"
            status={<Badge variant="success">Active</Badge>}
          />
          <SecurityRow
            icon={BoltIcon}
            title="DDoS protection"
            description="Automatic L3/L4 mitigation"
            status={<Badge variant="info">Always on</Badge>}
          />
          <SecurityRow
            icon={ServerIcon}
            title="Bot fight mode"
            description="Challenge automated traffic"
            status={<Badge variant="outline">Off</Badge>}
          />
        </TabsContent>
        <TabsContent value="analytics" className="flex flex-col gap-3">
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
        </TabsContent>
      </Tabs>
    </PageBody>
  );
}

export { WorkspaceDetailPage, DEMO_WORKSPACE, DEMO_DNS };
export type { Workspace, DnsRecord };
