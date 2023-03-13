"use client";

import { useTransition } from "react";
import { MdCancel } from "react-icons/md";
import { GitHubIssueListForMultiRepo } from "~/components/GitHubIssueListForMultiRepo";
import { LinearProgress } from "~/components/LinearProgress";
import { useLikeActions, useLikedRepos } from "~/core/store";

import styles from "./page.module.scss";

export default function IssueListPage() {
  const likedRepos = [...useLikedRepos().entries()];
  const actions = useLikeActions();
  const [isPending, startTransition] = useTransition();

  return (
    <div className={styles["page"]}>
      <div className={styles["chips"]}>
        {likedRepos.map(([fullname, { owner, name }]) => {
          return (
            <div key={fullname} className={styles["chip"]}>
              {owner}/{name}
              <button
                onClick={() => {
                  startTransition(() => {
                    actions.unlikeRepo(owner, name);
                  });
                }}
              >
                <MdCancel />
              </button>
            </div>
          );
        })}
      </div>
      {likedRepos.length > 0 && (
        <GitHubIssueListForMultiRepo
          candidates={likedRepos.map(([_, x]) => x)}
        />
      )}
      {isPending && (
        <LinearProgress
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: 3,
          }}
        />
      )}
    </div>
  );
}
