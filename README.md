# Wayfarer — Travel & Tourism Website

Wayfarer is a responsive, single-page travel and tourism website. Visitors can browse destinations by category, search by name or country, view a photo gallery, check live weather for any city, explore places and hotels, read travel tips, and estimate the cost of a trip.

Built with **HTML5, CSS3 and vanilla JavaScript** — no frameworks, no build step.

## Features

| Section | What it does |
| --- | --- |
| Destinations | Category filters and live search by destination or country, with a result counter and empty state |
| Gallery | Photo grid with a lightbox (previous/next buttons, arrow keys, Esc to close) |
| Weather | Live temperature, feels-like, humidity, wind and conditions for any city via the Open-Meteo API; one-click "Check weather" on every destination card |
| Places | Shortlist of must-see sights |
| Stays | Budget, mid-range and luxury accommodation |
| Tips | Practical travel advice |
| Budget calculator | Total cost in Indian rupees (₹) with per-category breakdown, per-day and per-person cost, traveler count and reset |

Also included: mobile navigation menu, active-section highlighting, back-to-top button, skip link, keyboard-accessible controls, ARIA labels, lazy-loaded images with a fallback placeholder, and HTML escaping of all rendered data.

## Project Structure

```
wayfarer/
├── index.html
├── README.md
├── assets/
│   ├── favicon.svg
│   └── images/            Destination and gallery photos
├── css/
│   ├── style.css          Base styles and components
│   └── responsive.css     Tablet and mobile breakpoints
└── js/
    ├── utils.js           Shared helpers (escaping, currency, image fallback)
    ├── data.js            Destinations, gallery, places, hotels, tips
    ├── gallery.js         Gallery grid and lightbox
    ├── weather.js         Open-Meteo geocoding and forecast requests
    ├── search.js          Category filter and destination search
    ├── budget.js          Budget calculator
    └── app.js             Page rendering and navigation setup
```

## How to Run

1. Download or clone the project.
2. Open `index.html` in any modern browser.

An internet connection is needed for the photos, fonts and weather data.

Optional local server:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Customising

- **Add a destination:** add an object to the `destinations` array in `js/data.js` (`name`, `category`, `country`, `desc`, `img`, and optionally `weatherCity` if the weather lookup needs a nearby city name). Put local photos in `assets/images/`. Add a new category to the `categories` array if needed.
- **Change colours or fonts:** edit the CSS variables at the top of `css/style.css`.

## Technologies and Credits

- HTML5, CSS3 (Grid, Flexbox, custom properties, media queries), JavaScript (ES6+)
- Weather and geocoding: [Open-Meteo](https://open-meteo.com) (free, no API key)
- Photos: project-supplied images, plus some from [Unsplash](https://unsplash.com)
- Fonts: Fraunces and Work Sans via Google Fonts

## Browser Support

Latest versions of Chrome, Edge, Firefox and Safari.
