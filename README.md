# VALORANT Account Tracker

A modern, high-performance web application to search and analyze VALORANT player stats, match history, and weapon skin collections without violating Riot Games Terms of Service.

## Architecture Highlights

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, TanStack Query (React Query).
- **Backend**: Node.js, Express, TypeScript, Zod validation, Helmet security.
- **Cache Layer**: Redis (In-memory caching for third-party API rate limits).
- **Database**: PostgreSQL (User preferences & favorites).

## Quick Start

1. Clone repository:
   ```bash
   git clone [https://github.com/your-org/valorant-account-tracker.git](https://github.com/your-org/valorant-account-tracker.git)
   cd valorant-account-tracker