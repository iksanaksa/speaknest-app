import './globals.css'

export const metadata = {
  title: 'English Practice',
  description: 'Latihan IELTS & English',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}