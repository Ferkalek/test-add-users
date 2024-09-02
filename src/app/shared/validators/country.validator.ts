import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Country } from '../enum/country';

export function countryValidator(
  control: AbstractControl
): ValidationErrors | null {
  const validCountries = Object.values(Country);

  return control.value && !validCountries.includes(control.value)
    ? { invalidCountry: true }
    : null;
}
