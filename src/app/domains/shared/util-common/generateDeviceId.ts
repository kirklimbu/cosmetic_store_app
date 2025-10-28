import { Injectable, PLATFORM_ID } from '@angular/core';
import { signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { isPlatformBrowser } from '@angular/common';
import { Inject } from '@angular/core';

// --- SSR-safe signal ---
export const deviceIdSignal = signal<string>('ssr-device-id');

@Injectable({ providedIn: 'root' })
export class DeviceService {
  @Inject(PLATFORM_ID) private platformId: object;
  constructor() {
    this.initDeviceId();
  }

  private initDeviceId() {
    if (!isPlatformBrowser(this.platformId)) {
      return; // SSR: do nothing
    }

    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem('deviceId', deviceId);
    }

    deviceIdSignal.set(deviceId);
  }
}
