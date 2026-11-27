# Nook — Find your flow

A responsive café and study-space discovery app for Berkeley. Choose a session intent, time, duration, and distance to find nearby cafés and libraries.

Live app: https://nook-find-your-flow-vc.vamsichilamkur.chatgpt.site/

## Run locally

No build step or package install is required. From the repository root:

```sh
python3 -m http.server 8765 --directory dist
```

Open http://localhost:8765. Run the ranking checks with:

```sh
node tests/ranking.cjs
```

## Features

- Responsive desktop and mobile layouts
- Intent-based ranking and filters for listed hours and mapped Wi-Fi
- Place details and OpenStreetMap links
- Saved places and fit feedback stored on the visitor's device
- PostHog pageview and discovery-event analytics, with an opt-out

## Source layout

- `dist/`: deployable HTML, CSS, JavaScript, and venue snapshot
- `scripts/import_osm.py`: refresh the OpenStreetMap snapshot
- `tests/ranking.cjs`: ranking and hours checks
- `.openai/hosting.json`: existing Sites deployment identity

## Data and limitations

The deployed app reads dist/places.json, a snapshot of © OpenStreetMap contributors, under the Open Database License (https://www.openstreetmap.org/copyright). The snapshot includes the exact Overpass QL query, public endpoint, OSM timestamp and source object IDs. Coordinates use Sather Gate as the origin; distances are straight-line, not routes. Dataset access rights and community-mapped facts may change.

Refresh intentionally with python3 scripts/import_osm.py. This requires curl and network access and replaces the snapshot only after a successful response. The public app never calls Overpass for individual searches. Run node tests/ranking.cjs to verify the conservative hours evaluator. Unsupported hours expressions are displayed verbatim with unconfirmed status. No live seats, crowd predictions, noise, outlet, Wi-Fi speed or booking data are supplied.

## Analytics

`dist/analytics.js` contains a public, write-only PostHog project token, not a personal API key. Tracking runs only on `chatgpt.site` domains and respects the app opt-out and supported browser privacy signals. Session recording is disabled. Replace the token and deployment-domain check when adapting the app for a different project or host.
