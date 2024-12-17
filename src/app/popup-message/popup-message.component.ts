import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupService } from '../services/popup/popup.service';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.css'],
})
export class PopupMessageComponent implements OnInit {
  message: string = '';
  title: string = '';
  type: 'success' | 'error' | null = null;
  isVisible: boolean = false;

  constructor(private popupService: PopupService) {}

  ngOnInit() {
    this.popupService.popup$.subscribe((popup) => {
      this.message = popup.message;
      this.type = popup.type;
      this.title = popup.type === 'success' ? 'Success!' : 'Error!';
      this.isVisible = true;

      setTimeout(() => {
        this.isVisible = false;
      }, 5000);
    });
  }
}