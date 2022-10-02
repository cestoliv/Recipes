import { Controller, Get, Param } from '@nestjs/common';
import { Recipe } from 'src/recipes.interface';
import { RecipesService } from './recipes.service';

@Controller('/api/v1/recipes')
export class RecipesController {
	constructor(private readonly recipesService: RecipesService) {}

	@Get(':id')
	async get(@Param('id') id: string): Promise<Recipe> {
		return this.recipesService.get(id);
	}

	@Get('search/:query')
	async search(@Param('query') query: string): Promise<Recipe[]> {
		return await this.recipesService.search(query);
	}
}
