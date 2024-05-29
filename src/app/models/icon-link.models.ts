import { RouterLinkActive } from '@angular/router';

export interface IconLink {
  routerLink: string;
  routerLinkActiveOptions: RouterLinkActive['routerLinkActiveOptions'];
  ariaLabel: string;
  tooltipMessage: string;
  icon: string;
}
