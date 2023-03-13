"use client";

import { useDeferredValue, useRef, useState } from "react";
import { MdSearch } from "react-icons/md";

import { GitHubRepoSearchResult } from "~/components/GitHubRepoSearchResult";
import { LinearProgress } from "~/components/LinearProgress";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";

import styles from "./page.module.scss";

export default function RootIndexPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const deferredQuery = useDeferredValue(debouncedQuery);
  const isSearching = query === debouncedQuery && query !== deferredQuery;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div
        className={styles["search-input-group"]}
        onFocus={() => inputRef.current?.focus()}
        tabIndex={-1}
      >
        <MdSearch />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          autoFocus
        />
        {isSearching && (
          <LinearProgress className={styles["search-input-progress"]} />
        )}
      </div>
      <GitHubRepoSearchResult query={deferredQuery} />
    </div>
  );
}
