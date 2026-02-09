# Skill Shortcuts Feature Design

## Overview
Add quick-action skill shortcuts below the input box on the Home page, allowing users to quickly start common tasks. Includes a "More" button to browse and search the full skill library from skills.sh.

## Curated Skills (Default Display)

| ID | Name | Icon | Template Prompt |
|----|------|------|----------------|
| seo-optimize | SEO Optimize | 🔍 | `Help me do SEO optimization for [your website URL], analyze keywords, technical SEO, and provide an actionable report` |
| landing-page | Landing Page | 🚀 | `Create a high-converting landing page for [your product/service], targeting [your audience]` |
| marketing-strategy | Marketing Strategy | 📊 | `Develop a marketing strategy for [your product/service], including positioning, channels, and growth tactics` |
| generate-image | Generate Image | 🎨 | `Generate an image: [describe what you want - style, mood, colors, composition]` |
| create-icon | Create Icon | ⭐ | `Design an app icon for [your app name/description], minimalist style` |

## Extended Skills (in "More" Modal)

| ID | Name | Icon | Template Prompt |
|----|------|------|----------------|
| write-blog | Write Blog | ✍️ | `Write a blog post about [your topic], optimized for the keyword [target keyword]` |
| email-campaign | Email Campaign | 📧 | `Create an email nurture sequence for [your product] targeting [audience segment]` |
| youtube-thumbnail | YouTube Thumbnail | 🎬 | `Create a YouTube thumbnail for a video about [your video topic], eye-catching and bold` |
| create-diagram | Create Diagram | 📐 | `Create a diagram showing [describe your flowchart/architecture/process]` |

## Data Model

```typescript
interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompt: string;
  source: 'builtin' | 'skills.sh';
}
```

## UI Layout

```
┌─────────────────────────────────────────────┐
│  Describe your task                         │
│  📁 github/cui  🤖 Default     🎤  Ask ▾   │
└─────────────────────────────────────────────┘

 🔍 SEO Optimize  🚀 Landing Page  📊 Marketing Strategy  🎨 Generate Image  ⭐ Create Icon  ⊕ More

 ┌─ Tasks ─── History ─── Archive ────────────┐
```

### "More" Modal

```
┌──────────────────────────────────────────────┐
│  Skill Library                          ✕    │
│  ┌────────────────────────────────────────┐  │
│  │ 🔍 Search skills...                   │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Featured                                    │
│  [🔍 SEO] [🚀 Landing Page] [📊 Strategy]   │
│  [🎨 Image] [⭐ Icon] [✍️ Blog] [📧 Email]  │
│  [🎬 Thumbnail] [📐 Diagram]                │
│                                              │
│  ── Search Results ──────────────────────    │
│  (shows when user types in search box,       │
│   results from skills.sh API)                │
└──────────────────────────────────────────────┘
```

## Interaction Flow

1. User clicks a skill chip or card in Modal
2. Composer input fills with skill.prompt template
3. Cursor positions at first `[placeholder]`
4. Modal closes (if opened from Modal)
5. User edits the prompt, then submits
6. Normal `startConversation` flow proceeds

## New Components

| Component | Path | Responsibility |
|-----------|------|---------------|
| SkillChips | `src/web/chat/components/Skills/SkillChips.tsx` | Curated skill buttons row |
| SkillLibraryModal | `src/web/chat/components/Skills/SkillLibraryModal.tsx` | Full skill browser with search |
| SkillCard | `src/web/chat/components/Skills/SkillCard.tsx` | Individual skill card in Modal |
| skills-data | `src/web/chat/components/Skills/skills-data.ts` | Hardcoded skill definitions |

## Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/skills/search?q=keyword` | GET | Proxy to skills.sh for skill search |

## File Changes

- New: `src/web/chat/components/Skills/SkillChips.tsx`
- New: `src/web/chat/components/Skills/SkillLibraryModal.tsx`
- New: `src/web/chat/components/Skills/SkillCard.tsx`
- New: `src/web/chat/components/Skills/skills-data.ts`
- New: `src/routes/skills.ts`
- New: `src/web/chat/services/skills-api.ts`
- Modified: `src/web/chat/components/Home/Home.tsx` — insert SkillChips
- Modified: `src/web/chat/components/Composer/Composer.tsx` — expose `setInput()` method
- Modified: `src/routes/index.ts` — register skills route
