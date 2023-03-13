import { use } from "react";

import { searchRepos } from "~/core/octokit";

export function GitHubRepoSearchResult({ query }: { query: string }) {
  if (!query) {
    return <p>Search any GitHub repositories</p>;
  }

  if (query.length < 3) {
    return <p>At least 4 letters required to search</p>;
  }

  const results = use(searchRepos(query));

  return (
    <div>
      {results.data.items.map((repo) => {
        return (
          <div key={repo.id}>
            <h3>{repo.full_name}</h3>
            <p>{repo.description}</p>
          </div>
        );
      })}
    </div>
  );
}
