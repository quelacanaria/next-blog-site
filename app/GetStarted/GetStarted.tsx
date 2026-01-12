"use client";
import React, { useEffect } from 'react'
import { User } from '@supabase/supabase-js';
import { FormEvent, useState } from "react";
// import { Header } from "@/app/components/Header";
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
export type EmailPasswordDemoProps = {
    user: User|null;
}
type Mode = 'signup'|'signin';
export default function GetStarted({user}: EmailPasswordDemoProps) {
    const [mode, setMode] = useState<Mode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [currentUser, setCurrentUser] = useState<User | null>(user);
    const supabase = getSupabaseBrowserClient();
    useEffect(() => {
        const {data: listener} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setCurrentUser(session?.user ?? null);
            });
        return () => {listener?.subscription.unsubscribe()};
    }, [supabase])
    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(mode == 'signup'){
            const {data, error} = await supabase.auth.signUp({
                email, password
            });
            if(error){
                setStatus(error.message);
            }else{
                setStatus('Account created successfully!');
                setEmail('');
                setPassword('');
                setMode('signin');
            }
        }else{
            const {data, error} = await supabase.auth.signInWithPassword({
                email, password
            });  
            if(error){
                setStatus(error.message);
            }else{
                setStatus('Successfully LoggedIn!!');
                setEmail('');
                setPassword('');
            }
        }
    }
    const handleSignOut = async() => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setStatus("Successfully Signed Out!");
    }    
  return (
    <>
        {/* <Header user={currentUser} /> */}
         <nav className="navbar bg-primary text-primary-content ">
                <a className="p-5 text-ghost text-xl font-semibold">Blog Site</a>
                {currentUser &&(<p>{currentUser.email}</p>)}
                {currentUser &&(
                <div className="dropdown dropdown-bottom dropdown-end ">
                    <div tabIndex={0} role="button" className="btn btn-soft btn-primary btn-circle"><FontAwesomeIcon icon={faUser} size="lg" /></div>
                    <ul tabIndex={-1} className="dropdown-content menu bg-primary rounded-box z-1 w-30 p-2 shadow-sm ">
                        <li className="hover:bg-white hover:text-primary rounded-sm font-bold "><a>Settings</a></li>
                        <li className="hover:bg-white hover:text-primary rounded-sm font-bold" onClick={handleSignOut}><a>Logout</a></li>
                    </ul>
                </div>     
                )}        
            </nav>  

            {!currentUser && ( <>
            {mode === 'signin' && (
            <div className="hero bg-base-200 min-h-140 ">
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        {status &&(<p className='text-green-600'>{status}</p>)} 
                        <form className="fieldset" onSubmit={handleSubmit} >
                        <label className="label">Email</label>
                        <input type="email" className="input" placeholder="Email" value={email} onChange={event=>setEmail(event.target.value)} />
                        <label className="label">Password</label>
                        <input type="password" className="input" value={password} onChange={event=>setPassword(event.target.value)} placeholder="Password" />
                        <div><a className="link link-hover" onClick={() => setMode('signup')} >Create Account?</a></div>
                        <button className="btn btn-primary mt-4">Login</button>
                        </form>
                    </div>
                </div>
            </div>   )}
            {mode === 'signup' &&(
            <div className="hero bg-base-200 min-h-140">
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    {status &&(<p className='text-red-600'>{status}</p>)} 
                    <form className="fieldset" onSubmit={handleSubmit}>
                    <label className="label">Email</label>
                    <input type="email" className="input" placeholder="Email" value={email} onChange={event=>setEmail(event.target.value)}/>
                    <label className="label">Password</label>
                    <input type="password" className="input" placeholder="Password" value={password} onChange={event=>setPassword(event.target.value)}/>
                    <div><a className="link link-hover" onClick={() => setMode('signin')}>Login?</a></div>
                    <button className="btn btn-primary mt-4">Create</button>
                    </form>
                </div>
                </div>
            </div>)}   
            </>)}
            {currentUser &&(
                <div className="card bg-primary text-primary-content w-96">
                    <div className="card-body">
                        <h2 className="card-title">{currentUser.email}</h2>
                        <p>{currentUser.id}</p>
                        <p>{currentUser.last_sign_in_at}</p>
                    </div>
                </div>
            )}
                  
    </>
  )
}

