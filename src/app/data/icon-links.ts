import { IconLink } from '../models/icon-link.models';

export const ICON_LINKS: IconLink[] = [
  {
    routerLink: '/',
    routerLinkActiveOptions: { exact: true },
    ariaLabel: 'home page link',
    tooltipMessage: 'Go to Home page',
    icon: 'home',
  },
  {
    routerLink: '/statistics',
    routerLinkActiveOptions: { exact: false },
    ariaLabel: 'statistics page link',
    tooltipMessage: 'Go to Statistics page',
    icon: 'trending_up',
  },
  {
    routerLink: '/settings',
    routerLinkActiveOptions: { exact: false },
    ariaLabel: 'settings page link',
    tooltipMessage: 'Go to Settings page',
    icon: 'settings',
  },
  {
    routerLink: '/chord',
    routerLinkActiveOptions: { exact: false },
    ariaLabel: 'chord page link',
    tooltipMessage: 'Go to Chord page',
    icon: 'piano',
  },
];
