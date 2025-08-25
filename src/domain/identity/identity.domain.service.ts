import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IdentityDomainModel } from './identity.model';
import { catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class IdentityDomainService {
  private url = '/api/auth/login';
  private http = inject(HttpClient);

  get isLoggedIn(): boolean {
    // token is stored HttpOnly in cookie by the server; cannot be read by JS
    // For a client-side logged-in check implement a lightweight /api/auth/me endpoint
    // or rely on application state from successful login response.
    return false;
  }

  authenticateUser(payload: IdentityDomainModel.LoginPayload): boolean {
    this.http
      .post<IdentityDomainModel.Response>(this.url, payload)
      .pipe(
        catchError((error) => {
          console.log('Error during authentication', error);
          throw error;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Login response', response);
        },
        error: (error) => console.error('Authentication failed', error),
      });
    return true;
  }

  registerUser(payload: IdentityDomainModel.User): boolean {
    console.log(`Registering user with email: ${payload.email}`);
    return true;
  }
}
