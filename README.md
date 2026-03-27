# Caption Blind Box

Caption Blind Box is a caption rating app with a “blind box” reward loop:

- Rate captions (👍 / 👎 + keyboard arrows)
- Unlock rewards every 5 votes (alternates **joke** rewards and **image** rewards)
- Collect unlocked jokes/images and create scored “matches”
- Upload your own image to generate captions, save it to your collection, and keep an upload history

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

## App routes

- `/` — Sign-in lobby (Google OAuth)
- `/auth/callback` — OAuth callback route
- `/gallery` — **Protected** caption rating experience + rewards
- `/collection` — **Protected** unlocked jokes/images + match creator
- `/upload` — **Protected** upload image → generate captions + upload history

## Walkthrough

1. Go to `/` and click **Enter the Blind Box Arcade** to sign in with Google.
2. You’ll land in `/gallery`. Rate captions with:
   - Buttons (👍 / 👎), or
   - Keyboard arrows (**→** upvote, **←** downvote)
3. Every **5 votes** unlocks a **Blind Box** reward (alternates joke rewards and image rewards).
4. Go to `/collection` to view your unlocked **jokes** and **images**, then click **Create Match** to combine one joke + one image into a scored card.
5. Go to `/upload` to upload your own image and generate captions. Uploaded images are added to your **Unlocked Images**, and the upload + captions are saved in **Upload History**.

## Core functionality

### Authentication + protection

- Uses Supabase Auth (Google OAuth).
- Routes `/gallery`, `/collection`, and `/upload` redirect to `/` if there is no active session.

### Voting (Supabase mutation)

- Voting inserts into `caption_votes`.
- Insert includes `created_by_user_id` and `modified_by_user_id` (required audit fields).

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

## Deployment notes (Vercel)

- Add the same env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in your Vercel project.
- Ensure the site is **publicly accessible** (disable deployment protection) to avoid rubric penalties.

## Credits

Built with Next.js + Supabase.
