import { Injectable, HttpException } from '@nestjs/common';
import { Recipe } from '../recipes.interface';
import { searchRecipes, MarmitonQueryBuilder } from 'marmiton-api';
const {
	RecipesParser,
} = require('marmiton-api/dist/lib/components/recipes-parser');
import { parse } from 'node-html-parser';

@Injectable()
export class RecipesService {
	async get(id: string): Promise<Recipe> {
		const URL = `https://www.marmiton.org/recettes/recette_${id}.aspx`;

		const request = await fetch(URL);
		if (request.status == 404)
			throw new HttpException('Recipe not found', 404);
		if (request.status !== 200)
			throw new HttpException(
				"Unknow error while fetching Marmiton's data",
				500,
			);

		const htmlBody = await request.text();
		const parsed = await RecipesParser.parseRecipe(htmlBody);
		if (!parsed)
			throw new HttpException(
				"Unknow error while parsing Marmiton's data",
				500,
			);
		const dom = parse(htmlBody);
		const name = dom.querySelectorAll('h1')[0].text;
		if (!name) throw new HttpException("Can't find recipe's name", 500);
		const rateRegex = htmlBody.match(/>(\d|\d\.\d)<!-- -->\/<!-- -->5/);
		if (!rateRegex || !rateRegex[1])
			throw new HttpException("Can't find recipe's rate", 500);
		const rate = Number(rateRegex[1]);

		const recipe: Recipe = {
			name,
			rate,
			url: URL,
			id,
			ingredients: parsed.ingredients || [],
			author: parsed.author || '',
			images: parsed.images || [],
			steps: parsed.steps || [],
			description: parsed.description || '',
			difficulty: parsed.difficulty || 0,
			budget: parsed.budget || 0,
			tags: parsed.tags || [],
			prepTime: parsed.prepTime || 0,
			totalTime: parsed.totalTime || 0,
			people: parsed.people || 0,
		};
		return recipe;
	}

	async search(
		query: string,
		vegan: boolean,
		vegetarian: boolean,
		limit: number,
	): Promise<Recipe[]> {
		const recipes: Recipe[] = [];

		const qb = new MarmitonQueryBuilder();
		const q = qb.withTitleContaining(query);
		if (vegan) q.vegan();
		else if (vegetarian) q.vegetarian();

		if (!limit) limit = 12;
		const result = await searchRecipes(q.build(), { limit });

		for (const recipe of result) {
			if (
				recipe.url.startsWith(
					'https://www.marmiton.org/recettes/recette_',
				)
			)
				recipes.push({
					id: recipe.url.split('recette_')[1].split('.aspx')[0],
					...recipe,
				});
		}

		if (recipes.length != 0) recipes.sort((a, b) => b.rate - a.rate);

		return recipes;
	}
}
