"use client";

import { use, useMemo, useState, useTransition } from "react";
import { MdStar, MdStarOutline } from "react-icons/md";
import { searchRepos } from "~/core/octokit";

import styles from "./GitHubRepoSearchResult.module.scss";
import { LinearProgress } from "./LinearProgress";

export function GitHubRepoSearchResult({ query }: { query: string }) {
  const [page, setPage] = useState(1);
  const [prevQuery, setPrevQuery] = useState(query);
  const [loadingMore, startLoadMore] = useTransition();
  const cache = useMemo(() => {
    return new Map<number, ReturnType<typeof searchRepos>>();
  }, [query]);

  if (prevQuery !== query) {
    setPage(1);
    setPrevQuery(query);
    cache.clear();
  }

  if (!query) {
    return <p>Search any GitHub repositories</p>;
  }

  if (query.length < 3) {
    return <p>At least 4 letters required to search</p>;
  }

  const repos = Array(page)
    .fill(null)
    .map((_, index) => index + 1)
    .map((page) => {
      if (!cache.has(page)) {
        cache.set(page, searchRepos({ query, page }));
      }
      // use는 rule of hook 조건을 만족할 필요가 없는 유일한 훅입니다. 괜찮은 코드에요!
      return use(cache.get(page)!);
    })
    .flatMap((x) => x.data.items);

  return (
    <div className={styles["repo-list"]}>
      {repos.map((repo) => {
        return (
          <div key={repo.id} className={styles["repo"]}>
            <img
              src={repo.owner?.avatar_url}
              className={styles["repo-avatar"]}
            />
            <div className={styles["repo-primary"]}>
              <div className={styles["repo-header-group"]}>
                <h3 className={styles["repo-name"]}>
                  {repo.owner?.login} / {repo.name}
                </h3>
                <button className={styles["repo-action"]} aria-pressed={false}>
                  <MdStarOutline />
                </button>
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
      <button
        onClick={() => {
          startLoadMore(() => {
            setPage((page) => page + 1);
          });
        }}
        disabled={loadingMore}
        className={styles["load-more"]}
      >
        load more
        {loadingMore && (
          <LinearProgress className={styles["load-more-indicator"]} />
        )}
      </button>
    </div>
  );
}
