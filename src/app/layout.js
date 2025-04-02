export const metadata = {
  title: 'What Can Kill You',
  description: 'An interactive guide to deadly wildlife around the world',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
