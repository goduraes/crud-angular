import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "./../product.service";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-product-create",
  templateUrl: "./product-create.component.html",
  styleUrls: ["./product-create.component.css"],
})
export class ProductCreateComponent implements OnInit {
  id = this.route.snapshot.paramMap.get("id");
  isUpdate = this.route.snapshot.data['isUpdate'];
  isDelete = this.route.snapshot.data['isDelete'];

  title = 'Criar produto';
  btntxt = 'Salvar';
  btnColor = 'primary';

  ErrorMessage = "Valor Inválido!";
  productForm = new FormGroup({
    name: new FormControl<string>({ value: '', disabled: this.isDelete }),
    price: new FormControl<number | null>({ value: null, disabled: this.isDelete }),
  });

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.title = this.isDelete ?  'Apagar produto'  : 'Alterar produto';
      this.btntxt = this.isDelete ?  'Apagar'  : 'Atualizar';
      this.btnColor = this.isDelete ?  'warn'  : 'accent';

      this.productService.readById(this.id).subscribe(product => {
        this.productForm.setValue({
          name: product.name,
          price: product.price
        })
      });
    }
  }

  createProduct(): void {
    if (this.productForm.status === "VALID") {
      this.productService.create(this.productForm.value).subscribe(() => {
        this.productService.showMessage("Produto criado!");
        this.router.navigate(["/products"]);
      });
    }
  }

  updateProduct(): void {
    if (this.productForm.status === "VALID" && this.id) {
      const data = {
        id: parseInt(this.id),
        ...this.productForm.value
      }
      this.productService.update(data).subscribe(() => {
        this.productService.showMessage("Produto alterado!");
        this.router.navigate(["/products"]);
      });
    }
  }

  deleteProduct(): void {
    if (this.id) {
      this.productService.delete(this.id).subscribe(() => {
        this.productService.showMessage("Produto Apagado!");
        this.router.navigate(["/products"]);
      });
    }
  }

  action()  {
    if (!this.id) this.createProduct();
    if(this.id && this.isUpdate) this.updateProduct();
    if(this.id && this.isDelete) this.deleteProduct();
  }

  cancel(): void {
    this.router.navigate(["/products"]);
  }
}
