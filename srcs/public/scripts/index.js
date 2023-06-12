const html_card_template = `
<a
	class="mb-5 flex h-32 w-11/12 rounded-md bg-white shadow-lg duration-150 hover:scale-105 md:w-3/4 lg:w-1/2 max-w-3xl"
	href="/recipes/{ID}"
>
	<img
		class="h-auto w-28 rounded-l-md object-cover md:w-52 sm:w-36"
		src="{IMAGE_URL}"
	/>
	<div class="ml-3 mr-3 flex w-full flex-col justify-center">
		<p class="mb-1 text-base md:text-lg font-medium text-eerie-black line-clamp-3">
			{TITLE}
		</p>
		<div class="mb-1 flex">
			<div class="mr-4 flex items-center">
				{STARS}
			</div>
			<div class="flex items-center">
				<svg
					class="mr-2 h-4 w-4 fill-orangered"
					aria-hidden="true"
					focusable="false"
				>
					<use xlink:href="/public/icons/clock.svg#icon"></use>
				</svg>
				<span class="text-sm text-eerie-black">{DURATION} min</span>
			</div>
		</div>
	</div>
</a>
`;
const html_star = `
<svg
	class="h-4 w-4 fill-orangered"
	aria-hidden="true"
	focusable="false"
>
	<use xlink:href="/public/icons/star.svg#icon"></use>
</svg>
`;
const html_star_half = `
<svg
	class="h-4 w-4 fill-orangered"
	aria-hidden="true"
	focusable="false"
>
	<use xlink:href="/public/icons/star-half.svg#icon"></use>
</svg>
`;
const html_star_empty = `
<svg
	class="h-4 w-4 fill-orangered"
	aria-hidden="true"
	focusable="false"
>
	<use xlink:href="/public/icons/star-empty.svg#icon"></use>
</svg>
`;

const dom_results_box = document.getElementById('search-results');
const dom_search_input = document.getElementById('search-input');
const dom_search_placeholder = document.getElementById('search-placeholder');
const dom_search_vegan = document.getElementById('search-vegan');
const dom_search_vegetarian = document.getElementById('search-vegetarian');
const dom_search_error = document.getElementById('search-error');

function get_stars(rating) {
	let complete_stars = Math.floor(rating);
	let half_stars = Math.ceil(rating - complete_stars);
	let stars =
		html_star.repeat(complete_stars) +
		html_star_half.repeat(half_stars) +
		html_star_empty.repeat(5 - complete_stars - half_stars);

	return stars;
}

function display_results(recipes) {
	dom_results_box.innerHTML = '';

	recipes.forEach((recipe) => {
		let image_url = '/public/placeholder.png';
		if (recipe.images.length > 0) {
			if (recipe.images.length > 1) image_url = recipe.images[1];
			else image_url = recipe.images[0];
		}

		dom_results_box.innerHTML += html_card_template
			.replace('{ID}', recipe.id)
			.replace('{IMAGE_URL}', image_url)
			.replace('{TITLE}', recipe.name)
			.replace('{STARS}', get_stars(recipe.rate))
			.replace('{DURATION}', recipe.totalTime);
	});
}

function fetch_recipes(query) {
	dom_search_placeholder.classList.remove('hidden');
	dom_search_error.classList.add('hidden');
	dom_results_box.innerHTML = '';

	let url = `/api/v1/recipes/search/${query}`;
	if (dom_search_vegan.checked) url += '?vegan=true';
	if (dom_search_vegetarian.checked) url += '?vegetarian=true';

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			dom_search_placeholder.classList.add('hidden');
			if (data.length == 0) {
				dom_search_error.innerHTML =
					'<p>Impossible de trouver un résultat pour cette recherche.</p>';
				dom_search_error.classList.remove('hidden');
				return;
			}
			// If data is an array, display results
			if (Array.isArray(data)) display_results(data);
			else console.error("Can't process", data);
		});
}

// Event listeners
document.getElementById('search-button').addEventListener('click', () => {
	fetch_recipes(dom_search_input.value);
});

dom_search_input.addEventListener('keypress', (event) => {
	if (event.key === 'Enter') fetch_recipes(dom_search_input.value);
});

dom_search_vegan.addEventListener('change', () => {
	if (dom_search_input.value !== '') fetch_recipes(dom_search_input.value);
});

dom_search_vegetarian.addEventListener('change', () => {
	if (dom_search_input.value !== '') fetch_recipes(dom_search_input.value);
});
