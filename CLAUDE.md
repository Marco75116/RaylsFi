# RaylsFi

Web3 card dashboard app inspired by ether.fi Cash. Users manage crypto assets, virtual/physical cards, and transactions.

## Design Philosophy

PROFESSIONAL. CLEAN. MODERN.

- Light mode only
- Focus on data clarity and usability
- Modern card-based UI
- Performance-first approach

## Tech Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **Language**: TypeScript 5
- **UI**: shadcn/ui (New York style, zinc base color) + Radix UI + Tailwind CSS 4
- **State**: Zustand
- **Auth**: Better Auth (GitHub, Google, Resend magic link) + Drizzle adapter
- **Database**: PostgreSQL via Drizzle ORM
- **Deployment**: Vercel

## Package Manager

Use **Bun** only. Never use npm or yarn.

```bash
bun run dev        # Start dev server
bun run build      # next build
bun run lint       # ESLint
bun run db:generate # drizzle-kit generate
bun run db:migrate  # drizzle-kit migrate
bun run db:push     # drizzle-kit push
bun run db:studio   # Drizzle Studio
bun run db:up       # Start PostgreSQL Docker container
bun run db:start    # Start DB + push schema
```

## Branch & Commit Convention

- Branch format: `type/brief-description` (e.g. `feat/add-login-page`, `fix/header-overflow`)
- Commit format: `type: brief description`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## Import Paths

Always use `@/` alias. Never use relative paths like `../../`.

## File Organization

```
src/
├── app/                            # Next.js App Router pages
│   ├── (auth)/sign-in/             # Sign-in page
│   ├── (dashboard)/                # Protected dashboard pages
│   ├── api/                        # API routes (Better Auth)
│   ├── page.tsx                    # Landing page
│   └── layout.tsx                  # Root layout
├── components/
│   ├── ui/                         # shadcn/ui base components
│   ├── admin-panel/                # Sidebar, Navbar, ContentLayout
│   ├── dashboard/                  # Dashboard-specific components
│   └── sign-in-buttons/            # Auth button components
├── db/
│   ├── index.ts                    # Drizzle client setup
│   └── schema.ts                   # Drizzle schema (BetterAuth tables)
├── lib/
│   ├── auth.ts                     # Better Auth server config
│   ├── auth-client.ts              # Better Auth client config
│   ├── utils.ts                    # Utility functions (cn)
│   ├── menu-list.ts                # Sidebar navigation config
│   ├── mock-data.ts                # Mock data for dashboard
│   └── types/                      # TypeScript type definitions
└── providers/                      # Theme provider
```

## File Naming

- Components: PascalCase (`Button.tsx`)
- Utilities: camelCase (`formatters.ts`)
- Types: PascalCase (`Pool.ts`)
- UI components (shadcn): kebab-case (`dropdown-menu.tsx`)

## UI Components

Use shadcn/ui for all UI components. Add new ones with `bunx shadcn@latest add <component>`.

- Use CVA (class-variance-authority) for variants
- Use `cn()` from `@/lib/utils` for class merging
- Server Components by default, `"use client"` only when needed

## Styling

- Tailwind utility classes only (no inline styles, no new CSS files)
- Use CSS variables from `globals.css` for colors
- Light mode only

## Code Quality

- No `any` type — use `unknown` or proper types
- No `console.log` in production code
- Prefer `const` over `let`
- No comments — code should be self-explanatory
- Factorize into smaller components/functions
- Prefer explicit props typing over `React.FC`

## Environment Variables

Required:

- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — Better Auth secret
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` — GitHub OAuth
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth
- `AUTH_RESEND_KEY` — Resend API key for magic link emails
- `NEXT_PUBLIC_APP_URL` — Public app URL

## Database

PostgreSQL with Drizzle ORM. Tables: `user`, `session`, `account`, `verification` (Better Auth core tables).

Start the database: `bun run db:start` (requires Docker).

## Dependencies

Ask before installing new dependencies.
