# TripOffer — Simple Trip Presentation Site

A lightweight, responsive single-page website to present your upcoming trip: overview, itinerary, and logistics.

## Customize
Edit these parts in the files below:

- Title, dates, and destination: in `partials/hero.html`
- About highlights: in `partials/about.html`
- Itinerary items (2 weeks): in `partials/itinerary.html`
- Logistics (travel, stay, budget, packing): in `partials/details.html`
- Footer text: in `partials/footer.html`
- Colors and look & feel: in `styles.css` (CSS variables at the top)

## Run locally
You can open `index.html` directly in a browser, but to see component includes resolved you should run the Node server:

```bash
# From the TripOffer folder
npm start
```

Then visit http://localhost:5173 in your browser. To change the port, run `PORT=3000 npm start` and open http://localhost:3000.

## Notes
- No build or external dependencies are required; it's a static site served by a tiny Node server.
- Replace placeholder text/images as you like. If you want images, drop them into an `assets/` folder and reference them from `index.html`.
