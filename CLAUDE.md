# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 marketing website for "Nano Banana", an AI image editing tool. It's a single-page application with a landing page showcasing features, examples, reviews, and FAQ sections.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **React**: Version 19.2.0
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: lucide-react
- **Analytics**: Vercel Analytics

### Project Structure

```
app/
  layout.tsx       # Root layout with metadata and Analytics
  page.tsx         # Main landing page (client component)
  globals.css      # Tailwind config and CSS variables

components/
  ui/              # shadcn/ui components (accordion, button, card, etc.)
  theme-provider.tsx

lib/
  utils.ts         # cn() utility for className merging

hooks/
  use-mobile.ts
  use-toast.ts
```

### Key Patterns

**Path Aliases** (defined in components.json):
- `@/components` → components/
- `@/lib` → lib/
- `@/ui` → components/ui/
- `@/hooks` → hooks/

**Styling System**:
- Uses Tailwind CSS v4 with `@theme inline` directive
- Custom CSS variables for colors (including `--banana` brand color)
- shadcn/ui "new-york" style variant
- Dark mode support via CSS variables

**Component Architecture**:
- Main page is a client component (`"use client"`)
- Uses shadcn/ui components (Button, Card, Accordion)
- All UI components are in `components/ui/`
- Utility function `cn()` for conditional className merging

### Configuration Notes

- TypeScript build errors are ignored (`ignoreBuildErrors: true`)
- Next.js images are unoptimized (`unoptimized: true`)
- Uses Geist and Geist Mono fonts from next/font/google
- Vercel Analytics integrated in root layout

### Adding New Components

Use shadcn/ui CLI to add components:
```bash
npx shadcn@latest add [component-name]
```

Components are configured to use:
- Style: "new-york"
- RSC: true
- TypeScript: true
- CSS variables: true
