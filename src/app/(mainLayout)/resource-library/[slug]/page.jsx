import BlogDetailContent from './BlogDetailContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zayeduddin-melm.vercel.app';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://zayeduddin-melm-backend.vercel.app/api';

/**
 * Generate dynamic OG meta tags for social media sharing
 * এই ফাংশন সার্ভার সাইডে রান হয় — social media crawler এই meta tags দেখবে
 */
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    try {
        const res = await fetch(`${API_BASE}/blogs/slug/${encodeURIComponent(decodedSlug)}`, {
            next: { revalidate: 60 }, // Cache for 60 seconds
        });
        const data = await res.json();

        if (data.success && data.data) {
            const blog = data.data;
            const title = blog.title || 'Resource Library';
            const description = blog.excerpt || blog.title || 'Read this resource on Zayed Uddin platform';
            const image = blog.thumbnail || `${SITE_URL}/images/og-default.jpg`;
            const url = `${SITE_URL}/resource-library/${encodeURIComponent(decodedSlug)}`;
            const authorName = blog.author
                ? `${blog.author.firstName || ''} ${blog.author.lastName || ''}`.trim()
                : 'Zayed Uddin';

            return {
                title: `${title} | Zayed Uddin`,
                description,
                authors: [{ name: authorName }],
                openGraph: {
                    title,
                    description,
                    url,
                    siteName: 'Zayed Uddin',
                    images: [
                        {
                            url: image,
                            width: 1200,
                            height: 630,
                            alt: title,
                        },
                    ],
                    locale: 'bn_BD',
                    type: 'article',
                    publishedTime: blog.publishedAt || blog.createdAt,
                    authors: [authorName],
                    tags: blog.tags || [],
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                    images: [image],
                    creator: `@zayeduddin`,
                },
                alternates: {
                    canonical: url,
                },
            };
        }
    } catch (error) {
        console.error('Failed to generate metadata:', error);
    }

    // Fallback metadata
    return {
        title: 'Resource Library | Zayed Uddin',
        description: 'Read articles and resources on Zayed Uddin platform',
    };
}

export default function BlogDetailPage() {
    return <BlogDetailContent />;
}
