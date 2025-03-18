// This is a temporary file to help identify which routes might be causing the error
// You can delete this file after fixing the issue

/*
Possible workflow-related routes:
- /api/workflows/route.ts
- /api/workflows/[id]/route.ts
- /api/workflows/[id]/execute/route.ts
- /api/workflows/templates/route.ts (if it exists)
- /api/workflows/stats/route.ts (if it exists)
*/

// Make sure all these routes use getServerSession instead of getSession
// Example:
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// 
// const session = await getServerSession(authOptions);