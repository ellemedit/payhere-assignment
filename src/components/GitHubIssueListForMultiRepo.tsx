import { use } from "react";
import { fetchIssuesForMultiRepos } from "~/core/octokit";

export function GitHubIssueListForMultiRepo({
  candidates,
}: {
  candidates: { owner: string; repo: string }[];
}) {
  const issues = use(fetchIssuesForMultiRepos({ candidates, perPage: 40 }));

  return (
    <div>
      {issues.map((issue) => {
        return (
          <div key={issue.id}>
            <div>{/* {issue} */}</div>
            <h3>{issue.title}</h3>
            <p></p>
          </div>
        );
      })}
    </div>
  );
}
