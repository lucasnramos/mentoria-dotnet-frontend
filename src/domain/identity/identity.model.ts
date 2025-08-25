export namespace IdentityDomainModel {
  export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    type: number;
  }

  export interface Response {
    authenticated: boolean;
    created: string; // probably iso date
    expiration: string; // probably iso date
    accessToken: string;
    message: string;
  }

  export interface LoginPayload {
    email: string;
    password: string;
  }
}
