"use client";

import constate from "constate";
import { startTransition, useEffect, useMemo, useState } from "react";

const STORE_KEY = "store_never_lose_uniqueness";

function persistState(state: any) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function useRepoLikeStore() {
  const [likedRepos, setLikedRepos] = useState(() => {
    return new Map<string, { owner: string; name: string }>();
  });

  const canLikeMore = likedRepos.size < 4;

  const actions = useMemo(() => {
    const likeRepo = (owner: string, name: string) => {
      setLikedRepos((prev) => {
        if (prev.size >= 4) {
          return prev;
        }
        const nextState = [
          ...prev.entries(),
          [`${owner}/${name}`, { owner, name }],
        ] as const;
        persistState(nextState);
        return new Map(nextState);
      });
    };

    const unlikeRepo = (owner: string, name: string) => {
      setLikedRepos((prev) => {
        const nextState = [...prev.entries()].filter(
          ([fullname]) => fullname !== `${owner}/${name}`
        );
        persistState(nextState);
        return new Map(nextState);
      });
    };

    return { likeRepo, unlikeRepo };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORE_KEY);
    if (stored == null) {
      return;
    }
    try {
      const restored = JSON.parse(stored);
      startTransition(() => {
        setLikedRepos(new Map(restored));
      });
    } catch (error) {
      localStorage.removeItem(STORE_KEY);
    }
  }, []);

  return {
    likedRepos,
    actions,
    canLikeMore,
  };
}

export const [
  LikedRepoStoreProvider,
  useLikedRepos,
  useLikeActions,
  useCanLikeMore,
] = constate(
  useRepoLikeStore,
  ({ likedRepos }) => likedRepos,
  ({ actions }) => actions,
  ({ canLikeMore }) => canLikeMore
);
