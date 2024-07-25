/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00C261',
                secondary: '#005155',
                black: '#444444',
                background: '#F1F5F9',
                'light-grey': '#A5A5A5',
                'lightest-grey': '#D9D9D9',
                'tag-grey': '#ECECEC',
            },
            fontFamily: {
                kanit: ['Kanit'],
                poppins: ['Poppins', 'sans-serif']
            },
            fontSize: {
                'heading': '38px',
            },
            boxShadow: {
                'default': '0px 5px 15px 8px rgba(0, 0, 0, 0.05)',
            },
        },
    },
    plugins: [],
}
