import { Component } from '@angular/core';
import { Produit } from '../../models/Produit';
import { Category } from '../../models/Category';
import { ShopService } from '../../services/Shop/shop.service';
import { CategoryService } from '../../services/Category/category.service';
import { Router } from '@angular/router';
import { ProduitService } from 'src/app/services/Produit/produit.service';
import { PopupService } from 'src/app/services/popup/popup.service';

@Component({
  selector: 'app-user-shop',
  templateUrl: './user-shop.component.html',
  styleUrls: ['./user-shop.component.css']
})
export class UserShopComponent {

  produits: Produit[] = [];
  categories?: Category[];
  selectedCategoryIds: number[] = []; // Array to hold selected categories
  selectedSortingOption: string = ''; // Property to store selected sorting option

  isEditMode: boolean = false;
  showRelatedProduct: boolean = true;

  constructor(
    private shopService: ShopService,
    private categoryService: CategoryService,
    private produitService: ProduitService,
    private router: Router, // Inject Router for redirection
    private popupService: PopupService,
  ) {}

  ngOnInit(): void {
    // Check if 'shop' is present in localStorage
    const shopId = localStorage.getItem('shop');
    if (shopId) {
      this.loadCategories();
      this.loadProductsFromShop();
    } else {
      // Redirect to home if no shop ID is found in localStorage
      console.warn('No shop ID found in localStorage. Redirecting to home page.');
      this.router.navigate(['/']); // Redirect to home page
    }
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

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/bullet.png'; // Fallback image
}


toggleEditMode() {
  this.isEditMode = !this.isEditMode;
}

hideRelatedProduct() {
  this.showRelatedProduct = false;
}

deleteProduct(id: number): void {
  this.produitService.deleteProduit(id).subscribe(
    () => {
      console.log(`Product with ID ${id} deleted successfully.`);
      this.popupService.showSuccess('Product deleted successfully');
      this.loadProductsFromShop(); // Reload products after deletion
    },
    (error) => {
      console.error(`Error deleting product with ID ${id}`, error);
      this.popupService.showError('There was an error while trying to delete the product.');
    }
  );
}

}
