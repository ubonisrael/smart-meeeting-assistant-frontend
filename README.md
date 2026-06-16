# Smart Meeting Assistant — Frontend

React + TypeScript SPA. Provides the UI for uploading meeting recordings, viewing transcripts, summaries, and action items, searching across meetings, and managing account settings.

## Stack

- **Framework**: React 18
- **Build tool**: Vite
- **Routing**: React Router v7
- **Server state**: TanStack Query v5
- **Client state**: Zustand
- **UI**: Chakra UI v3 + Tailwind CSS + Lucide icons
- **Forms**: react-hook-form + Zod resolvers
- **HTTP**: Axios (single instance, `withCredentials: true`)

## Project structure

```
src/
├── App.tsx                  # Route definitions
├── main.tsx                 # React root, providers
├── api.ts                   # Typed Axios wrapper for all API calls
├── types.d.ts               # Global TypeScript types (User, Meeting, etc.)
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx    # Authenticated shell: nav, header, SSE listener
│   │   └── ProtectedRoute.tsx
│   ├── meetings/
│   │   ├── MeetingList.tsx
│   │   ├── MeetingDetail.tsx
│   │   ├── TranscriptView.tsx
│   │   ├── SummaryView.tsx
│   │   └── ActionItemsView.tsx
│   ├── settings/
│   │   ├── 2FA.tsx          # Enable/disable two-factor authentication
│   │   ├── manage-2fa.tsx
│   │   ├── qr-code-verify.tsx  # QR scan + TOTP confirmation + backup code display
│   │   ├── password.tsx
│   │   └── profile.tsx
│   └── ui/                  # Shared UI primitives
├── hooks/
│   ├── useAuth.tsx          # Current session access
│   ├── useMeetings.ts       # Meeting queries and mutations
│   ├── useMeetingEvents.ts  # SSE listener — invalidates cache on meeting completion
│   ├── useProfile.ts        # Auth mutations (login, register, 2FA, etc.)
│   └── useFeedbackDialog.ts # Toast/error dialog helper
├── pages/
│   ├── AuthPage.tsx         # Login + register + 2FA challenge
│   ├── MeetingsPage.tsx
│   ├── UploadPage.tsx
│   ├── AskPage.tsx
│   ├── SettingsPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── VerifyEmailPage.tsx
│   └── ResendVerificationPage.tsx
├── providers/
│   └── AuthProvider.tsx
├── store/
│   └── feedback.ts          # Zustand store for toast/dialog state
└── utils/
    ├── error.ts
    └── format.ts
```

## Pages and routes

| Path | Component | Auth required |
|------|-----------|---------------|
| `/login` | `AuthPage` | No |
| `/verify-email` | `VerifyEmailPage` | No |
| `/resend-verification` | `ResendVerificationPage` | No |
| `/forgot-password` | `ForgotPasswordPage` | No |
| `/reset-password` | `ResetPasswordPage` | No |
| `/meetings` | `MeetingsPage` | Yes |
| `/meetings/:meetingId` | `MeetingsPage` | Yes |
| `/upload` | `UploadPage` | Yes |
| `/ask` | `AskPage` | Yes |
| `/settings` | `SettingsPage` | Yes |

All authenticated routes are wrapped in `<ProtectedRoute>` which redirects to `/login` when there is no active session.

## Data fetching

Server state is managed with TanStack Query. Cache keys are defined in `hooks/useMeetings.ts`:

```ts
meetingKeys.lists()           // ["meetings", "list"]
meetingKeys.detail(id)        // ["meetings", "detail", id]
meetingKeys.transcript(id)    // ["meetings", "transcript", id]
meetingKeys.summary(id)       // ["meetings", "summary", id]
meetingKeys.actionItems(id)   // ["meetings", "action-items", id]
```

## Real-time updates

`useMeetingEvents` (mounted in `AppLayout`) opens a persistent SSE connection to `GET /api/meetings/events`. When the backend worker finishes processing a meeting, the server pushes a `meeting-updated` event containing `{ meetingId, status }`. The hook invalidates all affected query keys so the UI refreshes automatically.

## Authentication

Session cookies are sent with every request (`withCredentials: true`). The `useAuth` hook exposes the current `session` and `isAuthenticated` flag, populated by a `GET /api/auth/me` query on app load.

### Two-factor authentication

The login flow supports both TOTP codes (6 digits) and one-time backup codes (`XXXXXX-XXXXXX` format). A "Use a backup code" link on the 2FA challenge screen switches the input field and validation schema. Backup codes are generated and displayed once when 2FA is first enabled.

## Environment variables

Create a `.env` file in this directory (or at the repo root for Docker Compose).

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:4000/api` | Backend API base URL |

## Scripts

```bash
npm run dev        # Start Vite dev server (port 5173, network-accessible)
npm run build      # Type-check + Vite production build → dist/
npm run preview    # Preview production build locally
npm run typecheck  # Type-check without emitting
```
