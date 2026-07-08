/**
 * The house icon pack — Nucleo UI (outline, 18px).
 *
 * Every component imports icons from HERE, never from an icon library
 * directly. Names follow the familiar `<Thing>Icon` convention so call
 * sites read naturally, while the underlying pack stays swappable in one
 * file. Deep imports keep the dev server fast (the package barrel
 * re-exports ~10k icons).
 *
 * Need an icon that isn't mapped yet? Add one line here — browse names at
 * https://nucleoapp.com/app/?library=ui — instead of importing another pack.
 */

import type { ComponentProps, FC } from "react";

export { IconArrowDownOutline18 as ArrowDownIcon } from "nucleo-ui-outline-18/components/IconArrowDownOutline18";
export { IconArrowLeftOutline18 as ArrowLeftIcon } from "nucleo-ui-outline-18/components/IconArrowLeftOutline18";
export { IconArrowRightOutline18 as ArrowRightIcon } from "nucleo-ui-outline-18/components/IconArrowRightOutline18";
export { IconArrowUpOutline18 as ArrowUpIcon } from "nucleo-ui-outline-18/components/IconArrowUpOutline18";
export { IconArrowUpRightOutline18 as ArrowUpRightIcon } from "nucleo-ui-outline-18/components/IconArrowUpRightOutline18";
export { IconChartBarOutline18 as BarChart3Icon } from "nucleo-ui-outline-18/components/IconChartBarOutline18";
export { IconTextBoldOutline18 as BoldIcon } from "nucleo-ui-outline-18/components/IconTextBoldOutline18";
export { IconBox2Outline18 as BoxesIcon } from "nucleo-ui-outline-18/components/IconBox2Outline18";
export { IconCalendarOutline18 as CalendarIcon } from "nucleo-ui-outline-18/components/IconCalendarOutline18";
export { IconCheckOutline18 as CheckIcon } from "nucleo-ui-outline-18/components/IconCheckOutline18";
export { IconChevronDownOutline18 as ChevronDownIcon } from "nucleo-ui-outline-18/components/IconChevronDownOutline18";
export { IconChevronLeftOutline18 as ChevronLeftIcon } from "nucleo-ui-outline-18/components/IconChevronLeftOutline18";
export { IconChevronRightOutline18 as ChevronRightIcon } from "nucleo-ui-outline-18/components/IconChevronRightOutline18";
export { IconChevronUpOutline18 as ChevronUpIcon } from "nucleo-ui-outline-18/components/IconChevronUpOutline18";
export { IconSortVerticalOutline18 as ChevronsUpDownIcon } from "nucleo-ui-outline-18/components/IconSortVerticalOutline18";
export { IconCircleCheckOutline18 as CircleCheckIcon } from "nucleo-ui-outline-18/components/IconCircleCheckOutline18";
export { IconBanOutline18 as CircleSlashIcon } from "nucleo-ui-outline-18/components/IconBanOutline18";
export { IconCreditCardOutline18 as CreditCardIcon } from "nucleo-ui-outline-18/components/IconCreditCardOutline18";
export { IconDownloadOutline18 as DownloadIcon } from "nucleo-ui-outline-18/components/IconDownloadOutline18";
export { IconFilterOutline18 as FilterIcon } from "nucleo-ui-outline-18/components/IconFilterOutline18";
export { IconGripDotsVerticalOutline18 as GripVerticalIcon } from "nucleo-ui-outline-18/components/IconGripDotsVerticalOutline18";
export { IconHashtagOutline18 as HashIcon } from "nucleo-ui-outline-18/components/IconHashtagOutline18";
export { IconHouseOutline18 as HomeIcon } from "nucleo-ui-outline-18/components/IconHouseOutline18";
export { IconInboxOutline18 as InboxIcon } from "nucleo-ui-outline-18/components/IconInboxOutline18";
export { IconCircleInfoOutline18 as InfoIcon } from "nucleo-ui-outline-18/components/IconCircleInfoOutline18";
export { IconTextItalicOutline18 as ItalicIcon } from "nucleo-ui-outline-18/components/IconTextItalicOutline18";
export { IconLayersOutline18 as LayersIcon } from "nucleo-ui-outline-18/components/IconLayersOutline18";
export { IconLoaderOutline18 as LoaderIcon } from "nucleo-ui-outline-18/components/IconLoaderOutline18";
export { IconMinusOutline18 as MinusIcon } from "nucleo-ui-outline-18/components/IconMinusOutline18";
export { IconDotsOutline18 as MoreHorizontalIcon } from "nucleo-ui-outline-18/components/IconDotsOutline18";
export { IconMsgOutline18 as MessageIcon } from "nucleo-ui-outline-18/components/IconMsgOutline18";
export { IconCircleXmarkOutline18 as OctagonXIcon } from "nucleo-ui-outline-18/components/IconCircleXmarkOutline18";
export { IconSidebarLeftOutline18 as PanelLeftIcon } from "nucleo-ui-outline-18/components/IconSidebarLeftOutline18";
export { IconPenOutline18 as PencilIcon } from "nucleo-ui-outline-18/components/IconPenOutline18";
export { IconPlusOutline18 as PlusIcon } from "nucleo-ui-outline-18/components/IconPlusOutline18";
export { IconInvoiceOutline18 as ReceiptIcon } from "nucleo-ui-outline-18/components/IconInvoiceOutline18";
export { IconMagnifierOutline18 as SearchIcon } from "nucleo-ui-outline-18/components/IconMagnifierOutline18";
export { IconGearOutline18 as SettingsIcon } from "nucleo-ui-outline-18/components/IconGearOutline18";
export { IconShapesOutline18 as ShapesIcon } from "nucleo-ui-outline-18/components/IconShapesOutline18";
export { IconFaceSmileOutline18 as SmileIcon } from "nucleo-ui-outline-18/components/IconFaceSmileOutline18";
export { IconSparkleOutline18 as SparkleIcon } from "nucleo-ui-outline-18/components/IconSparkleOutline18";
export { IconStarOutline18 as StarIcon } from "nucleo-ui-outline-18/components/IconStarOutline18";
export { IconInputFieldOutline18 as TextCursorInputIcon } from "nucleo-ui-outline-18/components/IconInputFieldOutline18";
export { IconTriangleWarningOutline18 as TriangleAlertIcon } from "nucleo-ui-outline-18/components/IconTriangleWarningOutline18";
export { IconTextUnderlineOutline18 as UnderlineIcon } from "nucleo-ui-outline-18/components/IconTextUnderlineOutline18";
export { IconUserOutline18 as UserIcon } from "nucleo-ui-outline-18/components/IconUserOutline18";
export { IconUsersOutline18 as UsersIcon } from "nucleo-ui-outline-18/components/IconUsersOutline18";
export { IconXmarkOutline18 as XIcon } from "nucleo-ui-outline-18/components/IconXmarkOutline18";

/**
 * The shared icon component contract — what nav configs and table cells
 * accept. Matches both Nucleo components and hand-rolled SVGs.
 */
export type IconComponent = FC<ComponentProps<"svg"> & { size?: number | string }>;

/** Solid dot for radio indicators — no outline pack ships a plain filled circle. */
export const CircleIcon: IconComponent = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="9" cy="9" r="4.5" fill="currentColor" stroke="none" />
  </svg>
);

/** Spinner alias — pair with `animate-spin` at the call site. */
export { IconLoaderOutline18 as Loader2Icon } from "nucleo-ui-outline-18/components/IconLoaderOutline18";
