import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  useTransition,
} from "react";
import { LinearProgress } from "./LinearProgress";

import styles from "./BusyButton.module.scss";

export const BusyButton = forwardRef(BusyButtonImpl);

function BusyButtonImpl(
  {
    onClick,
    className,
    disabled,
    children,
    ...otherProps
  }: ComponentPropsWithoutRef<"button">,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      {...otherProps}
      ref={ref}
      onClick={(event) => {
        startTransition(() => {
          onClick?.(event);
        });
      }}
      disabled={disabled || isPending}
      className={styles["button"]}
    >
      {children}
      {isPending && <LinearProgress className={styles["button-indicator"]} />}
    </button>
  );
}
