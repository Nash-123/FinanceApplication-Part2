"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "../../../node_modules/next/navigation";

export function AppBarClient(){
    const session = useSession();
    const router = useRouter();

    return (
        <div>
            <Appbar onSignIn={signIn} onSignOut={ async() => {
                await signOut();
                router.push("/api/auth/signin")
            }} user={session.data?.user}></Appbar>
        </div>
    );
}

