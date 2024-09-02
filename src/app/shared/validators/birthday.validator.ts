import { AbstractControl, ValidationErrors } from '@angular/forms';

export function birthdayValidator(
  control: AbstractControl
): ValidationErrors | null {
  const today = new Date().getTime();

  return control.value && today < new Date(control.value).getTime()
    ? { invalidBirthday: true }
    : null;
}
