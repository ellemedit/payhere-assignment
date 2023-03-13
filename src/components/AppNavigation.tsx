"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  ForwardedRef,
  forwardRef,
  useTransition,
} from "react";
import { createPortal } from "react-dom";

import styles from "./AppNavigation.module.scss";
import { LinearProgress } from "./LinearProgress";

export function AppNavigation() {
  return (
    <nav className={styles["nav"]}>
      <AppNavigationLink href="/">Repository Search</AppNavigationLink>
      <AppNavigationLink href="/issues">Issue Collection</AppNavigationLink>
    </nav>
  );
}

const AppNavigationLink = forwardRef(AppNavigationLinkImpl);

function AppNavigationLinkImpl(
  {
    className,
    href,
    ...otherProps
  }: ComponentPropsWithoutRef<"a"> & { href: string },
  ref: ForwardedRef<ComponentRef<"a">>
) {
  const appPathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <a
        {...otherProps}
        ref={ref}
        href={href}
        onClick={(event) => {
          event.preventDefault();
          startTransition(() => {
            router.push(href);
          });
        }}
        className={[className, styles["nav-link"]].join(" ")}
        aria-current={appPathname === href}
      />
      {isPending &&
        createPortal(
          <LinearProgress
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              width: "100%",
            }}
          />,
          document.body
        )}
    </>
  );
}
