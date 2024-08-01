import type Author from './author'

type PostType = {
  slug: string
  title: string
  published_time: string
  coverImage: string
  author: Author
  excerpt: string
  ogImage: {
    url: string
  }
  content: string
  featuredImage: {
    url: string,
    altText: string
  },
  modified_time: string,
  redirectInfo: {
    url: string,
    text: string,
  }
}

export default PostType
