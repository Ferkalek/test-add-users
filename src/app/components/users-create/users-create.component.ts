import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, finalize, map, Observable, take, timer } from 'rxjs';

import { Country } from '../../shared/enum/country';
import { countryValidator } from '../../shared/validators/country.validator';
import { MainService } from '../../services/main.service';
import { asyncUsernameValidator } from '../../shared/validators/username.validator';
import { birthdayValidator } from '../../shared/validators/birthday.validator';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrl: './users-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersCreateComponent {
  countries: string[] = Object.values(Country);
  isSubmitting$ = new BehaviorSubject<boolean>(false);
  timer$ = new Observable<number>();
  brakeSending = false;

  form = this.fb.group({
    users: this.fb.array([]),
  });

  countryControl = new FormControl();

  get users(): FormArray {
    return this.form.controls['users'] as FormArray;
  }

  get usersInvalid() {
    return this.users.controls.reduce((acc, item) => {
      if (item.status === 'INVALID') {
        acc = acc + 1;
      }
      return acc;
    }, 0);
  }

  constructor(
    private fb: FormBuilder,
    private mainService: MainService,
    private cd: ChangeDetectorRef
  ) {}

  addUser(): void {
    const user = this.fb.group({
      country: ['', [Validators.required, countryValidator]],
      username: [
        '',
        [Validators.required],
        [asyncUsernameValidator(this.mainService)],
      ],
      birthday: ['', [Validators.required, birthdayValidator]],
    });

    this.users.push(user);
  }

  removeItem(index: number): void {
    this.users.removeAt(index);
  }

  submit(): void {
    if (this.users.invalid) return;

    this.brakeSending = false;
    this.isSubmitting$.next(true);
    this.startTimer();

    setTimeout(() => {
      if (!this.brakeSending) {
        this.mainService.submitForm(this.users.value).subscribe((data) => {
          this.users.clear();
          this.addUser();
          this.cd.detectChanges();
          alert(data.result);
        });
      }
    }, 5000);
  }

  cancel(): void {
    this.isSubmitting$.next(false);
    this.timer$ = new Observable();
    this.brakeSending = true;
  }

  private startTimer(): void {
    this.timer$ = timer(0, 1000).pipe(
      take(6),
      map((v) => v + 1),
      finalize(() => this.isSubmitting$.next(false))
    );
  }
}
