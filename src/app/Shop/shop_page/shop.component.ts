import { Component, OnInit } from '@angular/core';
import { Shop } from '../../models/Shop';
import { Produit } from '../../models/Produit';
import { Category } from '../../models/Category';
import { ShopService } from '../../services/Shop/shop.service';
import { CategoryService } from '../../services/Category/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  produits: Produit[] = [];
  categories?: Category[];
  selectedCategoryIds: number[] = []; // Array to hold selected categories
  selectedSortingOption: string = ''; // Property to store selected sorting option
  minPrice: number = 0;
  maxPrice: number = 1000;

  constructor(
    private shopService: ShopService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProductsFromShop();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      categories => {
        this.categories = categories;
        console.log('Categories:', this.categories); // Logging categories
      },
      error => {
        console.error('Error loading categories', error);
      }
    );
  }

  loadProductsFromShop(): void {
    // Retrieve the shop ID from localStorage
    const shopId = parseInt(localStorage.getItem('shop') || '', 10);
    
    if (shopId) {
      // Fetch the shop details using the shopService
      this.shopService.getShopById(shopId).subscribe(
        shop => {
          // Assuming the shop object contains a products property
          this.produits = shop.produits || [];
          console.log('Produits from shop:', this.produits); // Logging produits
        },
        error => {
          console.error('Error loading shop', error);
        }
      );
    } else {
      console.warn('No shop ID found in localStorage');
    }
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategoryIds.includes(categoryId);
  }

  handleCheckboxChange(categoryId: number): void {
    const index = this.selectedCategoryIds.indexOf(categoryId);
    if (index === -1) {
      // Add to selectedCategoryIds if not already selected
      this.selectedCategoryIds.push(categoryId);
    } else {
      // Remove from selectedCategoryIds if already selected
      this.selectedCategoryIds.splice(index, 1);
    }
    console.log('Selected Category IDs:', this.selectedCategoryIds);
  }

  handleSortingChange(event: any): void {
    this.selectedSortingOption = (event.target as HTMLSelectElement).value;
    console.log('Selected Sorting Option:', this.selectedSortingOption);
    // Perform sorting logic or update data based on the selected option
  }

  handleMinPriceChange(): void {
    if (this.minPrice > this.maxPrice) {
      // If minPrice is greater than maxPrice, adjust maxPrice
      this.maxPrice = this.minPrice;
    }
    console.log('Min Price:', this.minPrice);
    console.log('Max Price:', this.maxPrice);
    // You can perform further actions here
  }

  handleMaxPriceChange(): void {
    if (this.maxPrice < this.minPrice) {
      // If maxPrice is less than minPrice, adjust minPrice
      this.minPrice = this.maxPrice;
    }
    console.log('Min Price:', this.minPrice);
    console.log('Max Price:', this.maxPrice);
    // You can perform further actions here
  }
}
