import BackEndLayout from "../components/layouts/BackEndLayout"

export const metadata = {
  title: 'Dashboard | Eyara Fashion',
}

export default function RootLayout({ children }) {
  return (
    <BackEndLayout>
    {children}
    </BackEndLayout>   
  )
}
