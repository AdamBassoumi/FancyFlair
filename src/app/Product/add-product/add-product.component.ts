import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoryService } from '../../services/Category/category.service';
import { ProduitService } from '../../services/Produit/produit.service'; // Import the ProduitService
import { Category } from '../../models/Category';
import { Produit } from '../../models/Produit';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup/popup.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  categories?: Category[];

  // Properties for form data
  productName = '';
  productCategory = '';
  additionalDescription = '';
  productPrice = '';
  comments = '';
  selectedFile: File | null = null;

  constructor(
    private categoryService: CategoryService,
    private produitService: ProduitService,
    private http: HttpClient,
    private router: Router, // Inject Router for navigation
    private popupService: PopupService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
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

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(form: NgForm) {
    const formData = form.value;
    const categoryName = formData['product-category'];
    const category = this.categories?.find(cat => cat.name === categoryName);
    
    // Retrieve the shop ID from local storage
    const shopId = localStorage.getItem('shop');
  
    // Validation checks
    if (!shopId) {
      alert('Shop ID is missing');
      return;
    }
  
    if (!category) {
      this.popupService.showError('Category is required');
      return;
    }
  
    const name = formData['product-name'];
    const price = formData['product-price'];
    
    if (!name) {
      this.popupService.showError('Product name is required');
      return;
    }
  
    if (!price || isNaN(price) || price <= 0) {
      this.popupService.showError('Invalid product price');
      return;
    }
  
    const newProduit: any = {
      name: name,
      description: formData['additional-description'],
      prix: parseFloat(price),
      fichier: this.selectedFile ? 'assets/produits/' + this.selectedFile.name : '',
      dateCreation: new Date().toString(),
      category: category,
    };
  
    console.log('Produit to add:', newProduit);
  
    // Save the product using ProduitService
    this.produitService.createProduit(newProduit, +shopId, category.id).subscribe(
      (produit) => {
        console.log('Produit successfully added:', produit);
        this.popupService.showSuccess('Produit successfully added');
        this.router.navigate(['/MyShop']);
        
      },
      (error) => {
        console.error('Error adding produit:', error);
        this.popupService.showError('Error adding product');
      }
    );
  
    // Handle file upload if a file is selected
    if (this.selectedFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', this.selectedFile);
  
      this.http.post('http://localhost:5000/upload', uploadFormData).subscribe(
        response => {
          console.log('File uploaded successfully:', response);
          this.popupService.showSuccess('File uploaded successfully');
        },
        error => {
          console.error('Error uploading file:', error);
          this.popupService.showError('Error uploading file');
        }
      );
    } else {
      console.log('No file selected');
      this.popupService.showError('No file selected');
    }
  }
  
  
}
