/**
 * Build gems.json from POE2 Wiki Cargo API.
 * Run: node scripts/build-gems.mjs
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_PATH = path.join(process.cwd(), "data", "gems.json");

const ACTIVE_BASE =
  "https://www.poe2wiki.net/w/index.php?title=Special:CargoExport&tables=skill&fields=_pageName,active_skill_name,skill_id,cast_time,description,max_level,stat_text,item_class_restriction&format=json&limit=250";
const SUPPORT_BASE =
  "https://www.poe2wiki.net/w/index.php?title=Special:CargoExport&tables=skill&fields=_pageName,skill_id,description,stat_text&format=json&limit=250";

function decodeEntities(str) {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");
}

function stripWikiMarkup(text) {
  if (!text) return "";
  let s = decodeEntities(text);
  s = s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?big>/gi, "")
    .replace(/<span[^>]*>/gi, "")
    .replace(/<\/span>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return s;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchWithRanges(baseUrl, whereBase, label) {
  const ranges = [
    "_pageName < 'G'",
    "_pageName >= 'G' AND _pageName < 'N'",
    "_pageName >= 'N' AND _pageName < 'S'",
    "_pageName >= 'S'",
  ];
  const allItems = [];

  for (const range of ranges) {
    const where = encodeURIComponent(`${whereBase} AND ${range}`);
    const url = `${baseUrl}&where=${where}`;
    console.log(`  Fetching ${label} [${range}]...`);
    const res = await fetch(url);
    const text = await res.text();
    let arr;
    try {
      arr = JSON.parse(text);
    } catch (e) {
      console.error(`  Parse error [${range}]: ${e.message.slice(0, 60)}`);
      continue;
    }
    if (Array.isArray(arr)) {
      console.log(`    -> ${arr.length} items`);
      allItems.push(...arr);
    }
  }
  return allItems;
}

async function main() {
  console.log("Fetching active skills from POE2 Wiki...");
  const activeWhere = "skill_id LIKE '%Player' AND active_skill_name IS NOT NULL AND max_level > 1";
  const activeRaw = await fetchWithRanges(ACTIVE_BASE, activeWhere, "active");
  console.log(`  Got ${activeRaw.length} active skill entries`);

  console.log("Fetching support gems from POE2 Wiki...");
  const supportWhere = "skill_id LIKE 'Support%Player'";
  const supportRaw = await fetchWithRanges(SUPPORT_BASE, supportWhere, "support");
  console.log(`  Got ${supportRaw.length} support gem entries`);

  const seenSkillId = new Set();
  const seenSlug = new Set();
  const gems = [];

  for (const item of activeRaw) {
    const skillId = item["skill id"];
    if (!skillId || seenSkillId.has(skillId)) continue;
    seenSkillId.add(skillId);

    const name = item["active skill name"] || item._pageName;
    let slug = slugify(name);
    if (seenSlug.has(slug)) slug = `${slug}-active`;
    if (seenSlug.has(slug)) continue;
    seenSlug.add(slug);
    const description = stripWikiMarkup(item.description || "");
    const statText = stripWikiMarkup(item["stat text"] || "");
    const castTime = item["cast time"];
    const maxLevel = item["max level"] || 20;

    const weaponReqs = [];
    const restriction = item["item class restriction"] || [];
    if (Array.isArray(restriction)) {
      for (const r of restriction) {
        if (r && r.trim()) weaponReqs.push(r.trim());
      }
    }

    gems.push({
      id: slug,
      slug,
      name,
      gem_type: "active",
      tags: [],
      description,
      cost: { resource: "mana", base_value: 0 },
      cooldown: null,
      cast_time: castTime != null ? Number(castTime) : null,
      critical_chance: null,
      weapon_requirements: weaponReqs,
      attribute_requirements: { int: 0, str: 0, dex: 0 },
      max_level: Number(maxLevel),
      per_level: { damage_multiplier: 1.0, mana_cost_multiplier: 1.0 },
      stat_text: statText,
      is_kalguuran: false,
      consumes_ward: false,
      patch_added: "0.4",
    });
  }

  for (const item of supportRaw) {
    const skillId = item["skill id"];
    if (!skillId || seenSkillId.has(skillId)) continue;
    seenSkillId.add(skillId);

    const name = item._pageName;
    let slug = slugify(name);
    if (seenSlug.has(slug)) slug = `${slug}-support`;
    if (seenSlug.has(slug)) continue;
    seenSlug.add(slug);
    const description = stripWikiMarkup(item.description || "");
    const statText = stripWikiMarkup(item["stat text"] || "");

    gems.push({
      id: slug,
      slug,
      name,
      gem_type: "support",
      tags: [],
      description,
      cost: { resource: "mana", base_value: 0 },
      cooldown: null,
      cast_time: null,
      critical_chance: null,
      weapon_requirements: [],
      attribute_requirements: { int: 0, str: 0, dex: 0 },
      max_level: 1,
      per_level: { damage_multiplier: 1.0, mana_cost_multiplier: 1.0 },
      stat_text: statText,
      is_kalguuran: false,
      consumes_ward: false,
      patch_added: "0.4",
    });
  }

  gems.sort((a, b) => a.name.localeCompare(b.name));

  const activeCount = gems.filter((g) => g.gem_type === "active").length;
  const supportCount = gems.filter((g) => g.gem_type === "support").length;
  console.log(`\nTotal: ${gems.length} gems (${activeCount} active, ${supportCount} support)`);

  const output = {
    meta: {
      patch_version: "0.4",
      last_updated: new Date().toISOString().slice(0, 10),
      status: "current",
      note: "Real data from POE2 Wiki (0.4). Patch 0.5 new gems will be added on launch.",
    },
    gems,
  };

  await writeFile(OUT_PATH, JSON.stringify(output, null, 2), "utf8");
  console.log(`Written to ${OUT_PATH}`);
}

main().catch(console.error);
