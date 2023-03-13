"use client";

import { use, useCallback, useRef, useState, useTransition } from "react";

export function usePagination<T extends (page: number) => Promise<any>>(
  fetcher: T
) {
  const [page, setPage] = useState(1);
  const [loadingMore, startLoadMore] = useTransition();
  const cacheRef = useRef<Map<number, ReturnType<T>>>();
  if (!cacheRef.current) {
    cacheRef.current = new Map();
  }
  const cache = cacheRef.current as any as Map<any, any>;

  const reset = useCallback(() => {
    cacheRef.current = new Map();
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    startLoadMore(() => {
      setPage((page) => page + 1);
    });
  }, []);

  function getData(): Awaited<ReturnType<T>>[] {
    return Array(page)
      .fill(null)
      .map((_, index) => index + 1)
      .map((page) => {
        if (!cache.has(page)) {
          cache.set(page, fetcher(page) as any);
        }
        return use(cache.get(page)!);
      });
  }

  return {
    loadingMore,
    loadMore,
    reset,
    getData,
  };
}
