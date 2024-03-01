import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ticket-panel',
  templateUrl: './ticket-panel.component.html',
  imports: [RouterLink],
  standalone: true,
})
export default class TicketPanelComponent {
  ticketPanelMenuItems: TicketPanelMenu[] = [
    // {
    //   routerLink: '/ticket-panel/tickets',
    //   title: 'Limpieza',
    //   icon: 'fa-duotone fa-broom-wide',
    // },
    {
      routerLink: '/legal/list-ticket-customer',
      title: 'Legal',
      icon: 'fa-duotone fa-gavel',
    },
    // {
    //   routerLink: '/legal/list-ticket-legal',
    //   routerLink: '/legal/list-ticket-legal',
    //   title: 'Jardineria',
    //   icon: 'fa-brands fa-pagelines',
    // },
  ];
}
export interface TicketPanelMenu {
  routerLink: string;
  title: string;
  icon: string;
}
