# AngularChallenge

Angular CLI 17.3.17 application that showcases Rick & Morty characters with a focus on listing, searching, and viewing details, using Angular Material for the UI.

## What the project does

- Displays a responsive grid of character cards with circular avatars, name, species, and status.
- Provides a search field to filter characters by name.
- Shows a loading spinner while data is being fetched.
- Opens a character detail dialog (with edit and delete action styles) when a card is clicked.
- Offers a fixed paginator at the bottom to navigate through pages of results.
- Includes a header with the title “Rick & Morty” and a “New Character” button.

Key UI and structure (based on files present):
- Header: src/app/shared/components/header/header.component.html
- List and search: src/app/features/characters/list/characters-list.component.html and src/app/features/characters/list/characters-list.component.scss
- Detail (dialog styles): src/app/features/characters/detail/character-detail.component.scss
- App bootstrap: src/main.ts
- Index, fonts, and Material Icons: src/index.html

Note: The template uses a store for state (store.loading(), store.filtered(), store.loadPage(...), store.page(), store.totalItems(), store.pageSize). Its implementation is not shown here, but it likely manages loading, pagination, and filtering.

## Technologies

- Angular 17 (Standalone Components)
- Angular Material (Toolbar, Buttons, Form Field, Input, Spinner, Card, Paginator, Dialog)
- Karma + Jasmine for unit tests
- TypeScript, SCSS

## Prerequisites

- Node.js LTS (recommended v18+)
- npm
- Angular CLI (optional if using npx)
  - Global install: npm i -g @angular/cli
  - Or use npx ng <command>

## Installation

1. Install dependencies:
   - npm install

2. If needed, install Angular CLI globally:
   - npm i -g @angular/cli
   - or use npx ng for the commands below.

## Run the project (development)

- Start the dev server:
  - ng serve
  - or npx ng serve
- Open http://localhost:4200/
- The app will reload automatically on file changes.

Relevant files:
- src/main.ts: bootstraps the app with bootstrapApplication(AppComponent, appConfig).
- src/index.html: contains the <app-root></app-root> container, fonts, and icons.

## Unit tests

- Run unit tests:
  - ng test
  - or npx ng test
- Test tools: Karma (runner) per tsconfig.spec.json.

Example test included:
- src/app/app.component.spec.ts
  - Ensures AppComponent is created
  - Checks app.title === 'angular-challenge'
  - Checks that an h1 renders “Hello, angular-challenge”

## Test coverage

- Generate coverage report:
  - ng test --code-coverage --watch=false
  - or npx ng test --code-coverage --watch=false
- After running:
  - Check the coverage/ folder at the project root.
  - Open coverage/<project-name>/index.html in your browser for a detailed report (the <project-name> comes from angular.json).
  - Some setups may also create coverage/index.html directly.


## Structure and highlighted styles

- Character list and search:
  - src/app/features/characters/list/characters-list.component.html: search field, grid of cards (avatar, name, species/status), loading spinner, and fixed paginator.
  - src/app/features/characters/list/characters-list.component.scss: layout, grid, card, avatar, and paginator styles.
- Character detail (dialog styles):
  - src/app/features/characters/detail/character-detail.component.scss: action buttons (edit/delete), animations, and responsive rules.
- Header:
  - src/app/shared/components/header/header.component.html: toolbar with title “Rick & Morty” and “New Character” button.
