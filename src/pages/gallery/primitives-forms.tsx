import * as React from "react";
import {
  BoldIcon,
  CheckIcon,
  ItalicIcon,
  PlusIcon,
  SearchIcon,
  UnderlineIcon,
} from "@/components/icons";

import { Button } from "@/components/base/buttons/button";
import {
  ButtonGroup,
  ButtonGroupItem,
} from "@/components/base/buttons/button-group";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input, InputBase } from "@/components/base/input/input";
import { Radio, RadioGroup } from "@/components/base/radio/radio";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { Select, SelectItem } from "@/components/base/select/select";
import { Switch } from "@/components/base/switch/switch";

import {
  Combobox,
  ComboboxCommand,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormSubmit,
} from "@/components/ui/form";
import { Input as UiInput } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPHiddenInput,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label as UiLabel } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { DemoCard, DemoGrid, GalleryPage } from "./section";

const FRAMEWORKS = ["Next.js", "Vite", "Remix", "Astro", "Nuxt"];

export default function GalleryForms() {
  const [framework, setFramework] = React.useState<string | null>(null);
  const [comboOpen, setComboOpen] = React.useState(false);
  const [plan, setPlan] = React.useState<string | null>(null);

  return (
    <GalleryPage
      title="Forms & inputs"
      description="BoardUI buttons, fields, and selection controls, plus the retained form machinery."
    >
      <DemoGrid>
        <DemoCard title="Button">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Delete</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
          <Button size="small">Small</Button>
          <Button size="xs">Extra small</Button>
          <Button variant="secondary" leadingIcon={PlusIcon}>
            New invoice
          </Button>
          <Button iconOnly leadingIcon={PlusIcon} aria-label="Add" />
          <IconButton icon={SearchIcon} size="small" aria-label="Search" />
        </DemoCard>

        <DemoCard title="Button group">
          <ButtonGroup aria-label="Range">
            <ButtonGroupItem selected>Day</ButtonGroupItem>
            <ButtonGroupItem>Week</ButtonGroupItem>
            <ButtonGroupItem>Month</ButtonGroupItem>
          </ButtonGroup>
          <ButtonGroup size="small" aria-label="Formatting">
            <ButtonGroupItem iconOnly leadingIcon={BoldIcon} aria-label="Bold" />
            <ButtonGroupItem iconOnly leadingIcon={ItalicIcon} aria-label="Italic" />
            <ButtonGroupItem iconOnly leadingIcon={UnderlineIcon} aria-label="Underline" />
          </ButtonGroup>
        </DemoCard>

        <DemoCard title="Input" contentClassName="flex-col items-stretch">
          <Input
            label="Workspace name"
            isRequired
            placeholder="Acme Inc."
            hint="Shown on invoices and emails."
          />
          <InputBase
            aria-label="Search"
            placeholder="Search"
            leadingIcon={SearchIcon}
            fieldClassName="rounded-full bg-background-secondary-default"
          />
          <Input
            label="Email"
            isInvalid
            defaultValue="not-an-email"
            hint="Not a valid email."
          />
        </DemoCard>

        <DemoCard title="Textarea" contentClassName="flex-col items-stretch">
          <div className="flex flex-col gap-1.5">
            <UiLabel htmlFor="pf-notes">Notes</UiLabel>
            <Textarea id="pf-notes" placeholder="Anything we should know?" />
          </div>
        </DemoCard>

        <DemoCard title="Select">
          <Select
            aria-label="Plan"
            placeholder="Choose a plan"
            className="w-44"
            selectedKey={plan}
            onSelectionChange={(k) => setPlan(k === null ? null : String(k))}
          >
            <SelectItem id="starter" textValue="Starter">
              Starter
            </SelectItem>
            <SelectItem id="pro" textValue="Pro">
              Pro
            </SelectItem>
            <SelectItem id="enterprise" textValue="Enterprise">
              Enterprise
            </SelectItem>
          </Select>
        </DemoCard>

        <DemoCard title="Combobox">
          <Combobox open={comboOpen} onOpenChange={setComboOpen}>
            <ComboboxTrigger className="w-52">
              {framework ?? "Select framework…"}
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxCommand>
                <ComboboxInput placeholder="Search framework…" />
                <ComboboxList>
                  <ComboboxEmpty>No framework found.</ComboboxEmpty>
                  {FRAMEWORKS.map((f) => (
                    <ComboboxItem
                      key={f}
                      value={f}
                      onSelect={() => {
                        setFramework(f);
                        setComboOpen(false);
                      }}
                    >
                      {f}
                      {framework === f ? <CheckIcon className="ml-auto" /> : null}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxCommand>
            </ComboboxContent>
          </Combobox>
        </DemoCard>

        <DemoCard title="Checkbox · Radio · Switch" contentClassName="flex-col items-start">
          <Checkbox defaultSelected>Email me a receipt</Checkbox>
          <Checkbox isIndeterminate>Select all line items</Checkbox>
          <RadioGroup
            aria-label="Billing period"
            defaultValue="monthly"
            orientation="horizontal"
            className="flex-row gap-4"
          >
            <Radio value="monthly">Monthly</Radio>
            <Radio value="yearly">Yearly</Radio>
          </RadioGroup>
          <Switch defaultSelected>Weekly summary</Switch>
          <Switch size="sm">Compact toggle</Switch>
        </DemoCard>

        <DemoCard title="Segmented control">
          <SegmentedControl
            aria-label="Reporting period"
            defaultSelectedKeys={new Set(["monthly"])}
          >
            <SegmentedControlItem id="weekly">Weekly</SegmentedControlItem>
            <SegmentedControlItem id="monthly">Monthly</SegmentedControlItem>
            <SegmentedControlItem id="yearly">Yearly</SegmentedControlItem>
          </SegmentedControl>
        </DemoCard>

        <DemoCard title="Slider" contentClassName="items-stretch">
          <Slider defaultValue={[64]} max={100} step={1} aria-label="Volume" />
        </DemoCard>

        <DemoCard title="Toggle & toggle group">
          <Toggle aria-label="Toggle bold">
            <BoldIcon />
          </Toggle>
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <BoldIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <ItalicIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <UnderlineIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </DemoCard>

        <DemoCard title="Input OTP">
          <InputOTP>
            <InputOTPGroup>
              <InputOTPSlot />
              <InputOTPSlot />
              <InputOTPSlot />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot />
              <InputOTPSlot />
              <InputOTPSlot />
            </InputOTPGroup>
            <InputOTPHiddenInput />
          </InputOTP>
        </DemoCard>

        <DemoCard title="Form (validation)" contentClassName="items-stretch">
          <Form
            className="flex w-full flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <FormField name="email" className="flex flex-col gap-1.5">
              <FormLabel>Email</FormLabel>
              <FormControl asChild>
                <UiInput type="email" required placeholder="you@company.com" />
              </FormControl>
              <FormMessage match="valueMissing">Enter your email.</FormMessage>
              <FormMessage match="typeMismatch">Not a valid email.</FormMessage>
            </FormField>
            <FormSubmit asChild>
              <Button className="self-start">Subscribe</Button>
            </FormSubmit>
          </Form>
        </DemoCard>
      </DemoGrid>
    </GalleryPage>
  );
}
