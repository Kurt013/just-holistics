# Just Holistics — Community Protocol Platform

A full-stack community platform for posting and discussing wellness protocols.

## Demo
https://github.com/user-attachments/assets/f39eca43-ba36-4411-b05e-8451f09fc596

## Tech Stack
- **Backend**: Laravel 11, MySQL, Typesense
- **Frontend**: Next.js 14, TailwindCSS, Typesense InstantSearch

## Setup

### Backend
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/protocols | List protocols (filter, sort, paginate) |
| POST | /api/protocols | Create a protocol |
| GET | /api/protocols/{id} | Get protocol detail |
| GET | /api/protocols/{id}/threads | List threads for a protocol |
| POST | /api/protocols/{id}/threads | Create a thread |
| POST | /api/protocols/{id}/reviews | Submit a review |
| GET | /api/threads/{id} | Get thread detail |
| GET | /api/threads/{id}/comments | Get comments |
| POST | /api/threads/{id}/comments | Post a comment |
| POST | /api/comments/{id}/replies | Reply to a comment |
| POST | /api/threads/{id}/vote | Vote on a thread |
| POST | /api/comments/{id}/vote | Vote on a comment |
| GET | /api/search/protocols?q= | Search protocols |
| GET | /api/search/threads?q= | Search threads |

## Sort Options
- `most_recent` — newest first
- `most_reviewed` — by review count
- `highest_rated` — by average rating
- `most_upvoted` — by vote count

## Typesense Reindex
```bash
php artisan typesense:reindex
```
