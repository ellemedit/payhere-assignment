import { Octokit } from "octokit";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export function searchRepos(query: string) {
  return octokit.rest.search.repos({ q: query, per_page: 40 });
}

export function fetchIssues({
  owner,
  repo,
  page,
  perPage = 40,
}: {
  owner: string;
  repo: string;
  page: number;
  perPage?: number;
}) {
  return octokit.rest.issues.listForRepo({
    owner,
    repo,
    page,
    per_page: perPage,
  });
}
