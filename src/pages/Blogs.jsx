import React, { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setBlog } from '@/redux/blogSlice'
import { API_URL } from "@/lib/api";

const Blogs = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [overflowMap, setOverflowMap] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector(store => store.blog)

  useEffect(() => {
    const getPublishedBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `
          ${API_URL}/blog/get-published-blogs`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getPublishedBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-28 gap-6 p-20 bg-white dark:bg-gray-900'>
      {blog.map((item, index) => (
        <Card key={index} className="relative mx-auto w-full pt-0 bg-gray-200 dark:bg-gray-800">
          <div className="absolute inset-0 z-30 aspect-video" />
          <img
            src={item.thumbnail}
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover"
          />
          <CardHeader>
            {/* Author info */}
            <div className="flex items-center gap-2 mb-1">
              {item.author?.photoUrl ? (
                <img
                  src={item.author.photoUrl}
                  alt="author"
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold">
                  {item.author?.firstname?.[0]}{item.author?.lastname?.[0]}
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.author?.firstname} {item.author?.lastname}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.createdAt?.split("T")[0]}
              </span>
            </div>

            <CardTitle
              onClick={() => navigate(`/blogs/${item._id}`)}
              className="cursor-pointer hover:underline"
            >
              {item.title}
            </CardTitle>

            <CardDescription className="overflow-hidden break-words">
              <div
                ref={(el) => {
                  if (el) {
                    const isOverflowing = el.scrollHeight > el.clientHeight;
                    if (isOverflowing && !overflowMap[item._id]) {
                      setOverflowMap((prev) => ({ ...prev, [item._id]: true }));
                    }
                  }
                }}
                className={expandedId !== item._id ? "line-clamp-3" : ""}
                dangerouslySetInnerHTML={{ __html: item.description || "" }}
              />
              {overflowMap[item._id] && (
                <button
                  onClick={() =>
                    setExpandedId(expandedId === item._id ? null : item._id)
                  }
                  className="text-sm font-medium text-blue-500 hover:text-blue-400 mt-1 block"
                >
                  {expandedId === item._id ? "Show less ↑" : "Read more ↓"}
                </button>
              )}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex-1 flex-col gap-3">
            <CardAction>
              <div className="flex flex-wrap gap-2 mb-8">
                {/* ✅ Dynamic category */}
                {item.category && (
                  <Badge
                    variant="secondary"
                    className="dark:bg-gray-500 dark:text-amber-50"
                  >
                    {item.category}
                  </Badge>
                )}
              </div>
            </CardAction>
            <Button
              className="w-full"
              onClick={() => navigate(`/blogs/${item._id}`)}
            >
              View Blog
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default Blogs