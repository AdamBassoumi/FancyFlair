import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-steps-indicator',
  template: `
    <div class="flex justify-between mb-6">
      <div *ngFor="let step of steps; let i = index" class="w-1/3 text-center">
        <div class="text-xl font-bold" [class.text-blue-500]="currentStep >= i + 1">{{ i + 1 }}</div>
        <div class="text-sm" [class.text-blue-500]="currentStep >= i + 1">{{ step }}</div>
      </div>
    </div>
  `,
  styles: [`
    .text-blue-500 {
      color: #3b82f6;
    }
  `]
})
export class StepsIndicatorComponent {
  @Input() steps: string[] = [];
  @Input() currentStep: number = 1;
}