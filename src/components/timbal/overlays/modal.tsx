"use client";

import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type DialogProps as AriaDialogProps,
  type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";
import { cx } from "@/utils/cx";
import { OverlayBody, OverlayFooter, OverlayHeader } from "./overlay-parts";

/**
 * Modal — a centered dialog on React Aria's `ModalOverlay` / `Modal` /
 * `Dialog` (focus trap, Escape, outside press, focus restore, scroll lock).
 *
 * Skin: BoardUI's settings modal — 24px radius, `border-border-button-default`
 * hairline, `bg-background-primary-default` surface, the 300ms
 * `cubic-bezier(0.32,0.72,0,1)` condense-in from `scale-[0.85] opacity-0
 * blur-[4px]` (exit 200ms), backdrop cross-fade. Below `sm` the panel goes
 * full-screen. `prefers-reduced-motion` drops the transitions.
 *
 * Controlled:
 * ```tsx
 * <Modal isOpen={open} onOpenChange={setOpen} size="md">
 *   <ModalHeader title="Edit profile" description="…" />
 *   <ModalBody>…</ModalBody>
 *   <ModalFooter><Button variant="secondary">Cancel</Button><Button>Save</Button></ModalFooter>
 * </Modal>
 * ```
 * Uncontrolled, from a trigger:
 * ```tsx
 * <ModalTrigger>
 *   <Button>Open</Button>
 *   <Modal>{({ close }) => <>…<Button onClick={close}>Done</Button></>}</Modal>
 * </ModalTrigger>
 * ```
 */

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

const PANEL_SIZE: Record<ModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  full: "sm:h-[calc(100dvh-32px)] sm:max-w-none",
};

/** Modal motion recipe (registry/motion.md → Modals). */
const MODAL_PANEL_MOTION = [
  "transform-gpu transition-[opacity,transform,translate,scale,filter] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-[opacity,transform,filter]",
  "data-[entering]:scale-[0.85] data-[entering]:opacity-0 data-[entering]:blur-[4px]",
  "data-[exiting]:scale-[0.85] data-[exiting]:opacity-0 data-[exiting]:blur-[4px] data-[exiting]:duration-200 data-[exiting]:ease-in",
  "motion-reduce:transition-none",
].join(" ");

const MODAL_BACKDROP_MOTION = [
  "transition-opacity duration-300 ease-out",
  "data-[entering]:opacity-0 data-[exiting]:opacity-0 data-[exiting]:duration-200",
  "motion-reduce:transition-none",
].join(" ");

export interface ModalProps
  extends Pick<
    AriaModalOverlayProps,
    "isOpen" | "defaultOpen" | "onOpenChange" | "isDismissable" | "isKeyboardDismissDisabled" | "shouldCloseOnInteractOutside"
  > {
  size?: ModalSize;
  /** Dialog role. `alertdialog` for destructive confirmations. */
  role?: AriaDialogProps["role"];
  /** Accessible name when the modal has no `ModalHeader` title. */
  "aria-label"?: string;
  /** Extra classes on the panel. */
  className?: string;
  /** Extra classes on the backdrop (e.g. a lighter scrim). */
  backdropClassName?: string;
  children: AriaDialogProps["children"];
}

export function Modal({
  size = "md",
  role,
  "aria-label": ariaLabel,
  className,
  backdropClassName,
  children,
  isDismissable = true,
  ...overlayProps
}: ModalProps) {
  return (
    <AriaModalOverlay
      {...overlayProps}
      isDismissable={isDismissable}
      className={cx(
        "fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 max-sm:p-0",
        MODAL_BACKDROP_MOTION,
        backdropClassName,
      )}
    >
      <AriaModal
        className={cx(
          "relative flex w-full max-h-[calc(100dvh-32px)] flex-col overflow-hidden outline-none",
          "rounded-3xl border border-border-button-default bg-background-primary-default shadow-xl",
          // Full-screen on phones: the panel IS the viewport.
          "max-sm:h-dvh max-sm:max-h-none max-sm:rounded-none max-sm:border-0",
          PANEL_SIZE[size],
          MODAL_PANEL_MOTION,
          className,
        )}
      >
        <AriaDialog
          role={role}
          aria-label={ariaLabel}
          className="flex min-h-0 max-h-full flex-1 flex-col outline-none"
        >
          {children}
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}

/** Wrap a trigger element + `<Modal>` for uncontrolled open state. */
export const ModalTrigger = AriaDialogTrigger;

export const ModalHeader = OverlayHeader;
export const ModalBody = OverlayBody;
export const ModalFooter = OverlayFooter;
