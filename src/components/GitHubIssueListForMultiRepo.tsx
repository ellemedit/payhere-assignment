import { use, useEffect, useState, useTransition } from "react";
import { fetchIssuesForMultiRepos } from "~/core/octokit";
import styles from "./GitHubIssueListForMultiRepo.module.scss";
import { LinearProgress } from "./LinearProgress";

export function GitHubIssueListForMultiRepo({
  candidates,
}: {
  candidates: { owner: string; repo: string }[];
}) {
  const candidateCacheKey = [
    ...candidates.map(({ owner, repo }) => [owner, repo].join("/")),
  ]
    .sort()
    .join("-");
  const [page, setPage] = useState(1);
  const [loadingMore, startLoadMore] = useTransition();
  const [cache, setCache] = useState(
    () => new Map<number, ReturnType<typeof fetchIssuesForMultiRepos>>()
  );

  useEffect(() => {
    setCache(new Map());
    setPage(1);
  }, [candidateCacheKey]);

  const issues = Array(page)
    .fill(null)
    .map((_, index) => index + 1)
    .map((page) => {
      if (!cache.has(page)) {
        cache.set(page, fetchIssuesForMultiRepos({ candidates, page }));
      }
      // use는 rule of hook 조건을 만족할 필요가 없는 유일한 훅입니다. 괜찮은 코드에요!
      return use(cache.get(page)!);
    })
    .flatMap((x) => x);

  return (
    <div>
      {issues.map((issue) => {
        return (
          <div key={issue.id} className={styles["issue"]}>
            <div className={styles["issue-repo"]}>{/* {issue} */}</div>
            <h3 className={styles["issue-title"]}>{issue.title}</h3>
            <span>
              {issue.user?.login} /{" "}
              {new Date(issue.created_at).toLocaleString("ko-KR")}
            </span>
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
