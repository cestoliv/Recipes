import { Controller, Get, Param, Query } from '@nestjs/common';
import { Recipe } from 'srcs/nest/recipes.interface';
import { RecipesService } from './recipes.service';

@Controller('/api/v1/recipes')
export class RecipesController {
	constructor(private readonly recipesService: RecipesService) {}

	@Get(':id')
	async get(@Param('id') id: string): Promise<Recipe> {
		return this.recipesService.get(id);
	}

	@Get('search/:query')
	async search(
		@Param('query') query: string,
		@Query('vegan') vegan: boolean,
		@Query('vegetarian') vegetarian: boolean,
		@Query('limit') limit: number,
	): Promise<Recipe[]> {
		return await this.recipesService.search(query, vegan, vegetarian, limit);
	}
}
