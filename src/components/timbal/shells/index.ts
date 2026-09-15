/**
 * App shells — mount ONE as a layout route, pages render through `<Outlet />`.
 *
 * - `SidebarShell`: BoardUI floating sidebar + dashboard header (data apps).
 * - `TopbarShell`: sticky top bar + centred column (consumer / marketing).
 * - `PageHeader`: a page's handle on the shell header (title, description,
 *   actions). Pages never render their own `<h1>`.
 */
export { SidebarShell, type SidebarShellProps } from "./sidebar-shell";
export { TopbarShell, type TopbarShellProps } from "./topbar-shell";
export { PageHeader, PageHeaderProvider, usePageHeaderState, type PageHeaderProps, type PageHeaderValues } from "./page-header";
export {
  Collapsible,
  ShellBrandMark,
  ShellHeader,
  ShellNavRow,
  ShellSidebar,
  ShellUserMenu,
  type ShellSidebarProps,
  type ShellUserMenuProps,
} from "./shell-chrome";
export {
  SHELL_DESKTOP_QUERY,
  SHELL_FRAME_INSET_CLASS,
  SHELL_INSET_CLASS,
  initialsOf,
  normalizeNavPath,
  resolveActiveNavItem,
  resolveHomeNavItem,
  resolveNavTrail,
  useActiveNavItem,
  useMediaQuery,
  useShellUser,
  type RemixIcon,
  type ShellBrand,
  type ShellNavItem,
  type ShellUser,
} from "./shell-nav";
