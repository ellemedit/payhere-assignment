"use client";

import { useEffect } from "react";
import { fetchIssuesForMultiRepos } from "~/core/octokit";

import { LinearProgress } from "./LinearProgress";
import styles from "./GitHubIssueListForMultiRepo.module.scss";
import { usePagination } from "~/hooks/usePagination";

export function GitHubIssueListForMultiRepo({
  candidates,
}: {
  candidates: { owner: string; name: string }[];
}) {
  const candidateCacheKey = [
    ...candidates.map(({ owner, name }) => [owner, name].join("/")),
  ]
    .sort()
    .join("-");

  const {
    reset,
    loadMore,
    loadingMore,
    data: issues,
  } = usePagination((page) => {
    return fetchIssuesForMultiRepos({ candidates, page });
  });

  useEffect(() => {
    reset();
  }, [candidateCacheKey, reset]);

  return (
    <div className={styles["issue-list"]}>
      {issues.map((issue) => {
        return (
          <div key={issue.id} className={styles["issue"]}>
            <div className={styles["issue-repo"]}>
              {issue.owner} / {issue.repo}
            </div>
            <h3 className={styles["issue-title"]}>
              <a href={issue.html_url} target="_blank">
                {issue.title}
              </a>
            </h3>
            <span className={styles["issue-minor"]}>
              {issue.user?.login}, {issue.comments} comments,{" "}
              {new Date(issue.created_at).toLocaleString("en-US")}
            </span>
          </div>
        );
      })}
      <button
        onClick={() => {
          loadMore();
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
