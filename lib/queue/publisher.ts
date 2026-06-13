import { Queue } from "bullmq";
import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL;

let scheduledQueue: Queue | null = null;
let tokenRefreshQueue: Queue | null = null;
let commentQueue: Queue | null = null;

if (redisUrl && typeof window === "undefined") {
  try {
    const connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
    });

    scheduledQueue = new Queue("post-publisher", { connection: connection as any });
    tokenRefreshQueue = new Queue("token-refresher", { connection: connection as any });
    commentQueue = new Queue("comment-processor", { connection: connection as any });

    console.log("Successfully connected to Redis & initialized BullMQ queues.");
  } catch (error) {
    console.error("Failed to initialize BullMQ queues with Redis:", error);
  }
}

/**
 * Schedules a post to be published at a specific time.
 */
export async function schedulePost(postId: string, runAt: Date): Promise<string> {
  const delay = Math.max(0, runAt.getTime() - Date.now());
  
  if (scheduledQueue) {
    try {
      const job = await scheduledQueue.add(
        "publish-post",
        { postId },
        { delay, jobId: `post_${postId}_${runAt.getTime()}` }
      );
      return job.id || `mock_job_${postId}`;
    } catch (error) {
      console.error(`Error scheduling BullMQ job for post ${postId}:`, error);
    }
  }

  console.log(`[Queue Mock] Scheduled post ${postId} in ${delay}ms (Date: ${runAt.toISOString()})`);
  return `mock_job_${postId}_${Date.now()}`;
}

/**
 * Schedules regular token refreshes for connected accounts.
 */
export async function scheduleTokenRefresh(socialAccountId: string, repeatIntervalMs: number): Promise<string> {
  if (tokenRefreshQueue) {
    try {
      const job = await tokenRefreshQueue.add(
        "refresh-token",
        { socialAccountId },
        {
          repeat: {
            every: repeatIntervalMs,
          },
          jobId: `refresh_${socialAccountId}`,
        }
      );
      return job.id || `mock_refresh_${socialAccountId}`;
    } catch (error) {
      console.error(`Error scheduling BullMQ token refresh for account ${socialAccountId}:`, error);
    }
  }

  console.log(`[Queue Mock] Scheduled token refresh for account ${socialAccountId} every ${repeatIntervalMs}ms`);
  return `mock_refresh_${socialAccountId}_${Date.now()}`;
}

/**
 * Adds an incoming comment event to the processing queue for triggering auto-replies.
 */
export async function queueCommentEvent(commentEventId: string): Promise<string> {
  if (commentQueue) {
    try {
      const job = await commentQueue.add(
        "process-comment",
        { commentEventId },
        { jobId: `comment_${commentEventId}` }
      );
      return job.id || `mock_comment_${commentEventId}`;
    } catch (error) {
      console.error(`Error scheduling BullMQ comment processing for event ${commentEventId}:`, error);
    }
  }

  console.log(`[Queue Mock] Enqueued comment event ${commentEventId} for reply evaluation`);
  return `mock_comment_${commentEventId}_${Date.now()}`;
}
