"use client";

import { useDeferredValue, useState } from "react";

import { GitHubRepoSearchResult } from "~/components/GitHubRepoSearchResult";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";

export default function RootIndexPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(useDebouncedValue(query));
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      <span>{isStale ? "searching ..." : null}</span>
      <GitHubRepoSearchResult query={deferredQuery} />
    </div>
  );
}
