import React from 'react'
import { supabase } from '../supabase/client';

export const getImages = (url:string) => {
    const parts = url.split('/postsImages/');
    return parts[1];
}

export const deleteImage = async(imageUrl:string) => {
    const filePath = getImages(imageUrl);
    const {error} = await supabase.storage.from('postsImages')
                                          .remove([filePath])
}

export const deleteAllImage = async(postId:string)=>{
    const {data: comments, error} = await supabase.from('comments')
                                                  .select('image')
                                                  .eq('post_id', postId);
    if(error)throw error;
    const paths = comments.filter((c:any)=>c.image).map((c:any)=>getImages(c.image!));
    if(!paths || paths.length === 0)return;
    const {error: storageError} = await supabase.storage.from('postsImages')
                                                        .remove(paths);
    if(storageError) throw storageError;
}

export const UploadImage = async(file: File|null, userId: string) => {
    if(!file)return null;

    const ext = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${ext}`;

    const {error} = await supabase.storage.from('postsImages')
                                          .upload(fileName, file);
    if(error) throw error;

    const {data} = supabase.storage.from('postsImages')
                                   .getPublicUrl(fileName);

    return data.publicUrl
}
