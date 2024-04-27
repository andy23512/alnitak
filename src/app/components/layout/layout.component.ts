import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { CamelToKebabPipe } from 'src/app/pipes/camel-to-kebab.pipe';
import { SwitchComponent } from '../switch/switch.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [SwitchComponent, CamelToKebabPipe, NgClass],
})
export class LayoutComponent {
  public switches = [
    'thumbEnd',
    'thumbMid',
    'thumbTip',
    'index',
    'middle',
    'middleMid',
    'ring',
    'ringMid',
    'little',
  ] as const;
  public sides = ['left', 'right'] as const;
}
