# Tarot Web UI

Beautiful web interface for tarot readings powered by AI interpretations. Built with Next.js 16, TypeScript, Tailwind CSS 4, and TanStack Query 5.

## Features

- **Interactive Reading Flow**: Choose layouts, provide optional questions, and view beautifully formatted interpretations
- **Contextual Readings**: Ask questions to receive interpretations tailored to your situation
- **Follow-up Conversations**: Engage in unlimited follow-up questions about your reading
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Real-time Updates**: Loading states and smooth transitions throughout
- **Conversation History**: View all your follow-up Q&A in one place

## Prerequisites

- Node.js 20+
- Running Tarot Reading System backend services (see [tarot-reading-system](https://github.com/Winterborne/tarot-reading-system))

## Installation

```bash
npm install
```

## Configuration

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

The default configuration connects to local backend services:
- Reading Service: `http://localhost:3002`
- Layout Service: `http://localhost:3003`
- Interpretation Service: `http://localhost:3004`

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 16.1.4 with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI (Dialog, Label, Select) + Lucide React icons
- **State Management**: TanStack Query 5.90.19 (React Query)
- **HTTP Client**: Native fetch API

## Project Structure

```
app/
  page.tsx              # Home page with layout selection
  reading/
    [id]/
      page.tsx          # Reading page with cards & interpretation
  layout.tsx            # Root layout with providers
lib/
  api-client.ts         # Backend API client
  providers.tsx         # TanStack Query provider
components/             # Reusable UI components (future)
```

## User Flow

1. **Home Page**: User selects a layout and optionally provides a question
2. **Drawing Cards**: System creates reading, selects layout, and draws cards
3. **Reading Page**: Display drawn cards with positions
4. **Interpretation**: AI-generated interpretation appears (30-60 seconds for larger spreads)
5. **Follow-up Questions**: User can ask unlimited follow-up questions about their reading
6. **Conversation History**: All Q&A pairs are displayed in chronological order

## Architecture

This web client is a thin orchestrator that calls backend microservices. It contains no business logic - all reading creation, interpretation generation, and conversation management happens in the backend services.

The UI uses TanStack Query for:
- Automatic request deduplication
- Background refetching
- Cache management
- Loading and error states

See [ARCHITECTURE.md](https://github.com/Winterborne/tarot-reading-system/blob/main/docs/architecture.md) in the main repository for more details.

## License

MIT
