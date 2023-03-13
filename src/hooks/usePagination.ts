"use client";

import { use, useCallback, useState, useTransition } from "react";

export function usePagination<T extends (page: number) => Promise<any>>(
  fetcher: T
) {
  const [page, setPage] = useState(1);
  const [loadingMore, startLoadMore] = useTransition();
  const [cache, setCache] = useState(() => new Map<number, ReturnType<T>>());

  const reset = useCallback(() => {
    setCache(new Map());
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    startLoadMore(() => {
      setPage((page) => page + 1);
    });
  }, []);

  const data = Array(page)
    .fill(null)
    .map((_, index) => index + 1)
    .map((page) => {
      if (!cache.has(page)) {
        cache.set(page, fetcher(page) as any);
      }
      // use는 rule of hook 조건을 만족할 필요가 없는 유일한 훅입니다. 괜찮은 코드에요!
      return use(cache.get(page)!);
    })
    .flatMap((x) => x);

  return {
    loadingMore,
    loadMore,
    reset,
    data,
  };
}
