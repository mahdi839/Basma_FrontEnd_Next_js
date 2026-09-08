import BackEndLayout from "../components/layouts/BackEndLayout"

export const metadata = {
  title: { absolute: 'Dashboard | Eyara Fashion' },
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }) {
  return (
    <BackEndLayout>
    {children}
    </BackEndLayout>   
  )
}
