import { Inter, Noto_Sans_KR } from "next/font/google";

import { AppNavigation } from "~/components/AppNavigation";
import { LikedRepoStoreProvider } from "~/core/store";

import "./globals.css";
import styles from "./layout.module.scss";

export const metadata = {
  title: "Payhere Assignment",
  description: "Payhere Assignment Application",
};

const inter = Inter({ subsets: ["latin"] });
const notoSansKr = Noto_Sans_KR({ subsets: [], weight: ["400"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={[inter.className, notoSansKr.className].join(" ")}>
        <div className={styles.container}>
          <AppNavigation />
          <LikedRepoStoreProvider>{children}</LikedRepoStoreProvider>
        </div>
      </body>
    </html>
  );
}
