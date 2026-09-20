import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // Get current user's favorites
  @Get()
  async getUserFavorites(@CurrentUser() user: any) {
    return this.favoritesService.getUserFavorites(user.sub);
  }

  // Toggle favorite for a product (Add/Remove)
  @Post('toggle/:productId')
  @Post(':productId/toggle')
  @HttpCode(HttpStatus.OK)
  async toggleFavorite(
    @Param('productId') productId: string,
    @CurrentUser() user: any,
  ) {
    return this.favoritesService.toggleFavorite(user.sub, productId);
  }

  // Check if a product is favorited by current user
  @Get('check/:productId')
  async isFavorited(
    @Param('productId') productId: string,
    @CurrentUser() user: any,
  ) {
    const favorited = await this.favoritesService.isFavorited(user.sub, productId);
    return { is_favorited: favorited };
  }
}
