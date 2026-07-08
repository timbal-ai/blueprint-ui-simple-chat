import * as React from "react";
import {
  BoldIcon,
  CheckIcon,
  ItalicIcon,
  PlusIcon,
  SearchIcon,
  UnderlineIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupText,
} from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormSubmit,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPHiddenInput,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { DemoCard, DemoGrid, GalleryPage } from "./section";

const FRAMEWORKS = ["Next.js", "Vite", "Remix", "Astro", "Nuxt"];

export default function GalleryForms() {
  const [framework, setFramework] = React.useState<string | null>(null);
  const [comboOpen, setComboOpen] = React.useState(false);

  return (
    <GalleryPage
      title="Forms & inputs"
      description="Buttons, fields, and every input control — project-owned, DNA-token wired."
    >
      <DemoGrid>
        <DemoCard title="Button">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="link">Link</Button>
          <Button disabled>
            <Spinner />
            Saving…
          </Button>
          <Button size="sm">Small</Button>
          <Button size="icon" variant="outline" aria-label="Add">
            <PlusIcon />
          </Button>
        </DemoCard>

        <DemoCard title="Button group">
          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroupText>https://</ButtonGroupText>
            <Input placeholder="timbal.ai" className="rounded-l-none" />
          </ButtonGroup>
        </DemoCard>

        <DemoCard title="Input & input group" contentClassName="flex-col items-stretch">
          <Input placeholder="Plain input" aria-label="Plain input" />
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search…" aria-label="Search" />
          </InputGroup>
          <Input aria-invalid defaultValue="not-an-email" aria-label="Invalid input" />
        </DemoCard>

        <DemoCard title="Textarea" contentClassName="flex-col items-stretch">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pf-notes">Notes</Label>
            <Textarea id="pf-notes" placeholder="Anything we should know?" />
          </div>
        </DemoCard>

        <DemoCard title="Select">
          <Select>
            <SelectTrigger className="w-44" aria-label="Plan">
              <SelectValue placeholder="Choose a plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
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
          <div className="flex items-center gap-2">
            <Checkbox id="pf-terms" defaultChecked />
            <Label htmlFor="pf-terms">Email me a receipt</Label>
          </div>
          <RadioGroup defaultValue="monthly" className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="monthly" id="pf-monthly" />
              <Label htmlFor="pf-monthly">Monthly</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yearly" id="pf-yearly" />
              <Label htmlFor="pf-yearly">Yearly</Label>
            </div>
          </RadioGroup>
          <div className="flex items-center gap-2">
            <Switch id="pf-notify" defaultChecked />
            <Label htmlFor="pf-notify">Weekly summary</Label>
          </div>
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

        <DemoCard title="Field" contentClassName="items-stretch">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="pf-field-name">Workspace name</FieldLabel>
              <Input id="pf-field-name" placeholder="Acme Inc." />
              <FieldDescription>Shown on invoices and emails.</FieldDescription>
            </Field>
          </FieldGroup>
        </DemoCard>

        <DemoCard title="Form (validation)" contentClassName="items-stretch">
          <Form
            className="flex w-full flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <FormField name="email" className="flex flex-col gap-1.5">
              <FormLabel>Email</FormLabel>
              <FormControl asChild>
                <Input type="email" required placeholder="you@company.com" />
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
