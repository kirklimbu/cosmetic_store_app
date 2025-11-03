import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  TemplateRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/util-auth/services/auth-http/auth.service';

import { FormSubmitButtonsComponent } from '../../shared/ui-common/form-submit-buttons/form-submit-buttons.component';
import { ConfirmedValidator } from '../../shared/util-logger/confirm-password.validator';
// import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { UrlService } from '../../shared/util-logger/url.service';
// import { MessageService } from 'src/app/shared/util-logger/message.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ICustomResponse } from '../../shared/models/CustomResponse.model';

@Component({
  selector: 'app-registration',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    FormSubmitButtonsComponent,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzDividerModule,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [],
})
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  hasError!: boolean;
  showPassword = false;
  showcPassword = false;
  // isLoading = false;
  formError!: TemplateRef<{
    validation: string;
    message: string;
    control: AbstractControl<any, any>;
  }> | null;

  destroyRef = inject(DestroyRef);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public urlService = inject(UrlService);
  // public messageService = inject(MessageService);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  idsSignal = computed(() => ({
    id: Number(this.queryParamMapSignal()?.get('id') ?? 0),
  }));

  public ngOnInit(): void {
    this.buildForm();
    this.fetchDefaultFormValues();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  buildForm(): FormGroup {
    return (this.form = this.fb.group(
      {
        userId: [],
        name: ['', [Validators.required]],
        mobile: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        address1: ['', [Validators.required]],
        address2: [''],
        password: ['', [Validators.required]],
        cPassword: ['', [Validators.required]],
        agree: [false, [Validators.required]],
      },
      {
        validators: ConfirmedValidator('password', 'cPassword'),
      }
    ));
  }

  fetchDefaultFormValues() {
    this.authService
      .getRegistrationFormValues(this.idsSignal().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_res) => {
        console.log('res form', _res);

        this.form.patchValue(_res);
        // this.avatarUrl = _res.path;
      });
  }

  onTogglePassword() {
    this.showPassword = !this.showPassword;
  }
  onTogglecPassword() {
    this.showcPassword = !this.showcPassword;
  }

  onSignUp() {
    // this.isLoading = true;
    this.hasError = false;
    this.authService
      .registration(this.form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: ICustomResponse) => {
        console.log('user', user);
        // this.isLoading = false;

        // this.messageService.showSuccessMessage(user.message)
        this.router.navigate(['/auth/login']);
      });
  }

  onCancel(): void {
    console.log('cancel');
    this.router.navigate(['/home']);
  }

  /**
   * check previous page
   * navigate to page after successful registration
   */

  checkPreviousPage() {
    const currentPage$ = this.urlService.currentUrl$;
    currentPage$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((page) => {
      console.log('page', page);
      if (page == 'cart') {
        this.router.navigate(['/cart']);
      }
    });
  }
}
