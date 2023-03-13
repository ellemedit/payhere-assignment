"use client";

import { use, useEffect, useState, useTransition } from "react";
import { MdStar, MdStarOutline } from "react-icons/md";
import { searchRepos } from "~/core/octokit";
import { useCanLikeMore, useLikeActions, useLikedRepos } from "~/core/store";

import styles from "./GitHubRepoSearchResult.module.scss";
import { LinearProgress } from "./LinearProgress";

export function GitHubRepoSearchResult({ query }: { query: string }) {
  const [page, setPage] = useState(1);
  const [loadingMore, startLoadMore] = useTransition();
  const [cache, setCache] = useState(
    () => new Map<number, ReturnType<typeof searchRepos>>()
  );
  const likedRepos = useLikedRepos();
  const canLikeMore = useCanLikeMore();
  const actions = useLikeActions();

  useEffect(() => {
    setPage(1);
    setCache(new Map());
  }, [query]);

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
        const isLiked = likedRepos.has(repo.full_name);
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
                <button
                  className={styles["repo-action"]}
                  aria-pressed={isLiked}
                  onClick={() => {
                    if (isLiked) {
                      actions.unlikeRepo(repo.owner!.login, repo.name);
                      return;
                    }
                    if (!canLikeMore) {
                      alert("최대 4개까지만 좋아요할 수 있습니다.");
                      return;
                    }
                    actions.likeRepo(repo.owner!.login, repo.name);
                  }}
                >
                  {isLiked ? <MdStar /> : <MdStarOutline />}
                </button>
              </div>
              <p className={styles["repo-description"]}>{repo.description}</p>
              <div className={styles["repo-secondary"]}>
                <span>
                  {repo.stargazers_count.toLocaleString("en-US")} Stars
                </span>
                <span>
                  {new Date(repo.created_at).toLocaleDateString("en-US")}
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
