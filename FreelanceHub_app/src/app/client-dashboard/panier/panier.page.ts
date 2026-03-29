import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CartItem } from '../../models/cart-item.model';
import { DashboardService } from '../../services/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.page.html',
  styleUrls: ['./panier.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class PanierPage {
  private dashboardService = inject(DashboardService);
  cart$: Observable<CartItem[]> = this.dashboardService.getCart();
  subtotal = '400 DT';

  proceedToPayment() {
    // Mock
    alert('Procéder au paiement');
  }
}

