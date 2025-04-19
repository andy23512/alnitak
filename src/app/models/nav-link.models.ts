import { RouterLinkActive } from '@angular/router';
import { Icon } from '../types/icon.types';

export interface NavLink {
  title: string;
  routerLink: string;
  routerLinkActiveOptions: RouterLinkActive['routerLinkActiveOptions'];
  ariaLabel: string;
  tooltipMessage: string;
  icon: Icon;
}
