export interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompt: string;
  source: 'builtin' | 'skills.sh';
}

// Featured skills - shown as chips (4 items to avoid overflow)
export const FEATURED_SKILLS: Skill[] = [
  {
    id: 'generate-image',
    name: 'Generate Image',
    icon: '🎨',
    description: 'Generate images using AI - blog graphics, thumbnails, illustrations, and more',
    prompt: 'Use nano banana to generate an image: [describe what you want - style, mood, colors, composition]',
    source: 'builtin',
  },
  {
    id: 'lark-docs',
    name: 'Lark Docs',
    icon: '📚',
    description: 'Search and access Lark cloud documents, sheets, and wiki',
    prompt: '/lark-docs Search for [topic or keyword]',
    source: 'builtin',
  },
  {
    id: 'seo-optimize',
    name: 'SEO Optimize',
    icon: '🔍',
    description: 'Analyze keywords, technical SEO, and get actionable optimization reports',
    prompt: 'Help me do SEO optimization for [your website URL], analyze keywords, technical SEO, and provide an actionable report',
    source: 'builtin',
  },
  {
    id: 'create-webpage',
    name: 'Create Webpage',
    icon: '🌐',
    description: 'Create and deploy a webpage using Cloudflare Pages',
    prompt: 'Create a webpage for [describe your website] and deploy it to Cloudflare Pages',
    source: 'builtin',
  },
];

// Extended skills - shown in expanded panel
export const EXTENDED_SKILLS: Skill[] = [
  // --- SRP AllStaff ---
  {
    id: 'weekly-report',
    name: 'Weekly Report',
    icon: '📝',
    description: 'Generate weekly work report from GitHub, Linear, and Lark data',
    prompt: '/weekly-report Generate my weekly report for [this week / 2026-02-17 to 2026-02-21]',
    source: 'builtin',
  },
  {
    id: 'github-integration',
    name: 'GitHub',
    icon: '🔀',
    description: 'GitHub code review, PR management, and issue tracking',
    prompt: '/github-integration Review pull requests and issues for [owner/repo]',
    source: 'builtin',
  },
  {
    id: 'lark-messages',
    name: 'Lark Messages',
    icon: '💬',
    description: 'Access Lark group chats, read and send messages',
    prompt: '/lark-messages Send a message to [group name] saying [your message]',
    source: 'builtin',
  },
  // --- SRP Developer ---
  {
    id: 'bigquery-analyst',
    name: 'BigQuery Analyst',
    icon: '📊',
    description: 'Advanced BigQuery data analysis with SQL generation and cost control',
    prompt: '/bigquery-analyst Query [describe what data you want to analyze, e.g. user activity in the last 7 days]',
    source: 'builtin',
  },
  {
    id: 'cloudflare-workers',
    name: 'Cloudflare Workers',
    icon: '⚡',
    description: 'Build serverless edge computing applications with Cloudflare Workers',
    prompt: '/cloudflare-workers Build a Worker that [describe what it should do, e.g. proxies API requests with caching]',
    source: 'builtin',
  },
  // --- SRP DevOps ---
  {
    id: 'k8s-management',
    name: 'Kubernetes',
    icon: '☸️',
    description: 'Kubernetes cluster management, pod status, logs, and monitoring',
    prompt: '/k8s-management Check pod status and logs for [namespace/service name]',
    source: 'builtin',
  },
  {
    id: 'cloud-resources',
    name: 'Cloud Resources',
    icon: '☁️',
    description: 'GCP cloud resource management - Compute Engine, Storage, networking',
    prompt: '/cloud-resources List and check status of [Compute Engine instances / Storage buckets / network resources]',
    source: 'builtin',
  },
  // --- SRP Misc ---
  {
    id: 'misc-travel',
    name: 'Travel & Life',
    icon: '✈️',
    description: 'Train tickets (12306), flight info, Airbnb, and Rednote/Xiaohongshu',
    prompt: '/misc Search [train tickets from Beijing to Shanghai on 2026-03-01 / flights from PVG to LAX / Airbnb in Tokyo]',
    source: 'builtin',
  },
  // --- Creative ---
  {
    id: 'create-icon',
    name: 'Create Icon',
    icon: '⭐',
    description: 'Design app icons, favicons, and UI elements',
    prompt: 'Design an app icon for [your app name/description], minimalist style',
    source: 'builtin',
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    icon: '🎬',
    description: 'Create eye-catching YouTube thumbnails',
    prompt: 'Create a YouTube thumbnail for a video about [your video topic], eye-catching and bold',
    source: 'builtin',
  },
  // --- Web & Marketing ---
  {
    id: 'landing-page',
    name: 'Landing Page',
    icon: '🚀',
    description: 'Create high-converting landing pages with optimized copy and layout',
    prompt: 'Create a high-converting landing page for [your product/service], targeting [your audience]',
    source: 'builtin',
  },
  {
    id: 'marketing-strategy',
    name: 'Marketing Strategy',
    icon: '📈',
    description: 'Develop marketing strategies with positioning, channels, and growth tactics',
    prompt: 'Develop a marketing strategy for [your product/service], including positioning, channels, and growth tactics',
    source: 'builtin',
  },
  // --- Dev ---
  {
    id: 'create-diagram',
    name: 'Create Diagram',
    icon: '📐',
    description: 'Generate flowcharts, architecture diagrams, and process visualizations',
    prompt: 'Create a diagram showing [describe your flowchart/architecture/process]',
    source: 'builtin',
  },
];

export const ALL_BUILTIN_SKILLS: Skill[] = [...FEATURED_SKILLS, ...EXTENDED_SKILLS];
