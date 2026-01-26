"use client";
import { FC } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFetchPostsQuery } from '@/AppRedux/Slices/postApi';

interface PaginationControllProps{
    hasNextPage: boolean
    hasPrevPage: boolean
}

export const PaginationControlls: FC<PaginationControllProps> = ({
    hasNextPage,
    hasPrevPage
} ) => {
const {data:posts=[]}=useFetchPostsQuery();
const post = posts.filter((post)=> post.Public === 'public').length;
const router = useRouter();
const searchParams = useSearchParams();
const page = searchParams.get('page') ?? '1';
const per_page = searchParams.get('per_page') ?? '5';
 return(
    <div className='flex gap-2'>
        <button className='btn btn-primary text-white p-1'
        disabled={!hasPrevPage}
        onClick={() => {
            router.push(`/NewsFeed/?page=${Number(page) -1}&per_page=${per_page}`)
        }} >prev-page</button>
        <div>
        {page}/{Math.ceil(post/Number(per_page))}
        </div>
        <button className='btn btn-primary text-white p-1' 
        disabled={!hasNextPage}
        onClick={() => {
            router.push(`/NewsFeed/?page=${Number(page) + 1}&per_page=${per_page}`)
        }}>
            next-page
        </button>
    </div>

    
 )
}