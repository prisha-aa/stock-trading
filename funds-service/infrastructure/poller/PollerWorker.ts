import { and, eq, inArray, is, isNull, lt, or, sql } from "drizzle-orm";
import { outbox } from "../db/schema";
import { db } from "../db/db";
import { publishEventsToSNS } from "../messaging/snsPublisher";



const BATCH_SIZE = 1000;
const LOCK_TIMEOUT_MS = 60_000*4;

export async function pollAndPublishBatch(pollerId:string){
    const now=new Date();
    const timeoutThreshold=new Date(now.getTime()+LOCK_TIMEOUT_MS);
    const lockedEvents = await db.transaction(async (tx) => {
  const result = await tx.execute(sql`
    SELECT * FROM outbox
    WHERE status = 'pending'
      AND (
        locked_at IS NULL
        OR locked_at < ${timeoutThreshold}
      )
    ORDER BY created_at
    LIMIT ${BATCH_SIZE}
    FOR UPDATE SKIP LOCKED
  `);

  const rows = result.rows;
  if (rows.length === 0) return [];

  // Cast each id as string explicitly so TypeScript is happy
  const ids = rows.map((e) => e.id as string);

  await tx.update(outbox)
    .set({ lockedAt: now, lockedBy: pollerId })
    .where(inArray(outbox.id, ids as readonly string[]));

  return rows;
});


  if (lockedEvents.length === 0) return;
  await publishEventsToSNS(lockedEvents);
  const ids = lockedEvents.map(e => e.id) as string[];


await db.execute(sql`
  UPDATE outbox
  SET status = 'published',
      published_at = ${new Date()},
      locked_at = NULL,
      locked_by = NULL
  WHERE id = ANY(${sql.raw(`ARRAY[${ids.map(id => `'${id}'`).join(', ')}]::uuid[]`)})
`);



}



// import { and, eq, inArray, is, isNull, lt, or, sql } from "drizzle-orm";
// import { outbox } from "../db/schema";
// import { db } from "../db/db";
// import { publishEventsToSNS } from "../messaging/snsPublisher";

// const BATCH_SIZE = 1000;
// const LOCK_TIMEOUT_MS = 60_000;

// export async function pollAndPublishBatch(pollerId: string) {
//   const now = new Date();
//   const timeoutThreshold = new Date(now.getTime() - LOCK_TIMEOUT_MS); // Note: timeout should be past, not future

//   const lockedEvents = await db.transaction(async (tx) => {
//     const result = await tx.execute(sql`
//       SELECT * FROM outbox
//       WHERE status = 'pending'
//         AND (
//           locked_at IS NULL
//           OR locked_at < ${timeoutThreshold}
//         )
//       ORDER BY created_at
//       LIMIT ${BATCH_SIZE}
//       FOR UPDATE SKIP LOCKED
//     `);

//     const rows = result.rows;
//     if (rows.length === 0) return [];

//     const ids = rows.map((e) => e.id as string);

//     await tx.update(outbox)
//       .set({ lockedAt: now, lockedBy: pollerId })
//       .where(inArray(outbox.id, ids as readonly string[]));

//     return rows;
//   });

//   if (lockedEvents.length === 0) return;

//   await publishEventsToSNS(lockedEvents);

//   const ids = lockedEvents.map(e => e.id);

//   await db.execute(
//     `UPDATE outbox
//      SET status = 'published',
//          published_at = $1,
//          locked_at = NULL,
//          locked_by = NULL
//      WHERE id = ANY($2::uuid[])`,
//     [new Date(), ids]
//   );
// }

// import { and, eq, inArray, isNull, lt, or } from "drizzle-orm";
// import { outbox } from "../db/schema";
// import { db } from "../db/db";
// import { publishEventsToSNS } from "../messaging/snsPublisher";

// const BATCH_SIZE = 1000;
// const LOCK_TIMEOUT_MS = 60_000;

// export async function pollAndPublishBatch(pollerId: string) {
//   const now = new Date();
//   // timeoutThreshold is "now minus lock timeout" to unlock stale locks
//   const timeoutThreshold = new Date(now.getTime() - LOCK_TIMEOUT_MS);

//   const lockedEvents = await db.transaction(async (tx) => {
//     // 1. Select events that are pending and either unlocked or locked too long
//     const events = await tx
//       .select()
//       .from(outbox)
//       .where(
//         and(
//           eq(outbox.status, "pending"),
//           or(isNull(outbox.lockedAt), lt(outbox.lockedAt, timeoutThreshold))
//         )
//       )
//       .limit(BATCH_SIZE);
//     if (events.length === 0) {
//       return [];
//     }

//     // 2. Extract ids of selected events
//     const ids = events.map((e) => e.id);

//     // 3. Update lockedAt and lockedBy on all selected ids using raw SQL and single array param
//     await tx.execute(
//       `UPDATE outbox
//        SET locked_at = $1, locked_by = $2
//        WHERE id = ANY($3::uuid[])`,
//       [now, pollerId, ids]
//     );

//     // 4. Return events after locking
//     return events;
//   });

//   if (lockedEvents.length === 0) return;

//   // 5. Publish locked events to SNS
//   await publishEventsToSNS(lockedEvents);

//   // 6. Mark events as published and clear locks
//   const idsToMark = lockedEvents.map((e) => e.id);
//   await db
//     .update(outbox)
//     .set({
//       status: "published",
//       publishedAt: new Date(),
//       lockedAt: null,
//       lockedBy: null,
//     })
//     .where(inArray(outbox.id, idsToMark));
// }

// import { and, eq, inArray, is, isNull, lt, or, sql } from "drizzle-orm";
// import { outbox } from "../db/schema";
// import { db } from "../db/db";
// import { publishEventsToSNS } from "../messaging/snsPublisher";

// const BATCH_SIZE = 1000;
// const LOCK_TIMEOUT_MS = 60_000;

// export async function pollAndPublishBatch(pollerId: string) {
//   const now = new Date();
//   const timeoutThreshold = new Date(now.getTime() + LOCK_TIMEOUT_MS);

//   const lockedEvents = await db.transaction(async (tx) => {
//     const result = await tx.execute(sql`
//       SELECT * FROM outbox
//       WHERE status = 'pending'
//         AND (
//           locked_at IS NULL
//           OR locked_at < ${timeoutThreshold}
//         )
//       ORDER BY created_at
//       LIMIT ${BATCH_SIZE}
//       FOR UPDATE SKIP LOCKED
//     `);

//     const rows = result.rows;
//     if (rows.length === 0) return [];

//     const ids = rows.map((e) => e.id as string);

//     await tx.update(outbox)
//       .set({ lockedAt: now, lockedBy: pollerId })
//       .where(inArray(outbox.id, ids));

//     return rows;
//   });

//   if (lockedEvents.length === 0) return;

//   await publishEventsToSNS(lockedEvents);

//   const ids = lockedEvents.map((e) => e.id);

//   await db.execute(sql`
//     UPDATE outbox
//     SET status = 'published',
//         published_at = ${new Date()},
//         locked_at = NULL,
//         locked_by = NULL
//     WHERE id = ANY(${sql.array(ids, 'uuid')})
//   `);
// }
