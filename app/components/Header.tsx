import { EmailPasswordDemoProps } from "../GetStarted/GetStarted"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
export const Header = ({user}: EmailPasswordDemoProps) => {
    const supabase = getSupabaseBrowserClient();
    const handleSignOut = async() => {
        await supabase.auth.signOut();
    }
    return(
        <>
            <nav className="navbar bg-primary text-primary-content ">
                <a className="p-5 text-ghost text-xl font-semibold">Blog Site</a>
                {user &&(<p>{user.email}</p>)}
                {user &&(
                <div className="dropdown dropdown-bottom dropdown-end ">
                    <div tabIndex={0} role="button" className="btn btn-soft btn-primary btn-circle"><FontAwesomeIcon icon={faUser} size="lg" /></div>
                    <ul tabIndex={-1} className="dropdown-content menu bg-primary rounded-box z-1 w-30 p-2 shadow-sm ">
                        <li className="hover:bg-white hover:text-primary rounded-sm font-bold "><a>Settings</a></li>
                        <li className="hover:bg-white hover:text-primary rounded-sm font-bold"><a>Logout</a></li>
                    </ul>
                </div>     
                )}        
            </nav>  
        </>
    )
}