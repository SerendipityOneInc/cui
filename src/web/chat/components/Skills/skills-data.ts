export interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompt: string;
  source: 'builtin' | 'skills.sh';
}

export const FEATURED_SKILLS: Skill[] = [
  {
    id: 'seo-optimize',
    name: 'SEO Optimize',
    icon: '🔍',
    description: 'Analyze keywords, technical SEO, and get actionable optimization reports',
    prompt: 'Help me do SEO optimization for [your website URL], analyze keywords, technical SEO, and provide an actionable report',
    source: 'builtin',
  },
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
    icon: '📊',
    description: 'Develop marketing strategies with positioning, channels, and growth tactics',
    prompt: 'Develop a marketing strategy for [your product/service], including positioning, channels, and growth tactics',
    source: 'builtin',
  },
  {
    id: 'generate-image',
    name: 'Generate Image',
    icon: '🎨',
    description: 'Generate images using AI - blog graphics, thumbnails, illustrations, and more',
    prompt: 'Use nano banana to generate an image: [describe what you want - style, mood, colors, composition]',
    source: 'builtin',
  },
  {
    id: 'create-icon',
    name: 'Create Icon',
    icon: '⭐',
    description: 'Design app icons, favicons, and UI elements',
    prompt: 'Design an app icon for [your app name/description], minimalist style',
    source: 'builtin',
  },
];

export const EXTENDED_SKILLS: Skill[] = [
  {
    id: 'write-blog',
    name: 'Write Blog',
    icon: '✍️',
    description: 'Write SEO-optimized blog posts with engaging content',
    prompt: 'Write a blog post about [your topic], optimized for the keyword [target keyword]',
    source: 'builtin',
  },
  {
    id: 'email-campaign',
    name: 'Email Campaign',
    icon: '📧',
    description: 'Create email nurture sequences and drip campaigns',
    prompt: 'Create an email nurture sequence for [your product] targeting [audience segment]',
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
