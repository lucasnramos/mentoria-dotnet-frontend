import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import IdentityDomainService from '@domain/identity/identity.domain.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('mentoria-dotnet-frontend');
  private identityDomainService = inject(IdentityDomainService);
  isAuthenticated = signal(false);
  isAdmin = signal(false);

  ngOnInit() {
    this.checkAuthentication();
  }

  private async checkAuthentication() {
    const resp = await this.identityDomainService.isLoggedIn();
    this.isAuthenticated.set(resp.authenticated);
  }
}
