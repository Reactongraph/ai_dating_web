# Next.js 16 Dynamic Route Fix

## Issue

After upgrading to Next.js 16.0.10, the dynamic route `/collection/[id]` was returning 404 errors.

## Root Cause

**Breaking Change in Next.js 16:** The `params` prop in dynamic routes is now **asynchronous** and must be awaited.

### Before (Next.js 15):

```typescript
export default function Page({ params }: any) {
  const id = params.id; // ❌ Synchronous access
  // ...
}
```

### After (Next.js 16):

```typescript
import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { id } = use(params); // ✅ Unwrap Promise with use() hook
  // ...
}
```

## Solution Applied

Updated `/src/app/collection/[id]/page.tsx`:

1. **Imported React's `use()` hook** to unwrap the Promise
2. **Changed params type** from `any` to `Promise<{ id: string }>`
3. **Unwrapped params** using `const { id } = use(params)`
4. **Updated useMemo dependency** from `params?.id` to just `id`

## Files Changed

- ✅ `/src/app/collection/[id]/page.tsx`

## Testing

After the fix, the route should work correctly:

- ✅ `http://localhost:3000/collection/693b14f26e277b5366a0ddbb`
- ✅ Any other collection ID routes

## Additional Notes

### Other Async Request APIs in Next.js 16

The following APIs are also now asynchronous:

- `params` (in layouts, pages, route handlers)
- `searchParams` (in pages)
- `cookies()`
- `headers()`
- `draftMode()`

### For Client Components

Use React's `use()` hook to unwrap Promises:

```typescript
import { use } from 'react';

const { id } = use(params);
```

### For Server Components

Use `async/await`:

```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // ...
}
```

## References

- [Next.js 16 Async Request APIs](https://nextjs.org/docs/messages/sync-dynamic-apis)
- [React use() Hook](https://react.dev/reference/react/use)
