import { Octokit } from "octokit";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export const octokit = new Octokit({ auth: GITHUB_TOKEN });
