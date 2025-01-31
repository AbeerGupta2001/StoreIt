import Header from "@/components/Header"
import MobileNavigation from "@/components/MobileNavigation"
import Sidebar from "@/components/Sidebar"
import { getCurrentUser } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import { ReactNode } from "react"


export const dynamic = "force-dynamic"

const Layout = async ({children}:{children:ReactNode}) => {
  const currentUser = await getCurrentUser();
  if(!currentUser){
    redirect("/sign-in")
  }
  
  return (
    <main className="flex h-screen">
        <Sidebar {...currentUser} />
        <section className="flex h-full flex-1 flex-col">
            <MobileNavigation {...currentUser}/>
            <Header userId={currentUser.$id} accountId={currentUser.accountId} />
            <div className="main-container">
                {children}
            </div>
        </section>
    </main>
  )
}
export default Layout