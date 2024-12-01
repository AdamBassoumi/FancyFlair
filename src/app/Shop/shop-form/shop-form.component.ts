import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Shop } from '../../models/Shop';
import { ShopService } from '../../services/Shop/shop.service';
import { Observable } from 'rxjs';
import { Utilisateur } from '../../models/Utilisateur';
import { Router } from '@angular/router';
import { StepsIndicatorComponent } from '../steps-indicator/steps-indicator.component';

@Component({
  selector: 'app-shop-form',
  templateUrl: './shop-form.component.html',
  styleUrls: ['./shop-form.component.css']
})
export class ShopFormComponent {
  step: number = 1;
  shopData = {
    shopName: '',
    shopDescription: '',
    shopAddress: ''
  };

  constructor(private shopService: ShopService,
              private router: Router
  ) {}

  nextStep() {
    if (this.step < 3) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  onSubmit() {
    console.log('Form Submitted!', this.shopData);

    // Retrieve user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;


    if (userId) {
      // Create a new shop object
      const newShop: any = {
        nom: this.shopData.shopName,
        description: this.shopData.shopDescription,
        dateCreation: new Date().toString(),
      };

      this.shopService.createShop(newShop, userId).subscribe(
        (shop) => {
          console.log('Shop successfully created:', shop);
          this.router.navigate(['/MyShop']);
          // Handle success, e.g., redirect or show a message
        },
        (error) => {
          console.error('Error creating shop:', error);
          // Handle error, e.g., show an error message
        }
      );
      
    }
  }
}
