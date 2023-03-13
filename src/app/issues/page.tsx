import { GitHubIssueListForMultiRepo } from "~/components/GitHubIssueListForMultiRepo";

export default function IssueListPage() {
  return (
    <div>
      <GitHubIssueListForMultiRepo candidates={[]} />
    </div>
  );
}
