const siteUrl = process.env.SITE_URL || "https://poe2tools.top";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  // Preview data pages: noindex; omit from sitemap until live data + indexable metadata.
  exclude: ["/tools", "/tools/rune-combinations", "/tools/runic-ward-calc", "/tools/verisium-craft", "/db/runes", "/db/runes/**", "/db/uniques", "/db/uniques/**"],
};
