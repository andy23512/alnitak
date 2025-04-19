import { NavLink } from '../models/nav-link.models';

export const NAV_LINKS: NavLink[] = [
  {
    title: 'Home',
    routerLink: '/',
    routerLinkActiveOptions: { exact: true },
    ariaLabel: 'home page link',
    tooltipMessage: 'Go to Home page',
    icon: 'home',
  },
  {
    title: 'Stats',
    routerLink: '/statistics',
    routerLinkActiveOptions: { exact: false },
    ariaLabel: 'statistics page link',
    tooltipMessage: 'Go to Statistics page',
    icon: 'trending_up',
  },
  {
    title: 'Chord',
    routerLink: '/chord',
    routerLinkActiveOptions: { exact: false },
    ariaLabel: 'chord page link',
    tooltipMessage: 'Go to Chord page',
    icon: 'piano',
  },
  {
    title: 'Layout',
    routerLink: '/layout-viewer',
    routerLinkActiveOptions: { exact: false },
    ariaLabel: 'layout viewer page link',
    tooltipMessage: 'Go to Layout Viewer page',
    icon: 'map',
  },
  {
    title: 'Settings',
    routerLink: '/settings',
    routerLinkActiveOptions: { exact: false },
    ariaLabel: 'settings page link',
    tooltipMessage: 'Go to Settings page',
    icon: 'settings',
  },
];
