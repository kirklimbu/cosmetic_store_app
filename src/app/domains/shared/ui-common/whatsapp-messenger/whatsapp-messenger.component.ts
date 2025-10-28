import { Component } from '@angular/core';
import { GlobalConstants } from '../../global-constants';
import { NgOptimizedImage } from '@angular/common';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
@Component({
    selector: 'app-whatsapp-messenger',
    imports: [
        NgOptimizedImage,
        NzFloatButtonModule
    ],
    templateUrl: './whatsapp-messenger.component.html',
    styleUrl: './whatsapp-messenger.component.scss'
})
export class WhatsappMessengerComponent {

  readonly whatsAppChatLink = GlobalConstants.whatsappLink;

}
