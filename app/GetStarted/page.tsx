import React from 'react'
import GetStarted from './GetStarted'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'
export default async function page() {
    const supabase = await createSupabaseServerClient();
    const {data:{user}} = await supabase.auth.getUser();
    console.log(user);
  return (
    <>
        <GetStarted user={user}/>
    </>
  )
}
