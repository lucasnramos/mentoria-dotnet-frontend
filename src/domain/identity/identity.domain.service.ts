import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IdentityDomainModel } from './identity.model';

@Injectable({ providedIn: 'root' })
export default class IdentityDomainService {
  // point to server proxy instead of backend directly
  private url = '/api/user';
  private http = inject(HttpClient);

  get isLoggedIn(): boolean {
    // token is stored HttpOnly in cookie by the server; cannot be read by JS
    // For a client-side logged-in check implement a lightweight /api/auth/me endpoint
    // or rely on application state from successful login response.
    return false;
  }

  get accessToken(): string | null {
    // HttpOnly cookie is not accessible from client JavaScript
    return null;
  }

  authenticateUser(payload: IdentityDomainModel.LoginPayload): boolean {
    // call the server-side login that will set HttpOnly cookie
    this.http
      .post<Partial<IdentityDomainModel.Response>>('/api/auth/login', payload)
      .subscribe({
        next: (response) => {
          console.log('Login response', response);
          // token is in HttpOnly cookie; do not store in localStorage
        },
        error: (error) => console.error('Authentication failed', error),
      });
    return true;
  }

  registerUser(payload: IdentityDomainModel.User): boolean {
    console.log(`Registering user with email: ${payload.name}`);
    return true;
  }
}
