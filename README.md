# ScholarPort — Project Summary
## Overview

ScholarPort is a platform for academic researchers to manage their publication portfolio in a simple, centralized way. It lets users add articles (title, authors, abstract, publication date, DOI), link citations to each article, and search/filter publications by title, author, publication year, or DOI, through a modern, responsive web interface.

## The Brief

The original assignment asked for a "Portfolio Manager for Academic Papers" with:

 - Manual entry of articles (title, authors, abstract, publication date, DOI)
 - Ability to add and view citations per article
 - Intuitive navigation via filters and search
 - A React-based front-end (HTML/CSS/JS/React)
 - A scalable Node.js back-end
 - A database (MongoDB or a SQL alternative)
 - REST API with full CRUD for articles and citations
 - Optional user authentication
 - A React SPA, responsive on desktop and mobile
 - At least 5 functional tests per key component
 - Documentation covering setup and implementation choices
 - Delivery as a zip file
 - What Was Built

The implementation covers the brief's core requirements and, on the database and testing/documentation side, goes beyond what was strictly asked:

**Database choice** : MySQL was used instead of MongoDB (the brief explicitly allowed a SQL alternative). A relational schema fits the many-to-many relationships between articles, authors, and citations more naturally, using bridge tables (article_authors, article_citations).

**Full CRUD for articles and citations via a REST API**, including multi-table transactions when creating an article (article + authors + citations are created atomically — all or nothing).

**Duplicate-avoidance logic**: a findOrCreateAuthor function normalizes author names (trim + lowercase comparison) and reuses existing author records instead of creating duplicates. Citations, by contrast, are allowed to repeat across articles by design (not treated as an error).

**Search & filtering**: partial match on title, exact match on DOI, and matching on publication year or author — one filter at a time, deliberately kept simple and consistent with the backend's sequential filter logic.

**Frontend**: a React SPA (Vite, React Router) with a shared ArticleForm component used for both creation and editing (behavior driven by whether initial data is passed in, not by the component itself), and dynamic author/citation fields (array-based inputs with an always-available empty slot for new entries) rather than a single comma-separated text field.
Responsive layout for desktop and mobile use.

**Authentication**: not implemented — it was explicitly optional in the brief.

**Testing**: 25 automated tests total (5 per key component: form, filters, article details/citations panel, article list, and routing), built with Vitest + React Testing Library, satisfying the brief's minimum test coverage requirement exactly.

**Documentation**: beyond basic setup instructions, two dedicated architecture documents were written to explain the reasoning behind structural decisions in both backend and frontend — exceeding the brief's documentation requirement.

## Backend Architecture (Node.js + Express + MySQL)
**Three-layer structure**: routes/ (dispatch URL + HTTP method to a controller function), controllers/ (orchestrate: validate input, call the model, shape the HTTP response), models/ (execute parameterized SQL queries; no knowledge of HTTP).

Connection pooling (mysql2/promise) instead of a single connection, so multiple requests can be handled concurrently without repeatedly opening/closing connections.

Transactions in articleModel.createArticle to keep multi-table writes consistent.

Consistent HTTP status codes: 200 (success), 201 (created), 400 (bad request), 404 (not found), 409 (conflict), 500 (server error).

Security conventions: always parameterized queries (never string concatenation) to prevent SQL injection; .env for secrets, excluded from version control and paired with a .env.example.

Route ordering matters: specific paths (e.g. /search) are declared before generic parameterized ones (e.g. /:id) to avoid Express misinterpreting a path segment as an ID.

## Frontend Architecture (React + Vite)
**Single Page Application**: one index.html, with React mounting into a root <div> via main.jsx.

**Layered structure**: services/ (talk to the backend via fetch, mirroring backend routes one-to-one) → pages/ (orchestrate: call services, hold state, pass data down) → components/ (display only, driven entirely by props, no direct backend awareness) → App.jsx (routing).

One-way dependency rule, mirroring the backend's layering: App → pages → components, pages → services → backend.

Shared form component for create/edit to avoid duplicating logic.

CORS enabled on the backend since frontend (:5173) and backend (:3000) run on different ports during development.

Testing convention: test files live next to the component they test (not in a centralized folder), except for global test setup.

## Tech Stack
**Frontend**: React, Vite, React Router, Vitest, React Testing Library
**Backend**: Node.js, Express, mysql2
**Database**: MySQL

## Setup (high-level)
See README_instruction.md