"use client";

import { useEffect } from "react";
import { MdStar, MdStarOutline } from "react-icons/md";
import { searchRepos } from "~/core/octokit";
import { useCanLikeMore, useLikeActions, useLikedRepos } from "~/core/store";
import { usePagination } from "~/hooks/usePagination";
import { BusyButton } from "./BusyButton";

import styles from "./GitHubRepoSearchResult.module.scss";

export function GitHubRepoSearchResult({ query }: { query: string }) {
  const { reset, loadMore, getData } = usePagination((page) =>
    searchRepos({ query, page })
  );

  useEffect(() => {
    reset();
  }, [query, reset]);

  if (!query) {
    return <p>Search any GitHub repositories</p>;
  }

  if (query.length < 3) {
    return <p>At least 4 letters required to search</p>;
  }

  const repos = getData().flatMap((x) => x.data.items);

  return (
    <div className={styles["repo-list"]}>
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
      <BusyButton onClick={() => loadMore()}>load more</BusyButton>
    </div>
  );
}

function RepoCard({
  repo,
}: {
  repo: Awaited<ReturnType<typeof searchRepos>>["data"]["items"][number];
}) {
  const likedRepos = useLikedRepos();
  const canLikeMore = useCanLikeMore();
  const actions = useLikeActions();
  const isLiked = likedRepos.has(repo.full_name);

  return (
    <div className={styles["repo"]}>
      <img src={repo.owner?.avatar_url} className={styles["repo-avatar"]} />
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
          <span>{repo.stargazers_count.toLocaleString("en-US")} Stars</span>
          <span>{new Date(repo.created_at).toLocaleDateString("en-US")}</span>
        </div>
      </div>
    </div>
  );
}
