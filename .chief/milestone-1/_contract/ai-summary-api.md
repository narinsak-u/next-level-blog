# Contract: AI Summary API

## Server Action: generateSummary

### Input
```typescript
{
  slug: string;  // post slug from URL
}
```

### Output
```typescript
{
  success: true;
  summary: string;  // 1-3 paragraphs in Thai
} | {
  success: false;
  error: string;  // error message
}
```

### Behavior
1. Check KV cache for `summary:{slug}` key
2. If cached, return cached summary
3. If not cached:
   a. Fetch post content via `fetchPostContent(slug)` from Notion
   b. Extract text content from Notion blocks
   c. Send to OpenAI gpt-4o-mini with prompt: "Summarize in 1-3 paragraphs in Thai"
   d. Cache result in KV with key `summary:{slug}`
   e. Return summary

### Error Handling
- Network/API errors → return `{ success: false, error: "..." }`
- OpenAI errors → return `{ success: false, error: "..." }`
- Notion fetch errors → return `{ success: false, error: "..." }`

### Caching
- Key: `summary:{slug}`
- TTL: 7 days (604800 seconds)