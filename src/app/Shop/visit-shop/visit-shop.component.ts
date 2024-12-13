import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/Category';
import { Produit } from 'src/app/models/Produit';
import { Shop } from 'src/app/models/Shop'; // Ensure you have the Shop model imported
import { CategoryService } from 'src/app/services/Category/category.service';
import { ShopService } from 'src/app/services/Shop/shop.service';

@Component({
  selector: 'app-visit-shop',
  templateUrl: './visit-shop.component.html',
  styleUrls: ['./visit-shop.component.css']
})
export class VisitShopComponent implements OnInit {
  
  categories?: Category[];
  selectedCategoryIds: number[] = []; // Array to hold selected categories
  selectedSortingOption: string = ''; // Property to store selected sorting option
  shopId?: number;
  shop?: Shop; // Add a property to hold the shop details

  constructor(
    private shopService: ShopService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  
    // Subscribe to route parameters
    this.route.paramMap.subscribe(params => {
      // Retrieve the 'sid' parameter from the URL (shop ID)
      this.shopId = +params.get('sid')!; // Get the parameter and convert to number
    
      console.log('Shop ID from route:', this.shopId);
      
      if (this.shopId) {
        // Fetch shop details by calling getShopById API method
        this.shopService.getShopById(this.shopId).subscribe(
          (shop) => {
            this.shop = shop; // Store the shop details
            console.log('Shop Details:', this.shop);
          },
          (error) => {
            console.error('Error loading shop details', error);
          }
        );
      } else {
        console.warn('No shop ID found in route');
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
        console.log('Categories:', this.categories); // Logging categories
      },
      (error) => {
        console.error('Error loading categories', error);
      }
    );
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
}
