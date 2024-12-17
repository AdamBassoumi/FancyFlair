import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private popupTrigger = new Subject<{ type: 'success' | 'error'; message: string }>();
  popup$ = this.popupTrigger.asObservable();

  showSuccess(message: string) {
    this.popupTrigger.next({ type: 'success', message });
  }

  showError(message: string) {
    this.popupTrigger.next({ type: 'error', message });
  }
}
