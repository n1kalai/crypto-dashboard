import { getSitemapData } from '@/services/get-sitemap-data'

export default async function sitemap() {
  const data = await getSitemapData()
  const frontEndurl = 'https://example.com'

  const arrToReturn = [
    {
      url: frontEndurl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ]

  Object.keys(data).forEach((id) => {
    arrToReturn.push({
      url: `${frontEndurl}/assets/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })
  })

  return arrToReturn
}
