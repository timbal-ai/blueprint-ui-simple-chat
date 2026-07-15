import type {
  ButtonHTMLAttributes,
  ComponentType,
  ReactNode,
  Ref,
} from "react";
import { cx, sortCx } from "@/utils/cx";
import {
  SECONDARY_CHROME,
  SECONDARY_DISABLED,
} from "@/components/base/buttons/secondary-chrome";

/**
 * Figma source: Board UI → Buttons (node 3656:13819).
 *
 * Variant matrix from Figma:
 *   Type     = Primary | Secondary | Danger
 *   Size     = Medium  | Small | Xs
 *   State    = Default | Hover | Active | Disabled        (CSS pseudo)
 *   OnlyIcon = false   | true
 *
 * Sizing (1:1 with Figma):
 *
 *                       Medium                    Small                     Xs
 *   container          h=36, p=8,   r=10         h=32, px=8 py=6, r=8      h=24, px=8, r=4
 *   gap                 2px                       2px                      1.33px→1
 *   icon                20×20                     18×18                    14×14
 *   label wrapper       px=4                      px=2                     px=2
 *   text style          Body 1/Medium             Body 1/Medium            Caption 1/Semibold
 *   icon-only square    36×36 (content-derived)   32×32 (forced size)      24×24 (forced size)
 *
 * `xs` is the smallest tier — first needed for the calendar template's
 * event-details modal ("Join" / edit-icon buttons, node 3920:10954), which
 * scales every dimension down by the same ~0.667 factor from Figma; the
 * table above rounds those to clean pixel values rather than reproducing
 * the fractional source numbers.
 *
 * Icons are rendered by the component itself via the `leadingIcon` /
 * `trailingIcon` props so the consumer can't pass the wrong size. Pass
 * a Remix Icon component reference (`RiAddLine`, not `<RiAddLine />`).
 *
 * For icon-only buttons:
 *   <Button iconOnly leadingIcon={RiAddLine} aria-label="Add" />
 *
 * The HTML `type` prop is preserved; Figma's "Type" enum is renamed to
 * `variant` to avoid the clash.
 */

/**
 * Project extension (2026-07-14): `ghost` (borderless toolbar/quiet action)
 * and `link` (inline text action) tiers — BoardUI ships neither, this app
 * needs both everywhere. Styled strictly with BoardUI semantic tokens.
 */
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link";
type ButtonSize = "medium" | "small" | "xs";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

const styles = sortCx({
  base: [
    "inline-flex items-center justify-center gap-0.5 whitespace-nowrap overflow-hidden",
    "font-sans select-none cursor-pointer",
    "transition-[background-color,border-color,box-shadow,color] duration-150 ease",
    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus-ring",
    "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed",
  ].join(" "),

  // Base shape per size (used when label is present OR medium icon-only).
  size: {
    medium: "h-9 rounded-2lg p-2 text-body-medium",
    small:  "h-8 rounded-lg px-2 py-1.5 text-body-medium",
    xs:     "h-6 rounded-sm px-2 text-caption-1-semibold",
  },

  // Icon-only override:
  //   Medium → keep p-2; w expands from content (8+20+8 = 36) → square.
  //   Small  → Figma forces 32×32 even though 8+18+8=34, so we hard-set size-8
  //            and zero the padding; the inner flex centers the 18px icon.
  //   Xs     → forces 24×24, content-centered — used for the calendar
  //            template's edit-icon buttons (timezone/participants/reminder).
  iconOnlySize: {
    medium: "",                // base size already produces 36×36 with a 20px icon
    small:  "size-8 p-0",      // hard 32×32, content-centered
    xs:     "size-6 p-0",      // hard 24×24, content-centered
  },

  icon: {
    medium: "size-5 shrink-0",        // 20px
    small:  "size-[18px] shrink-0",   // 18px
    xs:     "size-3.5 shrink-0",      // 14px
  },

  label: {
    medium: "inline-flex items-center justify-center px-1 shrink-0",    // px=4
    small:  "inline-flex items-center justify-center px-0.5 shrink-0",  // px=2
    xs:     "inline-flex items-center justify-center px-0.5 shrink-0",  // px=2
  },

  variant: {
    // Filled tiers keep BoardUI's gradient and add the soft drop (house finish).
    primary: [
      "bg-button-primary text-foreground-full",
      "shadow-[0_1px_2px_0_rgb(0_0_0/0.14),0_2px_4px_-2px_rgb(0_0_0/0.10)]",
      "disabled:text-foreground-disabled disabled:shadow-none",
      "aria-disabled:text-foreground-disabled aria-disabled:shadow-none",
    ].join(" "),
    danger: [
      "bg-button-danger text-foreground-full",
      "shadow-[0_1px_2px_0_rgb(0_0_0/0.14),0_2px_4px_-2px_rgb(0_0_0/0.10)]",
      "disabled:text-foreground-disabled-danger disabled:shadow-none",
      "aria-disabled:text-foreground-disabled-danger aria-disabled:shadow-none",
    ].join(" "),
    // Project extension (2026-07-14): secondary carries a SUBTLE top-lit
    // gradient + soft drop shadow (house finish) instead of BoardUI's flat
    // white. The recipe lives in `secondary-chrome.ts` and is shared by
    // EVERY button-like control (Select trigger, date-picker trigger,
    // ButtonGroup, pagination…) so toolbars never mix two surfaces.
    secondary: cx(
      "text-text-primary",
      SECONDARY_CHROME,
      SECONDARY_DISABLED,
      "disabled:text-text-tertiary aria-disabled:text-text-tertiary",
    ),
    ghost: [
      "bg-transparent text-text-secondary",
      "hover:bg-background-primary-hover hover:text-text-primary",
      "active:bg-background-primary-active",
      "disabled:text-text-disabled aria-disabled:text-text-disabled",
    ].join(" "),
    link: [
      "h-auto rounded-none border-0 bg-transparent p-0 text-text-primary underline-offset-4",
      "hover:underline",
      "disabled:text-text-disabled aria-disabled:text-text-disabled",
    ].join(" "),
  },
});

export function Button({
  variant = "primary",
  size = "medium",
  iconOnly = false,
  leadingIcon: Leading,
  trailingIcon: Trailing,
  children,
  className,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        styles.base,
        styles.size[size],
        styles.variant[variant],
        iconOnly && styles.iconOnlySize[size],
        className,
      )}
      {...props}
    >
      {Leading ? <Leading className={styles.icon[size]} aria-hidden /> : null}
      {!iconOnly && children !== undefined && children !== null && (
        <span className={styles.label[size]}>{children}</span>
      )}
      {!iconOnly && Trailing ? (
        <Trailing className={styles.icon[size]} aria-hidden />
      ) : null}
    </button>
  );
}
