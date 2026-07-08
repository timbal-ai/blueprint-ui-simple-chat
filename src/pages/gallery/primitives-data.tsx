import { InboxIcon, StarIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DemoCard, DemoGrid, GalleryPage } from "./section";

export default function GalleryData() {
  return (
    <GalleryPage
      title="Data display"
      description="Cards, tables, lists, and media surfaces."
    >
      <DemoGrid>
        <DemoCard title="Card · Avatar">
          <Card className="w-full max-w-sm">
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
        </DemoCard>

        <DemoCard title="Badge">
          <Badge>Default</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Paid</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="destructive">Overdue</Badge>
          <Badge variant="info">Synced</Badge>
          <Badge variant="destructive-solid">Failed</Badge>
        </DemoCard>

        <DemoCard title="Table" contentClassName="items-stretch">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>INV-001</TableCell>
                <TableCell>
                  <Badge variant="success">Paid</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>INV-002</TableCell>
                <TableCell>
                  <Badge variant="destructive">Overdue</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">$150.00</TableCell>
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
                <Button variant="outline" size="sm">
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
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Toggle the sidebar with
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>B</Kbd>
            </KbdGroup>
          </p>
          <Separator />
          <p className="text-sm text-muted-foreground">Content below the divider.</p>
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
            action={<Button size="sm">Create invoice</Button>}
          />
        </DemoCard>
      </DemoGrid>
    </GalleryPage>
  );
}
