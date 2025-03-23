'use client'
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import Link from 'next-auth'


function Navbar() {
    const {data: session} = useSession();


    const user: User = session?.user
  return (
    <div>
        <a href="">social eco</a>
        {
            session?(
                <span>Welcome, {user.username || user.email}</span>
                <Button>Logout</Button>
            ):()


        }
    </div>
  )
}

export default Navbar