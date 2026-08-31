import "./globals.css";

export const metadata = {
  title: "BS Computer Science Official Result & Marksheet Portal",
  description: "Semester Result, GPA/CGPA calculations, transcript printing, and batch analytics for BS Computer Science students.",
  keywords: ["BSCS", "Result Checker", "GPA Calculator", "Transcript", "Marksheet", "Computer Science"],
  authors: [{ name: "Department of Computer Science" }],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Outfit:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
