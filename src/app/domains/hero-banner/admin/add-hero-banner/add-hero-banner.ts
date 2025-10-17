import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { BannerService } from '../../data/service/banner.service';
import { MessageService } from '@logger/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-hero-banner',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommonModule,
    NzCardModule,
    NzDividerModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzUploadModule,
    NzIconModule,
    NzSwitchModule,
    NgOptimizedImage,
  ],
  templateUrl: './add-hero-banner.html',
  styleUrl: './add-hero-banner.scss',
})
export class AddHeroBanner implements OnInit {
  // props
  form!: FormGroup;
  mode = 'add';

  fileList: NzUploadFile[] = [];

  isUploading = false;
  apiUrl = environment.apiUrl;
  // --- State for the preview modal ---
  previewImage: string | undefined = '';
  isPreviewModalVisible = false;
  avatarUrl: string | undefined;
  loading = false;

  private fb = inject(FormBuilder);
  private bannerService = inject(BannerService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);

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

  private buildForm(): void {
    this.form = this.fb.group({
      bannerId: [],
      path: [],
      hasActive: [],
    });
  }

  get f() {
    return this.form.controls;
  }

  fetchDefaultFormValues() {
    this.bannerService
      .getFormValues(this.idsSignal().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_res) => {
        console.log('res form', _res);
        this.form.patchValue(_res);
        this.avatarUrl = _res.path;
      });
  }

  handleChange(info: { file: NzUploadFile }): void {
    console.log('handleChange info', info);

    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;

          this.avatarUrl = img;
          this.form.patchValue({
            doc: info,
          });
          return;
        });
        break;
      case 'error':
        console.log('handel chg err');

        // this.msg.error('Network error');
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;

          this.avatarUrl = img;
          return;
        });
        break;
    }
  }
  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (reader.result) {
        callback(reader.result.toString());
      }
    });
    reader.readAsDataURL(img);
  }

  profilePicUpload = (file: any): boolean => {
    this.form.patchValue({
      path: file,
    });

    // to display the image
    this.getBase64(file, (img: string) => {
      this.loading = false;
      this.avatarUrl = img;
    });

    // this.cd.detectChanges();
    return false;
  };

  onSave() {
    this.bannerService
      .saveBanner(this.form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        console.log('res', res);
        this.form.reset();
        this.messageService.createMessage('success', res.message);
        this.router.navigate(['auth/list-hero-banner']);
      });
  }
}
