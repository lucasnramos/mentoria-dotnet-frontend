import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IdentityDomainModel } from './identity.model';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class IdentityDomainService {
  private url = '/api/user';
  private http = inject(HttpClient);

  async isLoggedIn(): Promise<{ authenticated: boolean }> {
    const resp = await firstValueFrom(this.http.get('/api/auth/me'));
    return resp as { authenticated: boolean };
  }

  authenticateUser(payload: IdentityDomainModel.LoginPayload): boolean {
    this.http
      .post<IdentityDomainModel.Response>(`${this.url}/login`, payload)
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
    this.http
      .post<IdentityDomainModel.Response>(this.url, payload)
      .pipe(
        catchError((error) => {
          console.log('Error during registration', error);
          throw error;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Registration response', response);
        },
        error: (error) => console.error('Registration failed', error),
      });
    return true;
  }
}
