const siteUrl = process.env.SITE_URL || "https://example.com";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
};

