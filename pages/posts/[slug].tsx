import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import type PostType from '../../interfaces/post'
import Link from 'next/link'

type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}

export default function Post({ post, morePosts, preview }: Props) {
  const imageUrl =
    process.env.NEXT_PUBLIC_BASE_URL +
    '/api/og?' +
    'title=' +
    encodeURIComponent(post.title) +
    '&author=' +
    encodeURIComponent(post.author.name) +
    '&date=' +
    encodeURIComponent(post.published_time) +
    '&cover=' +
    encodeURIComponent(post.ogImage.url)

  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  const host = typeof window !== 'undefined' ? window.location.host : ''
  const path = router.asPath
  	// to remove HTML tags from excerpt
	// const removeHTMLTags = (str: string) => {
	// 	if (str === null || str === '') return '';
	// 	else str = str.toString();
	// 	return str.replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
	// };
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
                <Head>
                  <meta property="og:title" content={post.title} />
                  <link rel="canonical" href={`https://${host}/${path}`} />
                  <meta property="og:description" content={post.excerpt} />
                  {/* <meta property="og:description" content={removeHTMLTags(post.excerpt)} /> */}
                  <meta property="og:url" content={`https://${host}/${path}`} />
                  <meta property="og:type" content="article" />
                  <meta property="og:locale" content="en_US" />
                  <meta property="og:site_name" content={host.split('.')[0]} />
                  <meta property="article:published_time" content={post.published_time} />
                  <meta property="article:modified_time" content={post.modified_time} />
                  <meta property="og:image" content={post.featuredImage.url} />
                  <meta name="twitter:image" content={post.featuredImage.url} />
                  <meta
                    property="og:image:alt"
                    content={post.featuredImage.altText || post.title}
                  />
                  <title>{post.title}</title>
			          </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.published_time}
                author={post.author}
                />
                <Link href={post.redirectInfo.url}>{post.redirectInfo.text}</Link>
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'published_time',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
    'featuredImage',
    'modified_time',
    'excerpt',
    'redirectInfo',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
