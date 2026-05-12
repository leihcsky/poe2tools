/**
 * Build gems.json from POE2 Wiki Cargo API.
 * Pulls from 3 tables: skill, skill_gems, skill_levels
 * Run: node scripts/build-gems.mjs
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_PATH = path.join(process.cwd(), "data", "gems.json");

const WIKI_BASE = "https://www.poe2wiki.net/w/index.php?title=Special:CargoExport&format=json&limit=250";

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      return await res.text();
    } catch (e) {
      console.log(`    Retry ${i + 1}/${retries}: ${e.message.slice(0, 50)}`);
      if (i < retries - 1) await new Promise((r) => setTimeout(r, 3000));
    }
  }
  return null;
}

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

async function fetchPaginated(baseUrl, where, label) {
  const ranges = [
    "_pageName < 'D'",
    "_pageName >= 'D' AND _pageName < 'G'",
    "_pageName >= 'G' AND _pageName < 'K'",
    "_pageName >= 'K' AND _pageName < 'N'",
    "_pageName >= 'N' AND _pageName < 'R'",
    "_pageName >= 'R' AND _pageName < 'S'",
    "_pageName >= 'S' AND _pageName < 'V'",
    "_pageName >= 'V'",
  ];
  const allItems = [];

  for (const range of ranges) {
    const fullWhere = where ? `${where} AND ${range}` : range;
    const url = `${baseUrl}&where=${encodeURIComponent(fullWhere)}`;
    console.log(`  [${label}] ${range}...`);
    const text = await fetchWithRetry(url);
    if (!text) { console.error(`    Failed after retries`); continue; }
    let arr;
    try {
      arr = JSON.parse(text);
    } catch (e) {
      console.error(`  Parse error [${range}]: ${e.message.slice(0, 80)}`);
      continue;
    }
    if (Array.isArray(arr)) {
      console.log(`    -> ${arr.length} items`);
      allItems.push(...arr);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return allItems;
}

async function fetchSkillLevelsByLevel(targetLevel, label) {
  const fields = "_pageName,level,critical_strike_chance,cost_amounts,cost_types,cooldown,dexterity_requirement,intelligence_requirement,strength_requirement,damage_effectiveness,spirit_reservation_flat,stored_uses";
  const baseUrl = `${WIKI_BASE}&tables=skill_levels&fields=${fields}`;

  const ranges = [
    "_pageName < 'D'",
    "_pageName >= 'D' AND _pageName < 'G'",
    "_pageName >= 'G' AND _pageName < 'K'",
    "_pageName >= 'K' AND _pageName < 'N'",
    "_pageName >= 'N' AND _pageName < 'R'",
    "_pageName >= 'R' AND _pageName < 'S'",
    "_pageName >= 'S' AND _pageName < 'V'",
    "_pageName >= 'V'",
  ];
  const allItems = [];

  for (const range of ranges) {
    const w = `level = ${targetLevel} AND ${range}`;
    const url = `${baseUrl}&where=${encodeURIComponent(w)}`;
    console.log(`  [${label}] ${range}...`);
    const text = await fetchWithRetry(url);
    if (!text) { console.error(`    Failed after retries`); continue; }
    let arr;
    try {
      arr = JSON.parse(text);
    } catch (e) {
      console.error(`  Parse error: ${e.message.slice(0, 80)}`);
      continue;
    }
    if (Array.isArray(arr)) {
      console.log(`    -> ${arr.length} items`);
      allItems.push(...arr);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return allItems;
}

async function main() {
  // 1. Fetch from `skill` table (descriptions, cast_time, max_level, weapon restrictions)
  console.log("1/3 Fetching skill table...");
  const skillFields = "_pageName,active_skill_name,skill_id,cast_time,description,max_level,stat_text,item_class_restriction";
  const skillUrl = `${WIKI_BASE}&tables=skill&fields=${skillFields}`;

  const activeWhere = "skill_id LIKE '%Player' AND active_skill_name IS NOT NULL AND max_level > 1";
  const activeRaw = await fetchPaginated(skillUrl, activeWhere, "active");
  console.log(`  Total active: ${activeRaw.length}`);

  const supportWhere = "skill_id LIKE 'Support%Player'";
  const supportRaw = await fetchPaginated(skillUrl, supportWhere, "support");
  console.log(`  Total support: ${supportRaw.length}`);

  // 2. Fetch from `skill_gems` table (tags, primary_attribute, attribute percentages)
  console.log("\n2/3 Fetching skill_gems table...");
  const gemsFields = "_pageName,gem_tags,primary_attribute,dexterity_percent,intelligence_percent,strength_percent,gem_tier";
  const gemsUrl = `${WIKI_BASE}&tables=skill_gems&fields=${gemsFields}`;
  const gemsRaw = await fetchPaginated(gemsUrl, null, "skill_gems");
  console.log(`  Total skill_gems: ${gemsRaw.length}`);

  const gemsMap = new Map();
  for (const g of gemsRaw) {
    const page = g._pageName;
    if (page) gemsMap.set(page, g);
  }

  // 3. Fetch from `skill_levels` table
  console.log("\n3/4 Fetching skill_levels (level 0 — base crit)...");
  const levels0Raw = await fetchSkillLevelsByLevel(0, "lvl0-crit");
  console.log(`  Total level-0 entries: ${levels0Raw.length}`);

  console.log("\n4/5 Fetching skill_levels (level 1 — cost/cooldown)...");
  const levels1Raw = await fetchSkillLevelsByLevel(1, "lvl1-cost");
  console.log(`  Total level-1 entries: ${levels1Raw.length}`);

  console.log("\n5/5 Fetching skill_levels (level 20 — attr requirements)...");
  const levels20Raw = await fetchSkillLevelsByLevel(20, "lvl20-attr");
  console.log(`  Total level-20 entries: ${levels20Raw.length}`);

  const critMap = new Map();
  for (const l of levels0Raw) {
    if (l._pageName) critMap.set(l._pageName, l);
  }

  const levelsMap = new Map();
  for (const l of levels1Raw) {
    if (l._pageName && !levelsMap.has(l._pageName)) levelsMap.set(l._pageName, l);
  }

  const attrMap = new Map();
  for (const l of levels20Raw) {
    if (l._pageName) attrMap.set(l._pageName, l);
  }

  // Build final gem list
  const seenSkillId = new Set();
  const seenSlug = new Set();
  const gems = [];

  function processGem(item, gemType) {
    const skillId = item["skill id"];
    if (!skillId || seenSkillId.has(skillId)) return;
    seenSkillId.add(skillId);

    const name = gemType === "active"
      ? (item["active skill name"] || item._pageName)
      : item._pageName;

    let slug = slugify(name);
    if (seenSlug.has(slug)) slug = `${slug}-${gemType}`;
    if (seenSlug.has(slug)) return;
    seenSlug.add(slug);

    const description = stripWikiMarkup(item.description || "");
    const statText = stripWikiMarkup(item["stat text"] || "");
    const castTime = item["cast time"];
    const maxLevel = item["max level"] || (gemType === "active" ? 20 : 1);

    // Weapon restrictions from skill table
    const weaponReqs = [];
    const restriction = item["item class restriction"] || [];
    if (Array.isArray(restriction)) {
      for (const r of restriction) {
        if (r && r.trim()) weaponReqs.push(r.trim());
      }
    }

    // Merge skill_gems data
    const gemData = gemsMap.get(name) || {};
    const rawTags = gemData["gem tags"] || "";
    let tags = [];
    if (Array.isArray(rawTags)) {
      tags = rawTags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof rawTags === "string" && rawTags) {
      tags = rawTags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    const primaryAttr = gemData["primary attribute"] || "none";
    const intPct = Number(gemData["intelligence percent"]) || 0;
    const strPct = Number(gemData["strength percent"]) || 0;
    const dexPct = Number(gemData["dexterity percent"]) || 0;

    // Merge skill_levels data
    const lvlData = levelsMap.get(name) || {};
    const critData = critMap.get(name) || {};
    const attrData = attrMap.get(name) || {};

    const critChance = critData["critical strike chance"]
      ? Number(critData["critical strike chance"])
      : null;
    const cooldown = lvlData.cooldown ? Number(lvlData.cooldown) : null;
    const spiritReservation = lvlData["spirit reservation flat"]
      ? Number(lvlData["spirit reservation flat"])
      : 0;

    // Cost parsing from level 1
    let costResource = "mana";
    let costValue = 0;
    const costAmounts = lvlData["cost amounts"];
    const costTypes = lvlData["cost types"];
    if (costAmounts) {
      const amounts = Array.isArray(costAmounts) ? costAmounts : String(costAmounts).split(",");
      const types = costTypes
        ? (Array.isArray(costTypes) ? costTypes : String(costTypes).split(",")).map((t) => String(t).trim().toLowerCase())
        : ["mana"];
      costValue = Number(amounts[0]) || 0;
      costResource = types[0] && types[0].length > 0 ? types[0] : "mana";
    }
    if (spiritReservation > 0) {
      costResource = "spirit";
      costValue = spiritReservation;
    }

    // Attribute requirements from level 20 (max level for most gems)
    const intReq = Number(attrData["intelligence requirement"]) || 0;
    const strReq = Number(attrData["strength requirement"]) || 0;
    const dexReq = Number(attrData["dexterity requirement"]) || 0;

    gems.push({
      id: slug,
      slug,
      name,
      gem_type: gemType,
      tags,
      primary_attribute: primaryAttr,
      description,
      cost: { resource: costResource, base_value: costValue },
      cooldown,
      cast_time: castTime != null ? Number(castTime) : null,
      critical_chance: critChance,
      weapon_requirements: weaponReqs,
      attribute_requirements: { int: intReq, str: strReq, dex: dexReq },
      max_level: Number(maxLevel),
      per_level: { damage_multiplier: 1.0, mana_cost_multiplier: 1.0 },
      stat_text: statText,
      is_kalguuran: false,
      consumes_ward: false,
      patch_added: "0.4",
    });
  }

  for (const item of activeRaw) processGem(item, "active");
  for (const item of supportRaw) processGem(item, "support");

  gems.sort((a, b) => a.name.localeCompare(b.name));

  const activeCount = gems.filter((g) => g.gem_type === "active").length;
  const supportCount = gems.filter((g) => g.gem_type === "support").length;

  const withTags = gems.filter((g) => g.tags.length > 0).length;
  const withCrit = gems.filter((g) => g.critical_chance !== null).length;
  const withCost = gems.filter((g) => g.cost.base_value > 0).length;
  const withAttr = gems.filter((g) => g.attribute_requirements.int > 0 || g.attribute_requirements.str > 0 || g.attribute_requirements.dex > 0).length;

  console.log(`\n=== Results ===`);
  console.log(`Total: ${gems.length} gems (${activeCount} active, ${supportCount} support)`);
  console.log(`With tags: ${withTags} | With crit: ${withCrit} | With cost: ${withCost} | With attr reqs: ${withAttr}`);

  const output = {
    meta: {
      patch_version: "0.4",
      last_updated: new Date().toISOString().slice(0, 10),
      status: "current",
      source: "POE2 Wiki Cargo API (skill + skill_gems + skill_levels tables)",
      note: "Real data from POE2 Wiki. Patch 0.5 new gems will be added on launch.",
    },
    gems,
  };

  await writeFile(OUT_PATH, JSON.stringify(output, null, 2), "utf8");
  console.log(`\nWritten to ${OUT_PATH}`);
}

main().catch(console.error);
