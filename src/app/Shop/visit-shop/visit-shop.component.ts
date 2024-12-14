import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/Category';
import { Shop } from 'src/app/models/Shop';
import { CategoryService } from 'src/app/services/Category/category.service';
import { ShopService } from 'src/app/services/Shop/shop.service';
import { UtilisateurService } from 'src/app/services/Utilisateur/utilisateur.service';

@Component({
  selector: 'app-visit-shop',
  templateUrl: './visit-shop.component.html',
  styleUrls: ['./visit-shop.component.css']
})
export class VisitShopComponent implements OnInit {
  
  categories?: Category[];
  selectedCategoryIds: number[] = [];
  selectedSortingOption: string = '';
  shopId?: number;
  shop?: Shop;
  utilisateur: any; // To hold the user data

  constructor(
    private shopService: ShopService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private utilisateurService: UtilisateurService, // Inject the utilisateur service
    private router: Router // Inject Router for navigation
  ) {}

  ngOnInit(): void {
    this.loadUtilisateur(); // Load utilisateur data first
    this.loadCategories();
  }

  loadUtilisateur(): void {
    // Assuming user information is available in localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
      this.utilisateurService.getUtilisateurById(user.id).subscribe(
        utilisateur => {
          this.utilisateur = utilisateur;
          console.log('Utilisateur:', this.utilisateur); // Logging utilisateur

          // Handle shop localStorage
          if (this.utilisateur?.shop) {
            localStorage.setItem('shop', this.utilisateur.shop.id.toString());
          } else {
            localStorage.removeItem('shop');
          }

          // After utilisateur data is loaded, check shop ID and route
          this.route.paramMap.subscribe(params => {
            this.shopId = +params.get('sid')!; // Retrieve and convert the shop ID from the URL
            console.log('Shop ID from route:', this.shopId);
            console.log('Shop ID from user:', this.utilisateur?.shop?.id);
            
            if (this.shopId) {
              // Check if the current shopId matches the user's shop ID
              if (this.utilisateur?.shop?.id === this.shopId) {
                // If it matches, redirect to /MyShop
                this.router.navigate(['/MyShop']);
              } else {
                // Fetch the shop details if it doesn't match
                this.shopService.getShopById(this.shopId).subscribe(
                  (shop) => {
                    this.shop = shop; // Store the shop details
                    console.log('Shop Details:', this.shop);
                  },
                  (error) => {
                    console.error('Error loading shop details', error);
                  }
                );
              }
            } else {
              console.warn('No shop ID found in route');
            }
          });

        },
        error => {
          console.error('Error loading utilisateur', error);
        }
      );
    } else {
      localStorage.removeItem('shop'); // Remove shop key if no user
    }
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
