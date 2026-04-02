/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://jastipvip.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*'], // don't index internal pages
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ]
  }
}
