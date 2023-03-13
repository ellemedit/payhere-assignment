import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";
import styles from "./LinearProgress.module.scss";

export const LinearProgress = forwardRef(LinearProgressImpl);

function LinearProgressImpl(
  { className, ...otherProps }: ComponentPropsWithoutRef<"progress">,
  ref: ForwardedRef<HTMLProgressElement>
) {
  return (
    <progress
      {...otherProps}
      ref={ref}
      className={[styles["pure-material-progress-linear"], className].join(" ")}
    />
  );
}
