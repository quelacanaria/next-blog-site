"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faHouse, faNewspaper, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '@/AppContext/AuthContext';
import { useRouter } from "next/navigation";
    
export const Header = () => {
    const router = useRouter();
    const { user, logout, setStatus } = useAuth();
    const handleSignOut = async() => {
        const response = logout();
        setStatus(response);
    }    
    return(
        <>
            <nav className="navbar bg-primary text-primary-content ">
                <a className="p-5 text-ghost text-xl font-semibold">Blog Site</a>
                <div className="ml-auto flex items-center gap-5 ">
                    {user &&(
                    <div className="dropdown dropdown-bottom dropdown-end flex gap-2 ">
                        <div role="button" className="btn btn-soft btn-primary btn-circle jh"><FontAwesomeIcon icon={faHouse} size="lg" onClick={() => router.replace('/GetStarted')} /></div>
                        <div role="button" className="btn btn-soft btn-primary btn-circle"><FontAwesomeIcon icon={faNewspaper} size="lg" onClick={() => router.replace('/NewsFeed')}/></div>
                        <div role="button" className="btn btn-soft btn-primary btn-circle"><FontAwesomeIcon icon={faPlus} size="lg" onClick={() => router.replace('/Post/CreatePosts')}/></div>
                        <div tabIndex={4} role="button" className="btn btn-soft btn-primary btn-circle"><FontAwesomeIcon icon={faUser} size="lg" /></div>
                        <ul tabIndex={-1} className="dropdown-content menu bg-primary rounded-box z-1 w-30 p-2 shadow-sm ">
                            <li className="hover:bg-white hover:text-primary rounded-sm font-bold "><a>{user &&(<p>{user.user_metadata.name }</p>)}   </a></li>
                            <li className="hover:bg-white hover:text-primary rounded-sm font-bold " onClick={() => router.replace('/Settings')}><a>Settings</a></li>
                            <li className="hover:bg-white hover:text-primary rounded-sm font-bold" onClick={handleSignOut}><a>Logout</a></li>
                        </ul>
                    </div> 
                    )}   
                </div>         
            </nav>  
        
        </>
    )
}