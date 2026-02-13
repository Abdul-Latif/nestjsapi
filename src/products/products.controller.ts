import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Get('get-all-products')
  findProducts() {
    return this.productService.findProducts();
  }

  @Post('create-new-product')
  public createNewProduct(@Body() body: CreateProductDto) {
    // return this.productService.createNewProduct();
    return this.productService.createNewProduct(body);
  }

  @Get(':id')
  public getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @Patch('update-product/:id')
  public async updateProduct(
    @Body() body: UpdateProductDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.productService.updateProduct(id, body);
  }

  @Delete(':id')
  public deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return 'deleted succefully';
  }
}
