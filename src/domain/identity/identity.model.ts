export namespace IdentityDomainModel {
  export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    type: number;
  }

  export type LoginPayload = User;
}
