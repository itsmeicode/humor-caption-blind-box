# Caption Blind Box

Caption Blind Box is a caption rating app with a “blind box” reward loop:

- Rate captions (👍 / 👎 + keyboard arrows)
- Unlock rewards every 5 votes (alternates **joke** rewards and **image** rewards)
- Collect unlocked jokes/images and create scored “matches”
- Upload your own image to generate captions, save it to your collection, and keep an upload history

## App routes

- `/` — Sign-in lobby (Google OAuth)
- `/auth/callback` — OAuth callback route
- `/gallery` — **Protected** caption rating experience + rewards
- `/collection` — **Protected** unlocked jokes/images + match creator
- `/upload` — **Protected** upload image → generate captions + upload history

## Walkthrough

1. Go to `/` and click **Enter the Blind Box Arcade** to sign in with Google.
2. On your first visit to `/gallery`, a 3-step onboarding banner explains the loop: **Vote → Unlock → Match**. Dismiss with **Got it** (saved in localStorage). Re-open it anytime via the persistent **?** floating button in the bottom-left corner.
3. Rate captions with:
   - Buttons (👍 / 👎), or
   - Keyboard arrows (**→** upvote, **←** downvote)
4. Below the vote buttons, an explicit countdown shows when the next reward unlocks (e.g. *"3 more votes until your next joke 🎭"*) and turns amber on the final vote (*"1 more vote unlocks a 🎭 joke!"*).
5. Every **5 votes** unlocks a **Blind Box** reward (alternates joke rewards and image rewards). Picking a box saves the reward immediately, then shows a status panel (*"Your collection: X jokes 🎭 · Y images 🖼️"*) with a contextual next-step. When you have at least one of each, a **Go to Collection** button appears alongside **Keep voting**.
6. Go to `/collection` to view your unlocked **jokes** and **images**. With items unlocked but no matches yet, an indigo *"Ready for your first match!"* callout shows the way. Click **Create Match** to combine one joke + one image into a scored card.
7. Go to `/upload` to upload your own image and generate captions. Uploaded images are added to your **Unlocked Images**, and the upload + captions are saved in **Upload History**.

## Core functionality

### Authentication + protection

- Uses Supabase Auth (Google OAuth).
- Routes `/gallery`, `/collection`, and `/upload` redirect to `/` if there is no active session.

### Voting (Supabase mutation)

- Voting inserts into `caption_votes`.
- Insert includes `created_by_user_id` and `modified_by_user_id` (required audit fields).
- Captions are loaded ordered by `like_count ASC NULLS LAST` first, then `created_datetime_utc DESC` as tiebreaker. This data-driven ordering surfaces zero-engagement captions ahead of well-loved ones — motivated by the admin Caption Stats finding that ~89% of captions in the system have never received a vote.

### Onboarding banner + persistent help

- A 3-step "How Caption Blind Box works" banner auto-shows on first visit. Dismissal is persisted in `localStorage` (`onboardingDismissed`), so it does not reappear on subsequent visits.
- A floating **?** button in the bottom-left corner re-opens the banner anytime without resetting the dismissal flag.

### Blind box rewards (no DB changes)

Rewards are stored **locally on the device** in `localStorage`:

- Votes: `blindBoxVoteCount`
- Unlocked jokes: `blindBoxUnlockedJokes`
- Unlocked images: `blindBoxUnlockedImages`
- Matches: `blindBoxMatches`
- Upload history: `blindBoxUploadHistory`

Progress is per-browser/per-device. The sign-in page includes a “Reset local progress” action.

### Upload image → generate captions

The upload pipeline:

1. Generate presigned URL
2. Upload bytes to presigned URL
3. Register image by URL
4. Generate captions

After a successful upload:

- The uploaded image is added to `blindBoxUnlockedImages`
- The upload (image + generated captions) is appended to `blindBoxUploadHistory`

## Getting Started

### Requirements

- Node.js + npm
- Supabase project credentials (public anon key + URL)

### Environment variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Build

```bash
npm run build
```
