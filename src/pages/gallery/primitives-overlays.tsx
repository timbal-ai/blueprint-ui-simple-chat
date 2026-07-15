import { Focusable } from "react-aria-components";
import {
  BellIcon,
  CalendarIcon,
  CreditCardIcon,
  SearchIcon,
  SettingsIcon,
  ShapesIcon,
  SmileIcon,
  UserIcon,
} from "@/components/icons";

import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { Select, SelectItem } from "@/components/base/select/select";
import { Switch } from "@/components/base/switch/switch";
import {
  SettingsDialog,
  SettingsDialogGroup,
  SettingsDialogRow,
  SettingsPlanCard,
} from "@/components/blocks/settings-dialog";
import { IconButton } from "@/components/base/buttons/icon-button";
import { SECONDARY_CHROME } from "@/components/base/buttons/secondary-chrome";
import { cx as cn } from "@/utils/cx";
import {
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { DemoCard, DemoGrid, GalleryPage } from "./section";

export default function GalleryOverlays() {
  return (
    <GalleryPage
      title="Overlays"
      description="Dialogs, menus, and floating panels — BoardUI dropdown and tooltip, retained portal surfaces."
    >
      <DemoGrid>
        <DemoCard title="Settings dialog">
          <SettingsDialogDemo />
        </DemoCard>
        <DemoCard title="Dialog · Alert dialog">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename project</DialogTitle>
                <DialogDescription>This only changes the display name.</DialogDescription>
              </DialogHeader>
              <Input label="Name" defaultValue="Blueprint" />
              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="danger">Delete…</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this invoice?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DemoCard>

        <DemoCard title="Sheet · Drawer">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit invoice</SheetTitle>
                <SheetDescription>Side panel for record editing.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="secondary">Open drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Quick actions</DrawerTitle>
                <DrawerDescription>Bottom drawer for mobile flows.</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Confirm</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button variant="secondary">Wide drawer (xl)</Button>
            </DrawerTrigger>
            {/* size presets: sm | default | lg | xl | full — width for side
                drawers, height for top/bottom. Wide sizes fit previews
                (e.g. blocks/pdf-viewer) next to a table. */}
            <DrawerContent size="xl">
              <DrawerHeader>
                <DrawerTitle>Document preview</DrawerTitle>
                <DrawerDescription>
                  A side drawer sized for content — pair with PdfViewer or a form.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Done</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </DemoCard>

        <DemoCard title="Popover · Hover card · Tooltip">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 text-sm">
              Rich content panel — forms, help text, filters.
            </PopoverContent>
          </Popover>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@timbal</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 text-sm">
              The AI platform for building enterprise apps.
            </HoverCardContent>
          </HoverCard>
          <TooltipTrigger delay={0}>
            <Focusable>
              <IconButton icon={SearchIcon} aria-label="Search" />
            </Focusable>
            <Tooltip>Search everything</Tooltip>
          </TooltipTrigger>
        </DemoCard>

        <DemoCard title="Dropdown · Context menu">
          <Dropdown>
            <DropdownTrigger
              className={cn(
                "inline-flex h-9 items-center rounded-2lg px-3 text-body-medium text-text-primary transition-colors",
                SECONDARY_CHROME,
              )}
            >
              Menu
            </DropdownTrigger>
            <DropdownPopover aria-label="Invoice actions">
              <DropdownGroup label="Invoice">
                <DropdownItem>
                  <span className="text-body-medium text-text-primary">Duplicate</span>
                </DropdownItem>
                <DropdownItem>
                  <span className="text-body-medium text-text-primary">Export CSV</span>
                </DropdownItem>
              </DropdownGroup>
              <DropdownDivider />
              <DropdownGroup>
                <DropdownItem>
                  <span className="text-body-medium text-text-error-primary">Delete</span>
                </DropdownItem>
              </DropdownGroup>
            </DropdownPopover>
          </Dropdown>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div className="flex h-16 w-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                Right-click me
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Copy</ContextMenuItem>
              <ContextMenuItem>Paste</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </DemoCard>

        <DemoCard title="Menubar">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New invoice <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>Open…</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Print</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Undo</MenubarItem>
                <MenubarItem>Redo</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </DemoCard>

        <DemoCard title="Command" contentClassName="items-stretch" className="lg:col-span-2 xl:col-span-1">
          <Command className="rounded-lg border border-border">
            <CommandInput placeholder="Type a command or search…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <CalendarIcon />
                  Calendar
                </CommandItem>
                <CommandItem>
                  <SmileIcon />
                  Search emoji
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>
                  <UserIcon />
                  Profile
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <SettingsIcon />
                  Settings
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DemoCard>
      </DemoGrid>
    </GalleryPage>
  );
}

/** The forkable settings-dialog recipe — mirrors the reference modal. */
function SettingsDialogDemo() {
  const general = (
    <>
      <SettingsPlanCard
        chip={<Chip variant="caption">Current plan</Chip>}
        title="Ultra $149/mo"
        description="You are on 7x more usage than Regular."
        action={<Button variant="secondary" size="small">Upgrade to Max</Button>}
        artwork={
          <div className="h-full w-full bg-gradient-to-l from-blue-200 via-purple-100 to-transparent" />
        }
      />
      <SettingsDialogRow
        title="Limits"
        description="You are on 7x more usage than Premium"
      >
        <Button variant="secondary" size="small">Manage limits</Button>
      </SettingsDialogRow>
      <SettingsDialogGroup label="Pull Requests">
        <SettingsDialogRow
          title="Review provider"
          description="Select GitHub or other providers for reviews"
        >
          <Select aria-label="Review provider" size="sm" defaultSelectedKey="github">
            <SelectItem id="github">GitHub</SelectItem>
            <SelectItem id="gitlab">GitLab</SelectItem>
            <SelectItem id="bitbucket">Bitbucket</SelectItem>
          </Select>
        </SettingsDialogRow>
        <SettingsDialogRow
          title="PR destination"
          description="Open pull request links inside your app"
        >
          <Select aria-label="PR destination" size="sm" defaultSelectedKey="inside">
            <SelectItem id="inside">Inside app</SelectItem>
            <SelectItem id="browser">Browser</SelectItem>
          </Select>
        </SettingsDialogRow>
      </SettingsDialogGroup>
      <SettingsDialogGroup label="Notifications">
        <SettingsDialogRow
          title="Critical requests"
          description="Get notified when the model needs a critical decision"
        >
          <Switch aria-label="Critical requests" defaultSelected />
        </SettingsDialogRow>
        <SettingsDialogRow
          title="System notifications"
          description="Show notifications when an agent completes a task"
        >
          <Switch aria-label="System notifications" />
        </SettingsDialogRow>
      </SettingsDialogGroup>
    </>
  );

  const placeholder = (label: string) => (
    <SettingsDialogRow title={label} description={`${label} settings live here.`} />
  );

  return (
    <SettingsDialog
      trigger={<Button variant="secondary">Open settings</Button>}
      groups={[
        {
          items: [
            { id: "general", label: "General", icon: SettingsIcon, content: general },
            { id: "profile", label: "Profile", icon: UserIcon, content: placeholder("Profile") },
            { id: "appearance", label: "Appearance", icon: ShapesIcon, content: placeholder("Appearance") },
            { id: "billing", label: "Billing", icon: CreditCardIcon, content: placeholder("Billing") },
          ],
        },
        {
          label: "Workspace",
          items: [
            { id: "notifications", label: "Notifications", icon: BellIcon, content: placeholder("Notifications") },
          ],
        },
      ]}
    />
  );
}
