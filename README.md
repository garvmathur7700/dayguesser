# DayGuesser

A mobile-first quiz: you’re shown a date, you guess the day of the week.

## Run locally

Open `index.html` in a browser. No build step, no dependencies.

## Deploy to GitHub Pages

1. Push these three files (`index.html`, `style.css`, `script.js`) to a repo.
1. Repo Settings → Pages → Source: deploy from branch `main`, folder `/ (root)`.
1. Your game will be live at `https://<username>.github.io/<repo-name>/`.

## Notes

- Dates are generated client-side in batches of 10; no data is stored or sent anywhere.
- Weekday is computed with the browser’s built-in `Date` object.
- Date range is any year 1–9999 in the Gregorian calendar — JS’s `Date` handles this natively, so range isn’t a limiting factor.