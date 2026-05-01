import { useState } from 'react';

export type RewardType = 'joke' | 'image';

export type JokeReward = {
  type: 'joke';
  captionId: string;
  content: string;
};

export type ImageReward = {
  type: 'image';
  imageId: string;
  url: string;
};

export type RewardOption = JokeReward | ImageReward;

const BOX_LABELS = ['Pick me!', 'Pick me!', 'Pick me!', 'Pick me!'] as const;

type BlindBoxRewardProps = {
  rewardType: RewardType;
  options: RewardOption[];
  unlockedJokesCount: number;
  unlockedImagesCount: number;
  onPick: (picked: RewardOption) => void;
  onContinue: () => void;
  onGoToCollection: (picked: RewardOption) => void;
};

export function BlindBoxReward({
  rewardType,
  options,
  unlockedJokesCount,
  unlockedImagesCount,
  onPick,
  onContinue,
  onGoToCollection,
}: BlindBoxRewardProps) {
  const [picked, setPicked] = useState<number | null>(null);

  const reveal = picked === null ? null : options[picked] ?? null;

  const projectedJokes =
    unlockedJokesCount + (reveal?.type === 'joke' ? 1 : 0);
  const projectedImages =
    unlockedImagesCount + (reveal?.type === 'image' ? 1 : 0);
  const canMatchAfterSave = projectedJokes > 0 && projectedImages > 0;
  const missingType: 'joke' | 'image' | null =
    projectedJokes === 0
      ? 'joke'
      : projectedImages === 0
        ? 'image'
        : null;

  return (
    <div className="flex w-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <h2 className="mb-1 text-xl font-semibold text-gray-900">
        Blind Box Unlocked!
      </h2>
      <p className="mb-6 text-center text-sm text-gray-600">
        Pick a blind box to reveal your {rewardType === 'joke' ? 'joke' : 'image'}.
      </p>

      {picked === null ? (
        <div className="grid w-full grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => {
            const disabled = !options[i];
            return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => {
                const opt = options[i];
                if (opt) {
                  onPick(opt);
                  setPicked(i);
                }
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-10 text-sm font-medium text-gray-900 transition-all hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {BOX_LABELS[i] ?? 'Blind Box'}
            </button>
          )})}
        </div>
      ) : (
        <div className="w-full">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-base font-semibold text-gray-900">Your Reward</p>
            {reveal?.type === 'joke' ? (
              <p className="mt-2 text-sm text-gray-800">{reveal.content}</p>
            ) : reveal?.type === 'image' ? (
              <img
                src={reveal.url}
                alt="Reward"
                className="mt-3 max-h-[60vh] w-full rounded-xl bg-gray-50 object-contain"
              />
            ) : (
              <p className="mt-2 text-sm text-red-700">Missing reward option.</p>
            )}
          </div>
          <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm">
            <p className="font-semibold text-indigo-950">
              Your collection: {projectedJokes}{' '}
              {projectedJokes === 1 ? 'joke' : 'jokes'} 🎭 ·{' '}
              {projectedImages}{' '}
              {projectedImages === 1 ? 'image' : 'images'} 🖼️
            </p>
            <p className="mt-1 text-indigo-900">
              {canMatchAfterSave
                ? 'You have at least one joke and one image — pair them in My Collection to score!'
                : missingType === 'joke'
                  ? 'Keep voting to unlock a joke to pair with this image.'
                  : 'Keep voting to unlock an image to pair with this joke.'}
            </p>
          </div>
          <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onContinue}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Keep voting
            </button>
            {canMatchAfterSave && (
              <button
                type="button"
                onClick={() => {
                  const selected = reveal;
                  if (selected) onGoToCollection(selected);
                }}
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Go to Collection
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

