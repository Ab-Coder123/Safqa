import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // PUBLIC: Browse / Search (no auth required — Product_Discovery_Workflow.md)
  @Get()
  async findAll(@Query() dto: SearchProductsDto) {
    return this.productsService.findAll(dto);
  }

  // PUBLIC: Get product details
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // PRIVATE: Get own listings (all statuses)
  @UseGuards(JwtAuthGuard)
  @Get('me/listings')
  async findMyListings(@CurrentUser() user: any) {
    return this.productsService.findMyListings(user.sub);
  }

  // PRIVATE: Create product — enforces 3/day limit
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: any, @Body() dto: CreateProductDto) {
    return this.productsService.create(user.sub, dto);
  }

  // PRIVATE: Update product (owner or SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, user.sub, user.role, dto);
  }

  // PRIVATE: Mark as SOLD (one-way transition)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/sold')
  @HttpCode(HttpStatus.OK)
  async markAsSold(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.markAsSold(id, user.sub, user.role);
  }

  // PRIVATE: Archive / Soft-delete product
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async archive(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.archive(id, user.sub, user.role);
  }
}
