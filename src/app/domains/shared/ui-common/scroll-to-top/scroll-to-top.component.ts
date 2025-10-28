import { Component } from '@angular/core';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
@Component({
    selector: 'app-scroll-to-top',
    imports: [
        NzBackTopModule,
        NzIconModule,
        NzFloatButtonModule
    ],
    templateUrl: './scroll-to-top.component.html',
    styleUrl: './scroll-to-top.component.css'
})
export class ScrollToTopComponent {

}
