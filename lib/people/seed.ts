import type { Core } from "./types";

/**
 * The 16 Specialized Cores — seed data.
 * Icons are lucide-react names resolved at runtime.
 */
export const SEED_CORES: Core[] = [
  {
    id: "opium-core",
    name: "Opium Core",
    tagline: "Dark avant-garde aesthetics, subterranean fashion, and industrial minimalism.",
    description:
      "A hyper-curated space dedicated to dark ambient subcultures, industrial design, silhouette experimentation, soundscapes, and rebellious visual poetry. Opium Core studies the architecture of shadow: brutalist garments, monochrome palettes, distorted sampling, concrete interiors, and the philosophy of refusal. Members dissect runway deconstruction, underground mixtape culture, and the semiotics of opacity — treating darkness not as absence, but as a deliberate design material.",
    rules: [
      "No low-effort moodboard spam — annotate every reference with intent.",
      "Credit photographers, designers, and producers.",
      "Critique the work, never harass the creator.",
      "No fast-fashion hauls; deconstruction over consumption.",
    ],
    accent_color: "#6d778b",
    gradient: "linear-gradient(135deg, #2b313b, #6d778b)",
    layout: "grid",
    icon_name: "Moon",
  },
  {
    id: "politics-core",
    name: "Politics Core",
    tagline: "Uncensored political analysis, civic critique, and governance discourse.",
    description:
      "A fearless forum for dismantling systemic propaganda, dissecting policy, scrutinizing leadership, and proposing radical democratic transparency. Politics Core demands receipts: primary sources, voting records, budget lines, and constitutional clauses. From municipal councils to supranational blocs, the goal is civic literacy — converting outrage into oversight, and spectators into auditors of power.",
    rules: [
      "Cite sources for factual claims; screenshots need links.",
      "No ethnic or religious slurs — attack policies, not peoples.",
      "Distinguish opinion from reporting.",
      "No campaign spam or astroturfing.",
    ],
    accent_color: "#8b97ad",
    gradient: "linear-gradient(135deg, #4f5869, #8b97ad)",
    layout: "compact",
    icon_name: "Landmark",
  },
  {
    id: "religion-core",
    name: "Religion Core",
    tagline: "Theological deconstruction, spiritual inquiry, and existential doctrine.",
    description:
      "An intellectual sanctuary for questioning dogma, analyzing ancient texts, exploring faith, secularism, and spiritual liberation without fear of ostracization. Religion Core reads scripture in context — philology, archaeology, hermeneutics — alongside lived experience: deconstruction testimonies, interfaith dialogue, mysticism, ritual studies, and the ethics of belief in plural societies.",
    rules: [
      "No blasphemy-baiting or proselytizing raids.",
      "Treat sacred texts and sincere doubt with equal rigor.",
      "Academic tone: argue exegesis, not identity.",
      "No doom prophecy or miracle-sale scams.",
    ],
    accent_color: "#6d778b",
    gradient: "linear-gradient(135deg, #3d444f, #8b97ad)",
    layout: "grid",
    icon_name: "BookOpen",
  },
  {
    id: "feminism-core",
    name: "Feminism Core",
    tagline: "Autonomy, equality, structural critique, and women's liberation.",
    description:
      "Dedicated to dismantling patriarchal power structures, advancing body autonomy, economic self-determination, and intersectional gender equity. Feminism Core centers material analysis — wage gaps, care labor, reproductive law, land rights, safety infrastructure — while archiving feminist literature, movement history, and strategies for mutual aid. All genders welcome to learn; women's voices lead.",
    rules: [
      "Center women's lived experience; no sealioning.",
      "No misogyny, victim-blaming, or body-shaming.",
      "Intersectionality is non-negotiable.",
      "Share resources, not just outrage.",
    ],
    accent_color: "#8b97ad",
    gradient: "linear-gradient(135deg, #6d778b, #c3cad5)",
    layout: "grid",
    icon_name: "Venus",
  },
  {
    id: "race-core",
    name: "Race Core",
    tagline: "Post-colonial studies, racial identity, systemic bias, and global pan-Africanism.",
    description:
      "An analytical space probing historical racial constructs, institutional racism, pan-African solidarity, and social justice. Race Core traces the colonial archive — redlining maps, extraction economies, carceral data — and the counter-archive: Negritude, Black radical tradition, decolonial theory, and contemporary reparations policy. Precision over provocation; history over hot takes.",
    rules: [
      "No racial slurs or biological essentialism.",
      "Peer-reviewed or primary sources preferred for historical claims.",
      "No trauma-dumping without content warnings.",
      "Amplify, don't speak over, affected communities.",
    ],
    accent_color: "#4f5869",
    gradient: "linear-gradient(135deg, #0f1319, #6d778b)",
    layout: "compact",
    icon_name: "Globe",
  },
  {
    id: "egalitarian-core",
    name: "Egalitarian Core",
    tagline: "Equal rights, class consciousness, and universal human dignity.",
    description:
      "Advocating for the total elimination of class exploitation, systemic privilege, inequality, and institutional disenfranchisement. Egalitarian Core maps how wealth compounds and precarity replicates — labor law, housing, healthcare access, tax justice, disability rights — and prototypes alternatives: cooperatives, commons governance, and universal basic infrastructures. Dignity is the baseline, not the reward.",
    rules: [
      "No classist contempt or poverty-shaming.",
      "Proposals must consider the most precarious first.",
      "Data over anecdote when debating systems.",
      "No partisan campaign material.",
    ],
    accent_color: "#6d778b",
    gradient: "linear-gradient(135deg, #4f5869, #a3adbf)",
    layout: "grid",
    icon_name: "Scale",
  },
  {
    id: "renaissance-core",
    name: "Renaissance Core",
    tagline: "Blueprint for structural change, national transformation, and civic awakening in Nigeria.",
    description:
      "An actionable think-tank devoted to reinventing Nigerian infrastructure, judicial reform, economic sovereignty, youth empowerment, and socio-political renewal. Renaissance Core rejects lament without ledger: power-grid diagnostics, rail and port logistics, naira monetary mechanics, constitutional amendment paths, and state-by-state development scorecards. Every critique must carry a costed alternative.",
    rules: [
      "Nigeria-first, tribe-last: no ethnic bigotry.",
      "Every problem post should propose a mechanism.",
      "Verify statistics with NBS, CBN, or equivalent sources.",
      "No praise-singing of politicians without records.",
    ],
    accent_color: "#8b97ad",
    gradient: "linear-gradient(135deg, #272c34, #8b97ad)",
    layout: "grid",
    icon_name: "Sunrise",
  },
  {
    id: "lgbtq-core",
    name: "LGBTQ+ Core",
    tagline: "Queer expression, identity rights, safety, and community solidarity.",
    description:
      "A safe, pseudonymous sanctuary for gender diversity, sexual orientation freedom, support systems, and advocacy. LGBTQ+ Core prioritizes safety by design: no outing, no location doxxing, strict confidentiality. Inside, members share coming-out strategies, legal-rights explainers by jurisdiction, queer theory, health resources, art, and joy — because survival includes celebration.",
    rules: [
      "Absolute zero tolerance for homophobia or transphobia.",
      "Never out anyone or request identifying details.",
      "Content warnings on sensitive trauma topics.",
      "No fetishizing or invasive curiosity.",
    ],
    accent_color: "#a3adbf",
    gradient: "linear-gradient(135deg, #6d778b, #e2e6ec)",
    layout: "grid",
    icon_name: "Rainbow",
  },
  {
    id: "fashion-core",
    name: "Fashion Core",
    tagline: "Sartorial theory, textile art, streetwear, and subculture identity.",
    description:
      "Exploring garment design, sustainable style, cultural attire, runway critiques, and individual self-expression through attire. Fashion Core treats clothing as text: pattern-drafting, fabric science, dye chemistry, tailoring lineages from Aso-Ebi to techwear. Fit checks require construction notes — what works, what drapes, what fails — so taste becomes teachable.",
    rules: [
      "Include garment details (fabric, fit, maker) on fit posts.",
      "No counterfeit promotion.",
      "Respect cultural garments; no costume mockery.",
      "Sustainable critique over brand worship.",
    ],
    accent_color: "#8b97ad",
    gradient: "linear-gradient(135deg, #3d444f, #c3cad5)",
    layout: "grid",
    icon_name: "Shirt",
  },
  {
    id: "philosophy-core",
    name: "Philosophy Core",
    tagline: "Epistemology, metaphysics, ethics, and rigorous intellectual inquiry.",
    description:
      "A domain for debating existentialism, stoicism, morality, consciousness, and the foundational frameworks of human thought. Philosophy Core enforces the principle of charity: steelman before you strike. Syllogisms, thought experiments, primary-text reading groups, and philosophy of technology all belong — from pre-Socratics to predictive processing.",
    rules: [
      "Steelman opposing views before rebuttal.",
      "Cite the text: edition, section, or paragraph.",
      "No pseudo-profundity without argument.",
      "Stay on the thesis; no ad hominem.",
    ],
    accent_color: "#6d778b",
    gradient: "linear-gradient(135deg, #0a0c10, #4f5869)",
    layout: "compact",
    icon_name: "Brain",
  },
  {
    id: "critical-thinking-core",
    name: "Critical Thinking Core",
    tagline: "Logic, cognitive fallacies, media literacy, and empirical reasoning.",
    description:
      "Sharp intellectual dissection aimed at spotting disinformation, logical fallacies, emotional manipulation, and cognitive bias in public discourse. Critical Thinking Core runs fallacy autopsies on viral posts, reverse-image searches, statistical literacy drills, and Bayesian reasoning exercises. The enemy is not error — it is confident, weaponized error.",
    rules: [
      "Name the fallacy and show your work.",
      "Link original sources, not screenshots alone.",
      "Update publicly when proven wrong — steel credibility.",
      "No conspiracism without falsifiable evidence.",
    ],
    accent_color: "#4f5869",
    gradient: "linear-gradient(135deg, #272c34, #6d778b)",
    layout: "compact",
    icon_name: "Microscope",
  },
  {
    id: "movies-core",
    name: "Movies Core",
    tagline: "Cinematic critique, auteur cinema, narrative analysis, and film theory.",
    description:
      "In-depth discussion on cinematography, narrative structures, directorial visions, and the cultural impact of cinema. Movies Core reads films as systems: lensing, blocking, sound design, editing rhythms, and production economics. Spoiler discipline is sacred; craft analysis outranks star gossip. Nollywood to arthouse — every frame budget is a moral choice.",
    rules: [
      "Spoiler tags for films under 2 years old.",
      "No piracy links; discuss legal access.",
      "Critique craft, not just plot.",
      "No review-bombing campaigns.",
    ],
    accent_color: "#8b97ad",
    gradient: "linear-gradient(135deg, #0f1319, #8b97ad)",
    layout: "grid",
    icon_name: "Clapperboard",
  },
  {
    id: "series-core",
    name: "Series Core",
    tagline: "Serialized storytelling, television drama, world-building, and episode breakdowns.",
    description:
      "Analyzing episodic storytelling, character trajectories, writing rooms, and television culture. Series Core tracks season arcs, showrunner signatures, bottle-episode economics, and the streaming-era attention contract. Episode threads open on air-dates; finale etiquette is enforced so late watchers survive.",
    rules: [
      "Episode-tag spoilers strictly.",
      "No leaks of unreleased episodes.",
      "Separate actor from character in critique.",
      "K-drama, anime series cross-posts welcome with tags.",
    ],
    accent_color: "#6d778b",
    gradient: "linear-gradient(135deg, #3d444f, #6d778b)",
    layout: "grid",
    icon_name: "Tv",
  },
  {
    id: "life-core",
    name: "Life Core",
    tagline: "Realities, personal confessions, mental endurance, and everyday truths.",
    description:
      "An unfiltered space for sharing raw human experiences, mental health struggles, life lessons, financial survival, and personal growth. Life Core is moderated for gentleness: confessions receive counsel, not contempt. Debt diaries, grief journals, job-loss recoveries, and small victories all count as data about being human under pressure.",
    rules: [
      "Radical kindness: no mocking vulnerability.",
      "No medical diagnosis; share experience, suggest professionals.",
      "Content warnings for self-harm, abuse, loss.",
      "No financial scams or begging links.",
    ],
    accent_color: "#a3adbf",
    gradient: "linear-gradient(135deg, #4f5869, #c3cad5)",
    layout: "compact",
    icon_name: "Heart",
  },
  {
    id: "cartoon-core",
    name: "Cartoon Core",
    tagline: "Animation history, subversion in visual storytelling, and classic nostalgia.",
    description:
      "Celebrating western animation, satirical cartoons, character design, and the artistic evolution of animated media. Cartoon Core archives Saturday-morning semiotics: from Fleischer squash-and-stretch to Cartoon Network's creator-driven renaissance. Members storyboard gags, analyze voice direction, and map how children's media smuggles adult critique.",
    rules: [
      "Credit studios, boards artists, and voice actors.",
      "Nostalgia welcome, but add analysis.",
      "No full-episode re-uploads.",
      "Keep kids'-show critique age-aware.",
    ],
    accent_color: "#8b97ad",
    gradient: "linear-gradient(135deg, #272c34, #a3adbf)",
    layout: "grid",
    icon_name: "Palette",
  },
  {
    id: "anime-core",
    name: "Anime Core",
    tagline: "Otaku subculture, animation craft, manga discourse, and thematic breakdowns.",
    description:
      "Deep-dive discussions on anime series, manga lore, studio animation techniques, and philosophical themes in Japanese animation. Anime Core studies sakuga cuts, production-committee economics, manga paneling, and the metaphysics inside mecha, isekai, and slice-of-life. Seasonal charts, studio spotlights, and spoiler-tiered threads keep the watch order sane.",
    rules: [
      "Spoiler-tier your posts (anime-only vs manga-reader).",
      "No pirate-site links; use legal source names.",
      "Sakuga clips need animator/studio credit when known.",
      "Respect sub vs dub preferences.",
    ],
    accent_color: "#6d778b",
    gradient: "linear-gradient(135deg, #0a0c10, #8b97ad)",
    layout: "grid",
    icon_name: "Sparkles",
  },
];
