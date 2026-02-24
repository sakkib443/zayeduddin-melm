import ResourceLibraryContent from './ResourceLibraryContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zayeduddin-melm.vercel.app';

export const metadata = {
    title: 'Resource Library | Zayed Uddin',
    description: 'Explore our latest insights, guides and resources on technology, design, and professional growth.',
    openGraph: {
        title: 'Resource Library | Zayed Uddin',
        description: 'Explore our latest insights, guides and resources on technology, design, and professional growth.',
        url: `${SITE_URL}/resource-library`,
        siteName: 'Zayed Uddin',
        images: [
            {
                url: `${SITE_URL}/images/og-default.jpg`,
                width: 1200,
                height: 630,
                alt: 'Zayed Uddin Resource Library',
            },
        ],
        locale: 'bn_BD',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Resource Library | Zayed Uddin',
        description: 'Explore our latest insights, guides and resources on technology, design, and professional growth.',
        images: [`${SITE_URL}/images/og-default.jpg`],
    },
    alternates: {
        canonical: `${SITE_URL}/resource-library`,
    },
};

export default function ResourceLibraryPage() {
    return <ResourceLibraryContent />;
}
