import { RouterLinkActive } from '@angular/router';
import { Icon } from '../types/icon.types';

export interface IconLink {
  routerLink: string;
  routerLinkActiveOptions: RouterLinkActive['routerLinkActiveOptions'];
  ariaLabel: string;
  tooltipMessage: string;
  icon: Icon;
}
