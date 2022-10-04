import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { RecipesService } from './recipes/recipes.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly recipesService: RecipesService,
	) {}

	@Get()
	@Render('index')
	getIndex() {
		return;
	}

	@Get('recipes/:id')
	@Render('recipe')
	async getRecipe(@Param('id') id: string) {
		return { recipe: await this.recipesService.get(id) };
	}

	@Get('author')
	getAuthor(): string {
		return this.appService.getAuthor();
	}
}
