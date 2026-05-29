import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JobX — AI-Powered Job Application Tracker',
  description: 'Track your job applications, generate AI cover letters, and manage follow-ups with JobX — the smart job search companion.',
  keywords: 'job tracker, job application, cover letter, AI, job search',
  openGraph: {
    title: 'JobX — AI-Powered Job Application Tracker',
    description: 'Track job applications, generate AI cover letters, and manage follow-ups.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
