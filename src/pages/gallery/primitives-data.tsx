import { InboxIcon, StarIcon } from "@/components/icons";

import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badge";
import { Chip } from "@/components/base/badges/chip";
import { StatusDot } from "@/components/base/badges/status-dot";
import { Button } from "@/components/base/buttons/button";
import { Kbd } from "@/components/base/kbd/kbd";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/base/table/table";
import { DataTableExample } from "@/components/application/data-table/data-table";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { DemoCard, DemoGrid, GalleryPage } from "./section";

export default function GalleryData() {
  return (
    <GalleryPage
      title="Data display"
      description="BoardUI chips, avatars, tables, and the advanced data table, plus retained cards, lists, and media surfaces."
    >
      <DemoGrid>
        <DemoCard title="Card · Avatar">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>Supporting description text.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar initials="TB" color="blue" />
              <div className="flex flex-col">
                <span className="text-body-medium text-text-primary">Timbal Blueprint</span>
                <span className="text-caption-1-medium text-text-secondary">Owner</span>
              </div>
            </CardContent>
          </Card>
        </DemoCard>

        <DemoCard title="Avatar sizes & tints">
          <Avatar size="xs" initials="A" />
          <Avatar size="sm" initials="BC" color="blue" />
          <Avatar size="md" initials="D" color="lime" />
          <Avatar size="lg" initials="EF" color="pink" />
          <Avatar size="md" src="/avatars/john-clarkson.jpg" alt="John Clarkson" />
        </DemoCard>

        <DemoCard title="Chip · Badge · Status dot" contentClassName="flex-col items-start">
          <div className="flex flex-wrap items-center gap-2">
            <Chip color="lime">Paid</Chip>
            <Chip color="yellow">Pending</Chip>
            <Chip color="rose">Overdue</Chip>
            <Chip color="blue">Synced</Chip>
            <Chip color="cyan">Confirmed</Chip>
            <Chip color="purple">+12.4%</Chip>
            <Chip color="neutral">Draft</Chip>
            <Chip color="gray">$1.250</Chip>
            <Chip color="soft">Outline-ish</Chip>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip variant="subtle" color="gray">
              Subtle price
            </Chip>
            <Chip variant="caption" color="blue">
              Role tag
            </Chip>
            <Badge color="primary">8</Badge>
            <Badge color="neutral">24</Badge>
            <span className="flex items-center gap-1.5 text-body-medium text-text-primary">
              <StatusDot color="green" /> Completed
            </span>
            <span className="flex items-center gap-1.5 text-body-medium text-text-primary">
              <StatusDot color="yellow" /> Waiting
            </span>
          </div>
        </DemoCard>

        <DemoCard title="Table" contentClassName="items-stretch">
          <Table aria-label="Invoices" size="sm">
            <TableHeader>
              <TableColumn isRowHeader>Invoice</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Amount</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>INV-001</TableCell>
                <TableCell>
                  <Chip color="lime">Paid</Chip>
                </TableCell>
                <TableCell>
                  <span className="tabular-nums">$250.00</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>INV-002</TableCell>
                <TableCell>
                  <Chip color="rose">Overdue</Chip>
                </TableCell>
                <TableCell>
                  <span className="tabular-nums">$150.00</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DemoCard>

        <DemoCard title="Accordion" contentClassName="items-stretch">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="a">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes — it follows the WAI-ARIA disclosure pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Is it styled by the DNA?</AccordionTrigger>
              <AccordionContent>
                Every color, radius, and motion value comes from tokens.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoCard>

        <DemoCard title="Item">
          <ItemGroup className="w-full">
            <Item>
              <ItemMedia variant="icon">
                <StarIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Starred workspace</ItemTitle>
                <ItemDescription>Pinned to the top of your list.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="secondary" size="small">
                  Manage
                </Button>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item>
              <ItemMedia variant="icon">
                <InboxIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Inbox</ItemTitle>
                <ItemDescription>12 unread notifications.</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </DemoCard>

        <DemoCard title="Carousel" contentClassName="justify-center">
          <Carousel className="w-full max-w-56">
            <CarouselContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <CarouselItem key={n}>
                  <div className="flex aspect-square items-center justify-center rounded-lg border border-border bg-muted/40 text-3xl font-semibold text-muted-foreground">
                    {n}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DemoCard>

        <DemoCard title="Aspect ratio" contentClassName="items-stretch">
          <AspectRatio
            ratio={16 / 9}
            className="flex items-center justify-center rounded-lg border border-border bg-muted/40 text-sm text-muted-foreground"
          >
            16 : 9
          </AspectRatio>
        </DemoCard>

        <DemoCard title="Kbd · Separator" contentClassName="flex-col items-start">
          <p className="flex items-center gap-1.5 text-body-regular text-text-secondary">
            Toggle the sidebar with
            <span className="flex items-center gap-1">
              <Kbd>⌘</Kbd>
              <Kbd>B</Kbd>
            </span>
          </p>
          <Separator />
          <p className="text-body-regular text-text-secondary">Content below the divider.</p>
        </DemoCard>

        <DemoCard title="Scroll area" contentClassName="items-stretch">
          <ScrollArea className="h-32 w-full rounded-lg border border-border p-3">
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i}>Scrollable row {i + 1}</span>
              ))}
            </div>
          </ScrollArea>
        </DemoCard>

        <DemoCard title="Empty state" contentClassName="items-stretch">
          <EmptyState
            icon={<InboxIcon />}
            title="No invoices yet"
            description="Invoices appear here as soon as you send one."
            action={<Button size="small">Create invoice</Button>}
          />
        </DemoCard>

        <DemoCard
          title="Data table (sorting · selection · filters)"
          className="lg:col-span-2 xl:col-span-3"
          contentClassName="items-stretch"
        >
          <DataTableExample />
        </DemoCard>
      </DemoGrid>
    </GalleryPage>
  );
}
