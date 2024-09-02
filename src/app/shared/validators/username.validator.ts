import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MainService } from '../../services/main.service';

export function asyncUsernameValidator(service: MainService) {
  const badResult = { invalidUsername: true };

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return service.validateUsername(control.value).pipe(
      map((response: { isAvailable: boolean }) =>
        response.isAvailable ? null : badResult
      ),
      catchError(() => of(badResult))
    );
  };
}
