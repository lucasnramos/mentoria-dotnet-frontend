import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IdentityDomainModel } from './identity.model';

@Injectable({ providedIn: 'root' })
export default class IdentityDomainService {
  private url = 'http://localhost:5294/api/user';
  private http = inject(HttpClient);

  authenticateUser(payload: IdentityDomainModel.LoginPayload): boolean {
    this.http.post(`${this.url}/login`, payload).subscribe({
      next: (response) => console.log('Authentication successful', response),
      error: (error) => console.error('Authentication failed', error),
    });
    return true;
  }

  registerUser(payload: IdentityDomainModel.User): boolean {
    console.log(`Registering user with email: ${payload.name}`);
    return true;
  }
}
