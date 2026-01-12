"use client";
import React from 'react'
import { User } from '@supabase/supabase-js';
import { FormEvent, useState } from "react";
import { Header } from "@/components/Header";
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
type EmailPasswordDemoProps = {
    user: User|null;
}
type Mode = 'signup'|'signin';
export default function GetStarted({user}: EmailPasswordDemoProps) {
    const [mode, setMode] = useState<Mode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const supabase = getSupabaseBrowserClient();
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(mode == 'signup'){
            const {data, error} = await supabase.auth.signUp({
                email, password
            });
            if(error){
                setStatus(error.message);
            }else{
                setStatus('Account created successfully!');
                setMode('signin');
            }
            console.log({data});
        }else{
            const {data, error} = await supabase?.auth.signInWithPassword({
                email, password
            });  
            if(error){
                setStatus(error.message);
            }else{
                setStatus('Successfully LoggedIn!!');
            }
        }
    }
  return (
    <>
        <Header/>
                {mode === 'signin' && (
            <div className="hero bg-base-200 min-h-screen">
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
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
            <div className="hero bg-base-200 min-h-screen">
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
              
    </>
  )
}
