## Getting Started

First, install required dependencies.

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Implementation Checklist

Legend:
- [C] completed
- [P] partially completed
- [-] not completed

Checklist:

Required Items:
- [C] Global toolbar implemented (MANDATORY)
- [C] Global date range selection implemented (MANDATORY)
- [C] Global metric checkbox list implemented (MANDATORY)
- [C] Global computed-series checkbox list implemented (MANDATORY)
- [C] Interactive map implemented (MANDATORY)
- [C] Add and save location flow implemented (MANDATORY)
- [C] Remove location flow implemented (MANDATORY)
- [C] Saved locations displayed on the map (MANDATORY)
- [C] One active/selected location displayed in the location detail view (MANDATORY)
- [C] Multiple selected metrics displayed as stacked charts within the active location detail view (MANDATORY)
- [-] Location-specific date override implemented
- [-] Location-specific override resets when global date range changes
- [C] URL query parameter persistence implemented for selected metrics, selected computed series, global date range,
and selected location
- [-] localStorage persistence implemented for saved locations
- [C] Time-series weather data loaded from a no-auth API or documented mock server (MANDATORY)
- [C] At least one computed series implemented (MANDATORY)
- [-] Loading states implemented
- [-] Empty states implemented
- [-] Error states implemented
- [-] Graceful failure handling implemented
- [C] README setup instructions included (MANDATORY)
- [-] Architecture and technical decisions documented
- [-] Known limitations or tradeoffs documented
- [C] AI Usage Disclosure included (MANDATORY)

Extra Items:

- [-] Share Dashboard button opens a dialog with a copyable self-contained URL
- [-] Shared URL restores the full dashboard state when opened by another user, including state that would otherwise
only exist in localStorage
- [-] Multiple saved locations can be selected at the same time

- [-] Separate chart/widget rendered for each selected location
- [-] Charts/widgets grouped by location when multiple locations are selected
- [-] All 3 computed series implemented: 7-day moving average, min and max lines, and simple trend/regression
line
- [-] Request cancellation or caching implemented for rapidly changing filters
- [-] Unit tests added for transformation logic
- [-] Dockerfile included
- [-] docker-compose.yaml included
- [-] docker-compose.yaml builds the application image from the provided Dockerfile
- [-] Docker Compose setup is self-contained enough that, preferably, cloning the repository and running docker
compose up is sufficient to build and start the application
- [-] Docker setup includes clear instructions for building and running the application locally
- [-] Self-signed HTTPS certificate support included
- [-] Simple authentication gate added for the dashboard
- [-] Mobile-responsive layout support included

## AI Usage Disclosure

Google copilot GPT-4.1 and ChatGPT GPT-5.3 was used during implementation of the application. AI models were used to speed up implementation and usage of integrating the leafletjs map library together with chart.js. Both of these libraries were new to me thus it allowed for faster adaptation and usage. In addition AI was used to proof check code for improvements and suggestions from AI models.