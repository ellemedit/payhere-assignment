"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  ForwardedRef,
  forwardRef,
} from "react";

import styles from "./AppNavigation.module.scss";

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
  { className, href, ...otherProps }: ComponentPropsWithoutRef<typeof Link>,
  ref: ForwardedRef<ComponentRef<typeof Link>>
) {
  const appPathname = usePathname();
  const pathname = typeof href === "string" ? href : href.pathname!;

  return (
    <Link
      {...otherProps}
      ref={ref}
      href={href}
      className={[className, styles["nav-link"]].join(" ")}
      aria-current={appPathname === pathname}
    />
  );
}
