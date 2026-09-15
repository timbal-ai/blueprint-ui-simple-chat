"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/**
 * Page → shell header channel.
 *
 * The shell owns the one header on a routed page (title row, optional
 * description, actions on the right). A page never prints its own `<h1>` or
 * intro line — that is how every screen ended up with the title twice. When a
 * page needs the header to say something the nav item can't know (a record's
 * name, a live count, an action that only exists here), it renders
 * `<PageHeader>` anywhere in its tree:
 *
 * ```tsx
 * <PageHeader
 *   title="Invoice #4821"                       // default: the active nav label
 *   description="Issued 12 Sep · due 26 Sep"    // default: nav item `description`
 *   actions={<Button leadingIcon={RiAddFill}>New ticket</Button>}
 * />
 * ```
 *
 * `title` / `description` go through state (strings, so no render loops);
 * `actions` are portalled into the header's slot, so the page stays their
 * owner and their handlers see the page's latest state.
 */

export interface PageHeaderValues {
  title?: string;
  description?: string;
}

interface PageHeaderState {
  values: PageHeaderValues | null;
  setValues: (values: PageHeaderValues | null) => void;
  actionsSlot: HTMLElement | null;
  setActionsSlot: (element: HTMLElement | null) => void;
}

const PageHeaderContext = createContext<PageHeaderState | null>(null);

/** Mounted once by each shell around its header + outlet. */
export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<PageHeaderValues | null>(null);
  const [actionsSlot, setActionsSlot] = useState<HTMLElement | null>(null);
  const state = useMemo<PageHeaderState>(
    () => ({ values, setValues, actionsSlot, setActionsSlot }),
    [values, actionsSlot],
  );
  return <PageHeaderContext.Provider value={state}>{children}</PageHeaderContext.Provider>;
}

/** What the shell header reads: the page's overrides (if any) and the slot ref for actions. */
export function usePageHeaderState() {
  const ctx = useContext(PageHeaderContext);
  const slotRef = useCallback((element: HTMLElement | null) => ctx?.setActionsSlot(element), [ctx]);
  return { values: ctx?.values ?? null, slotRef };
}

export interface PageHeaderProps extends PageHeaderValues {
  /** Right side of the header row, rendered into the shell's slot. */
  actions?: ReactNode;
}

/**
 * Drive the shell header from inside a page. Renders nothing in place.
 * Outside a shell (a focused single page) it is a no-op, so pages stay
 * portable between the two layouts.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const ctx = useContext(PageHeaderContext);
  const setValues = ctx?.setValues;

  useLayoutEffect(() => {
    if (!setValues) return;
    setValues(title === undefined && description === undefined ? null : { title, description });
    return () => setValues(null);
  }, [setValues, title, description]);

  if (!ctx?.actionsSlot || actions === undefined || actions === null) return null;
  return createPortal(actions, ctx.actionsSlot);
}
