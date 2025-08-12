import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export default class IdentityDomainService {
  authenticateUser(email: string, password: string): boolean {
    console.log(`Authenticating user with email: ${email}`);
    return true;
  }

  registerUser(email: string, password: string): boolean {
    console.log(`Registering user with email: ${email}`);
    return true;
  }
}
