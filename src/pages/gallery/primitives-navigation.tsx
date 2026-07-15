import * as React from "react";
import { ChevronsUpDownIcon, HomeIcon } from "@/components/icons";

import {
  Breadcrumb,
  BreadcrumbItem,
} from "@/components/base/breadcrumb/breadcrumb";
import { Button } from "@/components/base/buttons/button";
import { Pagination } from "@/components/base/pagination/pagination";
import { Tab, TabList, TabPanel, Tabs } from "@/components/base/tabs/tabs";

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
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { DemoCard, DemoGrid, GalleryPage } from "./section";

export default function GalleryNavigation() {
  const [open, setOpen] = React.useState(true);
  const [page, setPage] = React.useState(2);

  return (
    <GalleryPage
      title="Navigation"
      description="Wayfinding — BoardUI breadcrumbs, tabs, and pagination, plus retained menus and panels."
    >
      <DemoGrid>
        <DemoCard title="Breadcrumb" contentClassName="items-start">
          <Breadcrumb>
            <BreadcrumbItem icon={HomeIcon} href="/gallery">
              Workspace
            </BreadcrumbItem>
            <BreadcrumbItem href="/gallery">Billing</BreadcrumbItem>
            <BreadcrumbItem current>Invoices</BreadcrumbItem>
          </Breadcrumb>
        </DemoCard>

        <DemoCard title="Tabs" contentClassName="items-stretch">
          <Tabs defaultSelectedKey="overview">
            <TabList aria-label="Invoice sections">
              <Tab id="overview">Overview</Tab>
              <Tab id="activity" count={8}>
                Activity
              </Tab>
              <Tab id="settings">Settings</Tab>
            </TabList>
            <TabPanel id="overview" className="text-body-regular text-text-secondary">
              Tab content renders here.
            </TabPanel>
            <TabPanel id="activity" className="text-body-regular text-text-secondary">
              Recent activity.
            </TabPanel>
            <TabPanel id="settings" className="text-body-regular text-text-secondary">
              Settings form.
            </TabPanel>
          </Tabs>
        </DemoCard>

        <DemoCard title="Pagination" contentClassName="items-stretch">
          <Pagination page={page} totalPages={10} onChange={setPage} />
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
              <span className="text-body-medium text-text-primary">3 starred workspaces</span>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="small"
                  iconOnly
                  leadingIcon={ChevronsUpDownIcon}
                  aria-label="Toggle list"
                />
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
