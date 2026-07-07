import * as React from "react";
import { InboxIcon, PlusIcon, SearchIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DataTable,
  DataTableColumnHeader,
  type ColumnDef,
} from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Page, Section } from "@/components/app/page";
import { Stat, StatGrid } from "@/components/app/stat";

/**
 * Component gallery — dev/CI surface, not a product screen. Gated by
 * VITE_GALLERY. The screenshot smoke check renders this page at 1280 and
 * 375 px so layout regressions (cropped headers, overflow) can't land unseen.
 */

interface DemoRow {
  id: string;
  customer: string;
  status: "active" | "paused" | "churned";
  amount: number;
}

const DEMO_ROWS: DemoRow[] = [
  { id: "ord-1042", customer: "Herradura Cafe", status: "active", amount: 1290 },
  { id: "ord-1041", customer: "Vinoveo", status: "active", amount: 860 },
  { id: "ord-1040", customer: "Deportes Alvarado", status: "paused", amount: 2140 },
  { id: "ord-1039", customer: "WGM Villas", status: "active", amount: 460 },
  { id: "ord-1038", customer: "Rhein Logistics", status: "churned", amount: 3320 },
];

const fmtEur = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(n);

const demoColumns: ColumnDef<DemoRow>[] = [
  { accessorKey: "id", header: "Order", size: 110 },
  { accessorKey: "customer", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const status = row.getValue<DemoRow["status"]>("status");
      const variant =
        status === "active" ? "success" : status === "paused" ? "warning" : "outline";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" className="-mr-2 ml-auto flex" />
    ),
    size: 120,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{fmtEur(row.getValue("amount"))}</div>
    ),
  },
];

function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="size-8 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: `var(${token})` }}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function Gallery() {
  return (
    <Page
      title="Component gallery"
      description="Every project-owned component in its states. Dev/CI only — not a product screen."
      width="wide"
    >
      <Section title="Tokens" id="tokens">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          <Swatch token="--background" label="background" />
          <Swatch token="--card" label="card" />
          <Swatch token="--primary" label="primary" />
          <Swatch token="--muted" label="muted" />
          <Swatch token="--accent" label="accent" />
          <Swatch token="--border" label="border" />
          <Swatch token="--success" label="success" />
          <Swatch token="--warning" label="warning" />
          <Swatch token="--destructive" label="destructive" />
          <Swatch token="--info" label="info" />
          <Swatch token="--chart-1" label="chart-1" />
          <Swatch token="--chart-2" label="chart-2" />
        </div>
      </Section>

      <Section title="Buttons" id="buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
          <Button disabled>
            <Spinner />
            Saving…
          </Button>
          <Button size="sm" variant="outline">
            Small
          </Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="outline" aria-label="Add">
            <PlusIcon />
          </Button>
        </div>
      </Section>

      <Section title="Form controls" id="forms">
        <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="g-name">Name</Label>
            <Input id="g-name" placeholder="Acme Inc." />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="g-plan">Plan</Label>
            <Select>
              <SelectTrigger id="g-plan" className="w-full">
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="g-notes">Notes</Label>
            <Textarea id="g-notes" placeholder="Anything we should know?" />
            <p className="text-xs text-muted-foreground">
              Help text sits under the control.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="g-terms" defaultChecked />
            <Label htmlFor="g-terms">Email me a receipt</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="g-notify" defaultChecked />
            <Label htmlFor="g-notify">Weekly summary</Label>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="g-invalid">Invalid state</Label>
            <Input
              id="g-invalid"
              aria-invalid
              defaultValue="not-an-email"
              placeholder="you@company.com"
            />
            <p className="text-xs text-destructive">Enter a valid email address.</p>
          </div>
        </div>
      </Section>

      <Section title="Badges & alerts" id="feedback">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="destructive">Failed</Badge>
        </div>
        <div className="grid max-w-3xl grid-cols-1 gap-3">
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
        </div>
      </Section>

      <Section title="Stats" id="stats">
        <StatGrid>
          <Stat label="Revenue" value="€48.2k" delta="+8.1%" deltaTone="positive" hint="vs last month" />
          <Stat label="Active customers" value="1,284" />
          <Stat label="Churn" value="2.1%" delta="-0.4pt" deltaTone="neutral" />
          <Stat label="Open tickets" value="17" hint="3 urgent" />
        </StatGrid>
      </Section>

      <Section title="Data table" id="table">
        <DataTable columns={demoColumns} data={DEMO_ROWS} pagination={false} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DataTable columns={demoColumns} data={[]} pagination={false} />
          <DataTable columns={demoColumns} data={[]} loading pagination={false} />
        </div>
      </Section>

      <Section title="Overlays" id="overlays">
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename project</DialogTitle>
                <DialogDescription>
                  This only changes the display name.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="g-rename">Name</Label>
                <Input id="g-rename" defaultValue="Blueprint" />
              </div>
              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Order</DropdownMenuLabel>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Export CSV</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Search">
                  <SearchIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search everything</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Section>

      <Section title="Navigation & structure" id="structure">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Orders</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>ord-1042</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Tabs defaultValue="overview" className="max-w-xl">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-sm text-muted-foreground">
            Tab content renders here.
          </TabsContent>
          <TabsContent value="activity" className="text-sm text-muted-foreground">
            Recent activity.
          </TabsContent>
          <TabsContent value="settings" className="text-sm text-muted-foreground">
            Settings form.
          </TabsContent>
        </Tabs>
        <Separator className="max-w-xl" />
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Supporting description text.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>TB</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm text-foreground">Timbal Blueprint</span>
              <span className="text-xs text-muted-foreground">Owner</span>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="States" id="states">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <EmptyState
            icon={<InboxIcon />}
            title="No orders yet"
            description="Orders appear here as soon as customers check out."
            action={<Button size="sm">Create test order</Button>}
          />
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
              <Spinner /> Loading region
            </div>
          </div>
        </div>
      </Section>
    </Page>
  );
}
