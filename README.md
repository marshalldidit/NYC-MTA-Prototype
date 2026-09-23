# NYC MTA Prototype

A lightweight web app that randomly selects a New York City subway station from the NYC MTA dataset and displays its borough, service details, structure, and accessibility information.

## Features

- Fetches live MTA station data from the NYC Open Data API
- Randomly picks one station on load
- Displays:
  - station name
  - borough
  - routes
  - station structure
  - accessibility status

## Tech Stack

- HTML
- JavaScript
- Fetch API
- NYC Open Data endpoint

## Run locally

1. Open the project folder in a browser, or serve it locally:

   ```bash
   cd /path/to/MTA-Prototype
   python3 -m http.server 8000
   ```

2. Visit:

   ```text
   http://localhost:8000
   ```

## Data source

This project uses the NYC Open Data MTA station dataset:

- https://data.ny.gov/resource/39hk-dx4f.json

## Notes

This is a simple prototype and is intended as a demo for exploring MTA station metadata in the browser.
