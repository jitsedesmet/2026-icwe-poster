# WebPoster

Kick-start the creation of your RDFa-annotated Web poster in HTML.

## Getting Started

Create a repository using this template and follow the instructions below.

Install the dependencies and run the development server:

```bash
npm install
npm run dev
```

Edit `index.html` to customize your poster content.
- You can configure your theme colors and font in `css/style.scss`
- You can choose different section layouts by using the grid-column and grid-row CSS properties.
- You can add icons from [Font Awesome](https://fontawesome.com/icons) by adding the relevant classes to the `<i>` elements.
- You can add images by placing them in the `images` folder and referencing them in your HTML.

## Deployment

You can deploy your poster to GitHub Pages or any static site hosting service.

The template is configured to deploy to GitHub Pages.
Make sure to update the `base` field in `vite.config.js` to match your repository name.

You can manually build and test the production version with:

```bash
npm run build
npm run serve
```
