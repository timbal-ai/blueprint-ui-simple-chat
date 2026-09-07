/**
 * App shells — mount ONE as a layout route, pages render through `<Outlet />`.
 *
 * - `SidebarShell`: BoardUI floating sidebar + dashboard header (data apps).
 * - `TopbarShell`: sticky top bar + centred column (consumer / marketing).
 */
export { SidebarShell, type SidebarShellProps } from "./sidebar-shell";
export { TopbarShell, type TopbarShellProps } from "./topbar-shell";
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
  SHELL_INSET_CLASS,
  SHELL_INSET_NEGATE_CLASS,
  initialsOf,
  resolveActiveNavItem,
  useActiveNavItem,
  useMediaQuery,
  useShellUser,
  type RemixIcon,
  type ShellBrand,
  type ShellNavItem,
  type ShellUser,
} from "./shell-nav";
