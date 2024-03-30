import { Component, Input } from '@angular/core';
import tinycolor from 'tinycolor2';

@Component({
  selector: 'shared-badge',
  standalone: true,
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css'
})
export class BadgeComponent {
  @Input()
  text: string = "";

  @Input()
  color: string = "";

  getTextColor(): string {
    const originalColor = tinycolor(this.color);
    const darkerColor = originalColor.darken(20).toString();
    return darkerColor;
  }
}
