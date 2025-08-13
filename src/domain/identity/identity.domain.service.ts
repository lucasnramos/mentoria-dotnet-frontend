import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IdentityDomainModel } from './identity.model';

@Injectable({ providedIn: 'root' })
export default class IdentityDomainService {
  private url = 'http://localhost:5294/api/user';
  private http = inject(HttpClient);

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  authenticateUser(payload: IdentityDomainModel.LoginPayload): boolean {
    this.http
      .post<IdentityDomainModel.Response>(`${this.url}/login`, payload)
      .subscribe({
        next: (response) => {
          if (response.authenticated) {
            localStorage.setItem('accessToken', response.accessToken);
            console.log('User authenticated and token stored');
          } else {
            console.error('Authentication failed:', response.message);
          }
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
