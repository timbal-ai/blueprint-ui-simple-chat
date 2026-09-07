/**
 * Overlays — Modal, Sheet, Popover, toasts. All on react-aria-components
 * (BoardUI's a11y stack): focus trap, Escape, outside press, focus restore.
 *
 * Trigger wrappers (`ModalTrigger`, `SheetTrigger`, `PopoverTrigger`) are
 * React Aria `DialogTrigger`s: the trigger child must be a pressable RAC
 * element (`Button` from react-aria-components) — or wrap a BoardUI `Button`
 * in `Pressable`. Otherwise drive `isOpen`/`onOpenChange` yourself.
 */
export { Pressable } from "react-aria-components";

export { Modal, ModalBody, ModalFooter, ModalHeader, ModalTrigger, type ModalProps, type ModalSize } from "./modal";
export { Sheet, SheetBody, SheetFooter, SheetHeader, SheetTrigger, type SheetProps, type SheetSide, type SheetSize } from "./sheet";
export { Popover, PopoverTrigger, type PopoverProps } from "./popover";
export {
  OverlayBody,
  OverlayFooter,
  OverlayHeader,
  type OverlayBodyProps,
  type OverlayFooterProps,
  type OverlayHeaderProps,
} from "./overlay-parts";
export { Toaster, type ToasterProps } from "./toast";
export { toast, useToasts, type ToastAction, type ToastItem, type ToastKind, type ToastOptions } from "./toast-store";
