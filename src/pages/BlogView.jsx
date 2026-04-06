import React, { useState } from 'react'
import {
    Breadcrumb,
    // BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, MessageSquare, Share2 } from 'lucide-react'
// import CommentBox from '@/components/CommentBox'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { toast } from 'sonner'
import { setBlog } from '@/redux/blogSlice'
import axios from 'axios'
import { API_URL } from "@/lib/api";

const BlogView = () => {
    const params = useParams()
    const blogId = params.blogId
    const dispatch = useDispatch();
    const { blog } = useSelector(store => store.blog)
    const { user } = useSelector(store => store.auth)
    const selectedBlog = blog.find(blog => blog._id === blogId)
    // const [blogLike, setBlogLike] = useState(selectedBlog?.likes?.length || 0);
    const [blogLike, setBlogLike] = useState(selectedBlog?.likes?.length || 0)
    const [liked, setLiked] = useState(selectedBlog?.likes?.includes(user?._id || false));

    console.log(selectedBlog);

    const changeTimeFormat = (isDate) =>{
        const date = new Date(isDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
       const formattedDate = date.toLocaleDateString('en-GB', options)
         return formattedDate;
    }
    
    const handleShare = (blogId) => {
        const blogUrl =` ${window.location.origin}/blogs/${blogId}`;
        if (navigator.share) {
            navigator.share({
                title: 'Check out this blog!',
                text: 'Found this interesting blog, have a look:',
                url: blogUrl,  
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        } else {
           navigator.clipboard.writeText(blogUrl).then(() => {
            toast.success('Blog URL copied to clipboard!')         
           });
        }
    }   
    const likeOrDislikeHandler = async () => {
    // Optimistically update UI and show toast immediately
    const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
    setBlogLike(updatedLikes);
    setLiked(!liked);

    const updatedBlogData = blog.map(p =>
        p._id === selectedBlog._id
            ? {
                  ...p,
                  likes: liked
                      ? (p.likes || []).filter(id => id !== user._id)
                      : [...(p.likes || []), user._id]
              }
            : p
    );
    dispatch(setBlog(updatedBlogData));

    // Show toast immediately
    toast.success(liked ? 'Disliked!' : 'Liked!');

    // Make API call in background
    try {
        const action = liked ? 'dislike' : 'like';
        const res = await axios.get(
            `${API_URL}/blog/${selectedBlog._id}/${action}`,
            { withCredentials: true }
        );

        // Optional: revert UI if server returns failure
        if (!res?.data?.success) {
            toast.error(res?.data?.message || 'Server failed to process');
            // revert UI
            setBlogLike(liked ? blogLike : blogLike - 1);
            setLiked(liked);
            const revertedBlogData = blog.map(p =>
                p._id === selectedBlog._id
                    ? {
                          ...p,
                          likes: liked
                              ? [...(p.likes || []), user._id]
                              : (p.likes || []).filter(id => id !== user._id)
                      }
                    : p
            );
            dispatch(setBlog(revertedBlogData));
        }
    } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');

        // revert UI on network error
        setBlogLike(liked ? blogLike : blogLike - 1);
        setLiked(liked);
        const revertedBlogData = blog.map(p =>
            p._id === selectedBlog._id
                ? {
                      ...p,
                      likes: liked
                          ? [...(p.likes || []), user._id]
                          : (p.likes || []).filter(id => id !== user._id)
                  }
                : p
        );
        dispatch(setBlog(revertedBlogData));
    }
    };


    return (
        <div className='pt-14'>
            <div className='max-w-6xl mx-auto p-10'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to={'/'}>Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <Link to={'/blogs'}>Blogs</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {/* Blog Header */}
                <div className="my-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">{selectedBlog.title}</h1>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={selectedBlog.author.photoUrl} alt="Author" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{selectedBlog.author.firstName} {selectedBlog.author.lastName}</p>
                                <p className="text-sm text-muted-foreground">{selectedBlog.author.occupation}</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Published on {changeTimeFormat(selectedBlog.createdAt)} • 8 min read</p>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="mb-8 rounded-lg overflow-hidden">
                    <img
                        src={selectedBlog?.thumbnail}
                        alt="Next.js Development"
                        width={1000}
                        height={500}
                        className="w-full object-cover"
                    />
                    <p className="text-sm text-muted-foreground mt-2 italic">{selectedBlog.subtitle}</p>
                </div>

                <p className='' dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />

                <div className='mt-10'>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <Badge variant="secondary">Next.js</Badge>
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">Web Development</Badge>
                        <Badge variant="secondary">JavaScript</Badge>
                    </div>

                    {/* Engagement */}
                    <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8">
                        <div className="flex items-center space-x-4">
                            <Button onClick={likeOrDislikeHandler} variant="ghost" size={24} className="flex items-center gap-1">
                                {
                                    liked ? <FaHeart className='cursor-pointer hover:text-red-600 text-red-500'/> : <FaRegHeart className='cursor-pointer hover:text-gray-600 text-white'/>
                                }
                               <span>{blogLike}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>1 Comments</span>
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                                <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button onClick={()=>handleShare(selectedBlog._id)} variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                </div>
                {/* <CommentBox selectedBlog={selectedBlog} /> */}

                {/* Author Bio */}
                {/* <Card className="mb-12">
                    <CardContent className="flex items-start space-x-4 pt-6">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Author" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold mb-1">About Jane Doe</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Jane is a lead developer with over 10 years of experience in web development. She specializes in React and
                                Next.js and has helped numerous companies build modern, performant websites.
                            </p>
                            <Button variant="outline" size="sm">
                                Follow
                            </Button>
                        </div>
                    </CardContent>
                </Card> */}
            </div>
        </div>
    )
}

export default BlogView