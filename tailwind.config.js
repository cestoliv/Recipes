module.exports = {
	content: ['./srcs/**/*.{html,js,eta}'],
	plugins: [require('@tailwindcss/line-clamp')],
	theme: {
		colors: {
			'eerie-black': '#212121',
			orangered: '#ff4a1c',
			'ghost-white': '#f0eff4',
			white: '#fff',
			gray: '#cccccc',
			veggie: '#97be0d',
			'dark-veggie': '#617711',
		},
		fontFamily: {
			sans: ['Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
			serif: ['serif'],
		},
	},
};
