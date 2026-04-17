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
- [C] Location-specific date override implemented
- [C] Location-specific override resets when global date range changes
- [C] URL query parameter persistence implemented for selected metrics, selected computed series, global date range,
and selected location
- [C] localStorage persistence implemented for saved locations
- [C] Time-series weather data loaded from a no-auth API or documented mock server (MANDATORY)
- [C] At least one computed series implemented (MANDATORY)
- [C] Loading states implemented
- [C] Empty states implemented
- [C] Error states implemented
- [C] Graceful failure handling implemented
- [C] README setup instructions included (MANDATORY)
- [C] Architecture and technical decisions documented
- [C] Known limitations or tradeoffs documented
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

## Architecture and Technical Decisions

1. High-level architecture
The application follows a client-side React architecture built around feature modules:

Toolbar for global controls (date range, metrics, computed series)
Interactive map for location selection and saved markers
Detail view for weather charts of the currently selected location
Shared store layer for cross-component state
Helper layer for URL synchronization and data transformations
This keeps UI concerns separated from data/state concerns while allowing coordinated updates across map, toolbar, and charts.

2. State management strategy
Global state is managed with Zustand.

Key decisions:

Keep a single global location object as the active working selection.
Maintain a location list for persisted saved points.
Keep computed series selection in a dedicated store slice.
Use direct selectors in components to reduce prop drilling and keep component APIs small.
Why:

Zustand is lightweight and straightforward for this scale.
It avoids complex reducer boilerplate while preserving type safety and predictable updates.

3. Data flow and synchronization
The data flow is unidirectional:

User interaction updates store state.
Store state drives API fetch inputs.
Fetch responses drive chart rendering.
Synchronization targets:

URL query params for shareable/reloadable state
Local storage for saved locations
Technical decision:

URL update logic is centralized into helper utilities to avoid inconsistent query handling.
Selected controls initialize from URL when available, then continue from store state.

4. Persistence model
Two persistence layers are used for different needs:

URL query params: date range, active coordinates, selected metrics, selected computed series
Local storage: saved location list

5. Mapping design
Leaflet is used for map rendering and marker interaction.

Decisions:

Clicking map updates current working marker position immediately.
Saved markers are rendered from persisted list.
Active saved location marker is visually distinct.
Unsaved selected location can take visual priority to reflect immediate user focus.

6. Charting design
Chart.js is used through reusable chart components.

Decisions:

Render a separate chart per selected metric.
Add computed series (moving average, min/max bands, trend line) as additional datasets per metric chart.
Build computed-series metadata once and reuse it to avoid repeated inline mappings.

7. Date handling decisions
Date range selection is handled with a range picker and normalized to local date strings.

Decisions:

Use local date formatting to avoid timezone drift/off-by-one issues.
Keep picker input value and selected calendar days synchronized on initial load and controlled updates.

8. Error handling and resiliency
Resiliency is layered:

Component-level loading and error states for fetch-driven UI
Error boundaries at major UI regions to prevent one failure from blanking the full page

9. Technical tradeoffs
Client-first architecture improves iteration speed but limits SSR/SEO relevance.
Local storage persistence is simple, but not multi-device.
URL state is practical for sharing, but full restoration can still miss data that exists only locally.
Multiple controlled sync points (store, URL, local storage) increase complexity and require careful ordering.

10. Alternatives considered
React Context with reducers: rejected due to higher boilerplate for this scope.
Server-backed persistence: postponed to keep setup lightweight and no-auth.

## Known limitations
No request deduping/caching strategy for rapid filter changes.
Persistence is browser-local for saved locations.