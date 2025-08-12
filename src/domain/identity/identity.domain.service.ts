import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export default class IdentityDomainService {
  private url = 'http://localhost:5294/api/user';
  private http = inject(HttpClient);

  authenticateUser(payload: any): boolean {
    this.http.post(`${this.url}/login`, payload).subscribe({
      next: (response) => console.log('Authentication successful', response),
      error: (error) => console.error('Authentication failed', error),
    });
    return true;
  }

  registerUser(email: string, password: string): boolean {
    console.log(`Registering user with email: ${email}`);
    return true;
  }
}
