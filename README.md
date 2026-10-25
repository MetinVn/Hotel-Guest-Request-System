# Hotel Guest Request System

A full-stack request-management platform for hotel operations. Capture guest needs, prioritize service work, track fulfillment, and review completed requests through a responsive dashboard backed by a REST API and PostgreSQL.

## System Architecture

The system uses a layered backend and a component-oriented React frontend.

- **Backend:** Java 17, Spring Boot, Spring Data JPA, and PostgreSQL. The backend uses an N-Tier Architecture that separates REST controllers, application services, repositories, entities, and DTOs.
- **Frontend:** React with TypeScript, Vite, and Tailwind CSS v4. Focused components and custom hooks separate dashboard, history, request state, validation, and cross-store workflow concerns.
- **Persistence:** PostgreSQL schema changes are versioned and applied with Flyway. Hibernate validates the migrated schema at startup.

## Enterprise Patterns & Technical Highlights

### Dynamic server-side filtering

The request listing service uses Spring Data JPA's `JpaSpecificationExecutor` and Criteria API to compose optional status, priority, and case-insensitive guest-name/room filters. Filtering, sorting, and pagination run in the database rather than loading the full request set into the browser. The API caps page size and applies a stable ID tie-breaker to sort orders.

### PostgreSQL search indexes

Flyway migrations define B-tree indexes for status, priority, creation time, guest name, and room number. For the API's case-insensitive substring search, expression-based trigram GIN indexes target `lower(guest_name)` and `lower(room_number)`, matching the database predicates used by the search.

### Validated API boundaries

The frontend validates API response payloads with Zod before mapping them into application types and request state. The backend independently validates incoming request DTOs with Jakarta Bean Validation, keeping validation at both system boundaries.

### State orchestration with a React facade

`useRequestWorkflow` coordinates remote status changes with local browser history. It waits for the backend update before adding a completed request snapshot to `localStorage` or removing the snapshot when a completed request is reopened. A failed API update leaves local history unchanged.

History is browser-local and is not a server-side audit log or synchronized across devices. Its view supports client-side filtering, sorting, and removal of saved snapshots.

### Frontend performance and presentation

The `useDebounce` hook delays search requests until input settles, reducing redundant API queries. Responsive layouts adapt the dashboard controls and request cards to screen size. Tailwind CSS v4 provides class-based dark styling, with the selected theme persisted in browser storage.

## Core Components

```text
.
├── frontend/
│   └── src/
│       ├── components/   # Dashboard, history, filters, forms, and request cards
│       ├── hooks/        # API state, debounce, theme, history, and workflow orchestration
│       ├── schema/       # Zod form schemas
│       ├── services/     # API client, response validation, and data mapping
│       └── types/        # Frontend domain and pagination types
└── src/main/
    ├── java/com/hotel/guestrequest/
    │   ├── controller/   # REST API
    │   ├── service/      # Transactional application logic and specifications
    │   ├── repository/   # Spring Data persistence
    │   ├── entity/       # JPA entities and enumerations
    │   ├── dto/          # Request and response contracts
    │   └── exception/    # Consistent API error handling
    └── resources/
        ├── db/migration/ # Flyway schema and index migrations
        └── application.yaml
```
