# Goal: AI Summary Feature

## Problem

Readers want a quick summary of blog post content without reading the entire article. The post page lacks an AI-powered summary feature.

## Outcome

- Users can click "AI Summary" in the floating menu to generate an AI summary of the current post
- Summary displays in a floating popup with chatbot-style UI
- Summary is cached for faster repeat access

## Scope

### In Scope
1. Add AI SDK and OpenAI provider integration
2. Add summary server action to fetch post from Notion and generate 1-3 paragraph summary
3. Add caching with Vercel KV
4. Add triggering mechanism (menu item in FloatingButtonGroup, only on post page)
5. Add floating popup component for summary display
6. Handle loading state (spinner) and error state (retry button)

### Out of Scope
- Summary editing/regeneration
- Multiple language support
- Mobile-native UI (falls back gracefully)
- Summary analytics/tracking

## Dependencies
- OpenAI API key (for AI SDK)
- Vercel KV (for caching)

## Success Criteria
1. Clicking "AI Summary" triggers summary generation
2. Summary displays 1-3 paragraphs in Thai language in floating popup
3. Repeated views load from cache
4. Error state shows with retry button
5. Loading state shows spinner