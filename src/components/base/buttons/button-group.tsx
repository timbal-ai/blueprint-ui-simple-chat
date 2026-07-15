import type {
  ButtonHTMLAttributes,
  ComponentType,
  ReactNode,
  Ref,
} from "react";
import { cx, sortCx } from "@/utils/cx";
import {
  SECONDARY_ACTIVE,
  SECONDARY_BORDER,
  SECONDARY_GRADIENT,
  SECONDARY_HOVER,
  SECONDARY_SHADOW,
} from "@/components/base/buttons/secondary-chrome";

/**
 * Button group — a row of secondary-style buttons fused into one control:
 * shared 1px border/button/default container with radius/2lg and shadow/xs,
 * items divided by 1px hairlines, only the outer corners rounded. The classic
 * toolbar / filter pattern ("Left | Center | Right").
 *
 * Sizing follows Button's secondary sizes:
 *   medium  h=36, px=12, Body 1/Medium, 20px icons
 *   small   h=32, px=10, Body 1/Medium, 18px icons
 *
 * Items can be text, icon + text, or icon-only (pass `iconOnly` +
 * `aria-label`). A pressed/selected item (`selected`) keeps the hover fill —
 * drive it from state for single or multi select toolbars, or leave every
 * item unselected for pure action rows. For a full segmented switcher with
 * animated thumb, see SegmentedControl instead.
 */

type ButtonGroupSize = "medium" | "small";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const styles = sortCx({
  // Container carries the shared secondary border + shadow; each item paints
  // its own slice of the shared gradient so the group reads as ONE secondary
  // button divided by hairlines.
  group: cx(
    "inline-flex items-stretch isolate",
    "rounded-2lg overflow-hidden",
    SECONDARY_BORDER,
    SECONDARY_SHADOW,
    "divide-x divide-border-button-default",
  ),

  item: cx(
    "inline-flex items-center justify-center gap-1 whitespace-nowrap",
    "text-text-primary font-sans select-none cursor-pointer",
    SECONDARY_GRADIENT,
    SECONDARY_HOVER,
    SECONDARY_ACTIVE,
    "transition-[background-color,color] duration-150 ease",
    "outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring",
    "disabled:cursor-not-allowed disabled:bg-none disabled:bg-background-primary-disabled disabled:text-text-tertiary",
  ),

  size: {
    medium: "h-[34px] px-3 text-body-medium",
    small: "h-[30px] px-2.5 text-body-medium",
  },

  iconOnlySize: {
    medium: "w-[34px] px-0",
    small: "w-[30px] px-0",
  },

  icon: {
    medium: "size-5 shrink-0",
    small: "size-[18px] shrink-0",
  },

  // Selected pins the hover STOPS (a bg-color would hide under the gradient).
  selected:
    "from-background-primary-hover to-[color-mix(in_srgb,var(--color-background-primary-hover)_97%,black)]",
});

/* ------------------------------------------------------------------- group */

export interface ButtonGroupProps {
  size?: ButtonGroupSize;
  /** ButtonGroupItem children. */
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  ref?: Ref<HTMLDivElement>;
}

export function ButtonGroup({ size = "medium", children, className, ref, ...props }: ButtonGroupProps) {
  return (
    <div ref={ref} role="group" data-size={size} className={cx(styles.group, className)} {...props}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------- item */

export interface ButtonGroupItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  size?: ButtonGroupSize;
  /** Highlights the item like its hover state; sets aria-pressed. */
  selected?: boolean;
  iconOnly?: boolean;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

export function ButtonGroupItem({
  size = "medium",
  selected = false,
  iconOnly = false,
  leadingIcon: Leading,
  trailingIcon: Trailing,
  children,
  className,
  type = "button",
  ref,
  ...props
}: ButtonGroupItemProps) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected || undefined}
      className={cx(
        styles.item,
        styles.size[size],
        iconOnly && styles.iconOnlySize[size],
        selected && styles.selected,
        className,
      )}
      {...props}
    >
      {Leading ? <Leading className={styles.icon[size]} aria-hidden /> : null}
      {!iconOnly && children !== undefined && children !== null && <span>{children}</span>}
      {!iconOnly && Trailing ? <Trailing className={styles.icon[size]} aria-hidden /> : null}
    </button>
  );
}
