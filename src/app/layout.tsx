import { Inter, Noto_Sans_KR } from "next/font/google";

import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
