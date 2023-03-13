import { use } from "react";

import { searchRepos } from "~/core/octokit";
import styles from "./GitHubRepoSearchResult.module.scss";

export function GitHubRepoSearchResult({ query }: { query: string }) {
  if (!query) {
    return <p>Search any GitHub repositories</p>;
  }

  if (query.length < 3) {
    return <p>At least 4 letters required to search</p>;
  }

  const results = use(searchRepos(query));

  return (
    <div className={styles["repo-list"]}>
      {results.data.items.map((repo) => {
        return (
          <div key={repo.id} className={styles["repo"]}>
            <img
              src={repo.owner?.avatar_url}
              className={styles["repo-avatar"]}
            />
            <div className={styles["repo-primary"]}>
              <div className={styles["repo-header-group"]}>
                <button className={styles["repo-action"]}>Like</button>
                <h3 className={styles["repo-name"]}>
                  {repo.owner?.login} / {repo.name}
                </h3>
              </div>
              <p className={styles["repo-description"]}>{repo.description}</p>
              <div className={styles["repo-secondary"]}>
                <span>
                  {repo.stargazers_count.toLocaleString("ko-KR")} Stars
                </span>
                <span>
                  {new Date(repo.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
