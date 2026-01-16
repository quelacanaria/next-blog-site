"use client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
type AuthContextType={
    user: User|null;
    signUp: (name: string, email:string, password:string) => Promise<string|ReactNode>;
    signIn: (email:string, password:string) => Promise<string|ReactNode>;
    logout: () => Promise<string|ReactNode>;
    status: ReactNode|null,
    setStatus: any
}
export const AppAuthContext = createContext<AuthContextType|undefined>(undefined);

export function AuthContext({children}: {children:ReactNode}) {
    const supabase = getSupabaseBrowserClient();
    const [status, setStatus] = useState<ReactNode|null>(null);
    const [user, setUser] = useState<User|null>(null);

        useEffect(() => {
          const {data: listener} = supabase.auth.onAuthStateChange(
              (_event, session) => {
                  setUser(session?.user ?? null);
              });
          return () => {listener?.subscription.unsubscribe()};
      }, [supabase])
    

    const signUp = async(name:string, email:string, password:string) => {
        const {error} = await supabase.auth.signUp({
             email, password, options:{data:{name: name},},
        });
        return error ? <p className='text text-error'>{error.message}</p> 
                : <p className='text text-success'>Successfully create an Account</p>;
    }
    const signIn = async(email:string, password:string)=>{
        const {error} = await supabase.auth.signInWithPassword({
            email, password
        });
        return error ? <p className='text text-error'>{error.message}</p> 
                : <p className='text text-success'>Successfully LoggedIn</p>;
    }
    const logout = async()=>{
        const {error} = await supabase.auth.signOut();
        setUser(null);
        return error ? <p className='text text-error'>{error.message}</p> 
                : <p className='text text-success'>Successfully LoggedOut</p>;
    }

    

  return (
    <AppAuthContext.Provider value={{signIn, signUp, logout, user, status, setStatus}}>
        {children}
    </AppAuthContext.Provider>
  )

}

export const useAuth = () => {
    const context = useContext(AppAuthContext);
    if(!context) {
        throw new Error('useAuth must be wrapped by AuthContext');
    }
    return context;
}