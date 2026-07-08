import * as React from "react";
import { ChevronsUpDownIcon } from "lucide-react";

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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DemoCard, DemoGrid, GalleryPage } from "./section";

export default function GalleryNavigation() {
  const [open, setOpen] = React.useState(true);

  return (
    <GalleryPage
      title="Navigation"
      description="Wayfinding — breadcrumbs, tabs, pagination, menus, and panels."
    >
      <DemoGrid>
        <DemoCard title="Breadcrumb" contentClassName="items-start">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Billing</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Invoices</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DemoCard>

        <DemoCard title="Tabs" contentClassName="items-stretch">
          <Tabs defaultValue="overview" className="w-full">
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
        </DemoCard>

        <DemoCard title="Pagination" contentClassName="justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </DemoCard>

        <DemoCard title="Navigation menu">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-64 gap-1 p-2">
                    <NavigationMenuLink href="#">Dashboards</NavigationMenuLink>
                    <NavigationMenuLink href="#">Workflows</NavigationMenuLink>
                    <NavigationMenuLink href="#">Knowledge bases</NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" className="px-3 py-1.5 text-sm">
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </DemoCard>

        <DemoCard title="Collapsible" contentClassName="items-stretch">
          <Collapsible open={open} onOpenChange={setOpen} className="w-full">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">3 starred workspaces</span>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Toggle list">
                  <ChevronsUpDownIcon />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="flex flex-col gap-1.5 pt-2">
              {["Design systems", "Billing", "Growth"].map((w) => (
                <span
                  key={w}
                  className="rounded-md border border-border px-3 py-1.5 text-sm"
                >
                  {w}
                </span>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </DemoCard>

        <DemoCard title="Resizable" contentClassName="items-stretch">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-32 rounded-lg border border-border"
          >
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                One
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Two
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </DemoCard>
      </DemoGrid>
    </GalleryPage>
  );
}
