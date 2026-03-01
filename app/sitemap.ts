import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://www.akidsy.com/',
            lastModified: new Date(),
            priority: 1.0,
        },
        {
            url: 'https://www.akidsy.com/login',
            lastModified: new Date(),
            priority: 0.5,
        },
        {
            url: 'https://www.akidsy.com/privacy',
            lastModified: new Date(),
            priority: 0.3,
        },
        {
            url: 'https://www.akidsy.com/terms',
            lastModified: new Date(),
            priority: 0.3,
        },
        {
            url: 'https://www.akidsy.com/dashboard/support',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]
}
