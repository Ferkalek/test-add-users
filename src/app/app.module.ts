import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MockBackendInterceptor } from './shared/mock-backend/mock-backend.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersCreateComponent } from './components/users-create/users-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipDirective } from './shared/directives/tooltip.directive';
import { ValidationMessageDirective } from './shared/directives/validation-message.directive';

@NgModule({
  declarations: [
    AppComponent,
    UsersCreateComponent,
    TooltipDirective,
    ValidationMessageDirective,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
