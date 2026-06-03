import { MetadataRoute } from 'next';

const SITE_URL = 'https://ashutoshjha.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/icons/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
