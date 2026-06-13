import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 50 }).default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  platform: varchar("platform", { length: 50 }).notNull(), // 'instagram', 'youtube', 'tiktok', 'facebook', 'linkedin', 'pinterest', 'discord', 'twitter', 'slack'
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  accountHandle: varchar("account_handle", { length: 255 }).notNull(),
  accountAvatar: text("account_avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  status: varchar("status", { length: 50 }).default("draft").notNull(), // 'draft', 'scheduled', 'published', 'failed'
  scheduledAt: timestamp("scheduled_at"),
  platforms: jsonb("platforms").$type<string[]>().notNull(), // array of platforms to publish to e.g., ["instagram", "twitter"]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postMedia = pgTable("post_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  imageKitFileId: varchar("imagekit_file_id", { length: 255 }).notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'image', 'video'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scheduledJobs = pgTable("scheduled_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  jobId: varchar("job_id", { length: 255 }).notNull(), // BullMQ job ID
  status: varchar("status", { length: 50 }).default("pending").notNull(), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const autoReplyRules = pgTable("auto_reply_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  socialAccountId: uuid("social_account_id").references(() => socialAccounts.id, { onDelete: "cascade" }).notNull(),
  triggerType: varchar("trigger_type", { length: 50 }).notNull(), // 'keyword', 'any_comment', 'first_comment'
  keywords: jsonb("keywords").$type<string[]>(),
  replyTemplate: text("reply_template"),
  useAI: boolean("use_ai").default(false).notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const commentEvents = pgTable("comment_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  socialAccountId: uuid("social_account_id").references(() => socialAccounts.id, { onDelete: "cascade" }).notNull(),
  platformCommentId: varchar("platform_comment_id", { length: 255 }).notNull(),
  platformPostId: varchar("platform_post_id", { length: 255 }).notNull(),
  commentText: text("comment_text").notNull(),
  commenterHandle: varchar("commenter_handle", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // 'pending', 'replied', 'ignored', 'failed'
  replyText: text("reply_text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  clerkSubscriptionId: varchar("clerk_subscription_id", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 50 }).notNull(),
  planId: varchar("plan_id", { length: 50 }).notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  socialAccounts: many(socialAccounts),
  posts: many(posts),
  autoReplyRules: many(autoReplyRules),
  subscriptions: many(subscriptions),
}));

export const socialAccountsRelations = relations(socialAccounts, ({ one, many }) => ({
  user: one(users, { fields: [socialAccounts.userId], references: [users.id] }),
  autoReplyRules: many(autoReplyRules),
  commentEvents: many(commentEvents),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  media: many(postMedia),
  jobs: many(scheduledJobs),
}));

export const postMediaRelations = relations(postMedia, ({ one }) => ({
  post: one(posts, { fields: [postMedia.postId], references: [posts.id] }),
}));

export const scheduledJobsRelations = relations(scheduledJobs, ({ one }) => ({
  post: one(posts, { fields: [scheduledJobs.postId], references: [posts.id] }),
}));

export const autoReplyRulesRelations = relations(autoReplyRules, ({ one }) => ({
  user: one(users, { fields: [autoReplyRules.userId], references: [users.id] }),
  socialAccount: one(socialAccounts, { fields: [autoReplyRules.socialAccountId], references: [socialAccounts.id] }),
}));

export const commentEventsRelations = relations(commentEvents, ({ one }) => ({
  socialAccount: one(socialAccounts, { fields: [commentEvents.socialAccountId], references: [socialAccounts.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));
