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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthRoleGuard } from 'src/users/guards/auth-role.guard';
import { UserType } from 'src/utilits/user-type.enum';
import { Roles } from 'src/users/decorators/role.decorator';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { JwtPayloadType } from 'src/utilits/types';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Get('get-all-products')
  findProducts(
    @Query('title') title: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    return this.productService.findProducts(title, minPrice, maxPrice);
  }

  @Post('create-new-product')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRoleGuard)
  public async createNewProduct(
    @Body() body: CreateProductDto,
    @CurrentUser() payLoad: JwtPayloadType,
  ) {
    return await this.productService.createNewProduct(body, payLoad.id);
  }

  @Get(':id')
  public getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @Patch('update-product/:id')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  public async updateProduct(
    @Body() body: UpdateProductDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.productService.updateProduct(id, body);
  }

  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  @Delete(':id')
  public deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return 'deleted succefully';
  }
}
