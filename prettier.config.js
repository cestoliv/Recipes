module.exports = {
	plugins: [require('prettier-plugin-tailwindcss')],
	tailwindConfig: './tailwind.config.js',
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	tabWidth: 4,
	overrides: [
		{
			files: ['*.eta'],
			options: {
				parser: 'html',
			},
		},
	],
};
