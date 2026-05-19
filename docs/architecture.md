# DayForge Architecture

## Overview

DayForge is an open-source Telegram-based personal operating system focused on:

- Daily planning
- Daily review
- Finance tracking
- Study tracking
- Gym tracking
- Long-term behavioral analytics

The system is designed around low-friction structured input using conversational workflows.

---

# High-Level Architecture

```text
Telegram User
    ↓
Telegram Bot API
    ↓
DayForge Bot Service (grammY)
    ↓
Conversation Layer
    ↓
Persistence Layer (Prisma)
    ↓
PostgreSQL
```

---

# Repository Structure

```text
dayforge/
├── apps/
│   ├── api/
│   ├── bot/
│   └── dashboard/
│
├── packages/
│   ├── analytics/
│   ├── db/
│   └── shared/
│
├── infra/
│
└── docs/
```

---

# Current Services

## Bot Service

Responsibilities:

- Telegram command handling
- Conversational workflows
- User interaction
- Daily prompts
- Review collection

Technology:

- Node.js
- TypeScript
- grammY

---

# Planned Services

## API Service

Will provide:

- Analytics endpoints
- Dashboard integration
- Aggregated reporting
- Export functionality

## Dashboard

Future web dashboard for:

- Trend visualization
- Habit analytics
- Financial summaries
- Behavioral insights

---

# Persistence Layer

Planned stack:

- PostgreSQL
- Prisma ORM

Core entities:

- User
- DailyPlan
- DailyReview
- FinanceEntry
- StudyEntry
- GymEntry

---

# Design Principles

- Low friction input
- Structured data over free-form journaling
- Telegram-first UX
- Modular architecture
- OSS-friendly codebase
- Long-term analytics capability