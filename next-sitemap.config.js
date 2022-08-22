/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://shop.marvinsden.com',
  generateRobotsTxt: true, // (optional)
  // ...other options
};
