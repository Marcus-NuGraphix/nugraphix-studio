CREATE TYPE "public"."contact_submission_status" AS ENUM('new', 'contacted', 'qualified', 'proposal', 'closed-won', 'closed-lost');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."email_event_type" AS ENUM('email.sent', 'email.scheduled', 'email.delivered', 'email.delivery_delayed', 'email.complained', 'email.bounced', 'email.opened', 'email.clicked', 'email.failed', 'email.suppressed');--> statement-breakpoint
CREATE TYPE "public"."email_message_status" AS ENUM('queued', 'sent', 'failed', 'delivered', 'bounced', 'complained', 'opened', 'clicked', 'suppressed');--> statement-breakpoint
CREATE TYPE "public"."email_message_type" AS ENUM('transactional', 'editorial', 'system');--> statement-breakpoint
CREATE TYPE "public"."email_provider" AS ENUM('noop', 'resend');--> statement-breakpoint
CREATE TYPE "public"."email_subscription_status" AS ENUM('subscribed', 'unsubscribed');--> statement-breakpoint
CREATE TYPE "public"."email_topic" AS ENUM('blog', 'press', 'product', 'security', 'account', 'contact');--> statement-breakpoint
CREATE TYPE "public"."media_asset_type" AS ENUM('image', 'document', 'video', 'audio', 'other');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."user_audit_action" AS ENUM('user-created', 'profile-updated', 'password-changed', 'role-updated', 'status-suspended', 'status-reactivated', 'sessions-revoked', 'session-revoked', 'account-deleted');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_security_event_type" AS ENUM('login-success', 'password-changed', 'sessions-revoked', 'session-revoked');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended', 'invited');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limit" (
	"id" text NOT NULL,
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"last_request" bigint NOT NULL,
	CONSTRAINT "rate_limit_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	"suspended_at" timestamp with time zone,
	"suspended_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_audit_event" (
	"id" text PRIMARY KEY NOT NULL,
	"action" "user_audit_action" NOT NULL,
	"actor_user_id" text,
	"actor_email" text,
	"target_user_id" text,
	"target_email" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_security_event" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"type" "user_security_event_type" NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"excerpt" text,
	"cover_image" text,
	"meta_title" text,
	"meta_description" text,
	"canonical_url" text,
	"reading_time_minutes" integer DEFAULT 1 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"is_breaking" boolean DEFAULT false NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"author_id" text NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_slug_unique" UNIQUE("slug"),
	CONSTRAINT "post_published_at_required_for_published_chk" CHECK ("post"."status" <> 'published' OR "post"."published_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "post_category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"parent_category_id" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "post_tag" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_tag_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "post_category_to_post" (
	"post_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "post_category_to_post_post_id_category_id_pk" PRIMARY KEY("post_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "post_tag_to_post" (
	"post_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "post_tag_to_post_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "press_release" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"summary" text,
	"cover_image" text,
	"meta_title" text,
	"meta_description" text,
	"canonical_url" text,
	"social_image" text,
	"pdf_url" text,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"author_id" text NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "press_release_slug_unique" UNIQUE("slug"),
	CONSTRAINT "press_release_published_at_required_for_published_chk" CHECK ("press_release"."status" <> 'published' OR "press_release"."published_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "press_release_to_media_asset" (
	"press_release_id" text NOT NULL,
	"media_asset_id" text NOT NULL,
	"role" text DEFAULT 'attachment' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "press_release_to_media_asset_pk" PRIMARY KEY("press_release_id","media_asset_id")
);
--> statement-breakpoint
CREATE TABLE "content_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"slug" text,
	"route_path" text NOT NULL,
	"template_key" text NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"canonical_url" text,
	"og_title" text,
	"og_description" text,
	"og_image" text,
	"twitter_title" text,
	"twitter_description" text,
	"twitter_image" text,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_entry_route_path_unique" UNIQUE("route_path")
);
--> statement-breakpoint
CREATE TABLE "content_publication" (
	"entry_id" text PRIMARY KEY NOT NULL,
	"published_revision_id" text,
	"published_at" timestamp with time zone,
	"scheduled_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_revision" (
	"id" text PRIMARY KEY NOT NULL,
	"entry_id" text NOT NULL,
	"version" integer NOT NULL,
	"payload" jsonb NOT NULL,
	"change_summary" text,
	"changed_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_preference" (
	"user_id" text PRIMARY KEY NOT NULL,
	"transactional_enabled" boolean DEFAULT true NOT NULL,
	"editorial_enabled" boolean DEFAULT true NOT NULL,
	"blog_updates_enabled" boolean DEFAULT true NOT NULL,
	"press_updates_enabled" boolean DEFAULT true NOT NULL,
	"product_updates_enabled" boolean DEFAULT false NOT NULL,
	"security_alerts_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"email" text NOT NULL,
	"topic" "email_topic" NOT NULL,
	"status" "email_subscription_status" DEFAULT 'subscribed' NOT NULL,
	"source" text DEFAULT 'public' NOT NULL,
	"unsubscribe_token" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "email_subscription_unsubscribe_token_unique" UNIQUE("unsubscribe_token"),
	CONSTRAINT "email_subscription_unsubscribed_state_chk" CHECK ("email_subscription"."unsubscribed_at" IS NULL OR "email_subscription"."status" = 'unsubscribed')
);
--> statement-breakpoint
CREATE TABLE "email_message" (
	"id" text PRIMARY KEY NOT NULL,
	"to_email" text NOT NULL,
	"to_user_id" text,
	"provider" "email_provider" DEFAULT 'noop' NOT NULL,
	"template_key" text NOT NULL,
	"message_type" "email_message_type" DEFAULT 'system' NOT NULL,
	"topic" "email_topic",
	"status" "email_message_status" DEFAULT 'queued' NOT NULL,
	"subject" text NOT NULL,
	"from_email" text NOT NULL,
	"reply_to" text,
	"html" text NOT NULL,
	"text_body" text NOT NULL,
	"provider_message_id" text,
	"correlation_key" text,
	"idempotency_key" text,
	"error_message" text,
	"attempts" integer DEFAULT 0 NOT NULL,
	"scheduled_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "email_message_idempotency_key_unique" UNIQUE("idempotency_key"),
	CONSTRAINT "email_message_attempts_non_negative_chk" CHECK ("email_message"."attempts" >= 0)
);
--> statement-breakpoint
CREATE TABLE "email_event" (
	"id" text PRIMARY KEY NOT NULL,
	"message_id" text,
	"type" "email_event_type" NOT NULL,
	"provider_event_id" text,
	"email" text,
	"occurred_at" timestamp with time zone,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_asset" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"url" text NOT NULL,
	"type" "media_asset_type" DEFAULT 'other' NOT NULL,
	"mime_type" text NOT NULL,
	"file_name" text NOT NULL,
	"size_bytes" bigint NOT NULL,
	"width" integer,
	"height" integer,
	"duration_seconds" integer,
	"preview_url" text,
	"thumbnail_url" text,
	"alt_text" text,
	"uploaded_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_asset_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "contact_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"suburb" text NOT NULL,
	"service_interest" text NOT NULL,
	"property_type" text NOT NULL,
	"urgency" text NOT NULL,
	"preferred_contact_method" text NOT NULL,
	"best_contact_time" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"source_path" text NOT NULL,
	"status" "contact_submission_status" DEFAULT 'new' NOT NULL,
	"notes" text,
	"assigned_to" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users'
  ) THEN
    INSERT INTO "user" (
      "id",
      "name",
      "email",
      "email_verified",
      "role",
      "status",
      "created_at",
      "updated_at"
    )
    SELECT
      "id"::text,
      COALESCE(NULLIF(split_part("email", '@', 1), ''), 'legacy-user'),
      "email",
      true,
      CASE
        WHEN lower(COALESCE("role", 'user')) = 'admin' THEN 'admin'::user_role
        ELSE 'user'::user_role
      END,
      'active'::user_status,
      "created_at"::timestamp with time zone,
      COALESCE("created_at"::timestamp with time zone, now())
    FROM "users"
    ON CONFLICT ("email") DO NOTHING;

    DROP TABLE "users";
  END IF;
END
$$;
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_audit_event" ADD CONSTRAINT "user_audit_event_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_audit_event" ADD CONSTRAINT "user_audit_event_target_user_id_user_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_security_event" ADD CONSTRAINT "user_security_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_category_to_post" ADD CONSTRAINT "post_category_to_post_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_category_to_post" ADD CONSTRAINT "post_category_to_post_category_id_post_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tag_to_post" ADD CONSTRAINT "post_tag_to_post_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tag_to_post" ADD CONSTRAINT "post_tag_to_post_tag_id_post_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."post_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "press_release" ADD CONSTRAINT "press_release_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "press_release_to_media_asset" ADD CONSTRAINT "press_release_to_media_asset_press_release_id_press_release_id_fk" FOREIGN KEY ("press_release_id") REFERENCES "public"."press_release"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "press_release_to_media_asset" ADD CONSTRAINT "press_release_to_media_asset_media_asset_id_media_asset_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_entry" ADD CONSTRAINT "content_entry_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_entry" ADD CONSTRAINT "content_entry_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_publication" ADD CONSTRAINT "content_publication_entry_id_content_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."content_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_publication" ADD CONSTRAINT "content_publication_published_revision_id_content_revision_id_fk" FOREIGN KEY ("published_revision_id") REFERENCES "public"."content_revision"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_revision" ADD CONSTRAINT "content_revision_entry_id_content_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."content_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_revision" ADD CONSTRAINT "content_revision_changed_by_user_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_preference" ADD CONSTRAINT "email_preference_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_subscription" ADD CONSTRAINT "email_subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_message" ADD CONSTRAINT "email_message_to_user_id_user_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_event" ADD CONSTRAINT "email_event_message_id_email_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."email_message"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_asset" ADD CONSTRAINT "media_asset_uploaded_by_id_user_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_submission" ADD CONSTRAINT "contact_submission_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "rate_limit_last_request_idx" ON "rate_limit" USING btree ("last_request");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_status_idx" ON "user" USING btree ("status");--> statement-breakpoint
CREATE INDEX "user_created_at_idx" ON "user" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "user_audit_event_action_idx" ON "user_audit_event" USING btree ("action");--> statement-breakpoint
CREATE INDEX "user_audit_event_actor_idx" ON "user_audit_event" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "user_audit_event_target_idx" ON "user_audit_event" USING btree ("target_user_id");--> statement-breakpoint
CREATE INDEX "user_audit_event_created_at_idx" ON "user_audit_event" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_security_event_user_idx" ON "user_security_event" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_security_event_type_idx" ON "user_security_event" USING btree ("type");--> statement-breakpoint
CREATE INDEX "user_security_event_created_at_idx" ON "user_security_event" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "post_slug_idx" ON "post" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "post_authorId_idx" ON "post" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "post_status_idx" ON "post" USING btree ("status");--> statement-breakpoint
CREATE INDEX "post_publishedAt_idx" ON "post" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "post_updatedAt_idx" ON "post" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "post_status_publishedAt_idx" ON "post" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "post_featured_publishedAt_idx" ON "post" USING btree ("featured","published_at");--> statement-breakpoint
CREATE INDEX "post_category_slug_idx" ON "post_category" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "post_category_parent_idx" ON "post_category" USING btree ("parent_category_id");--> statement-breakpoint
CREATE INDEX "post_category_visible_sort_idx" ON "post_category" USING btree ("is_visible","sort_order");--> statement-breakpoint
CREATE INDEX "post_tag_slug_idx" ON "post_tag" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "post_tag_visible_idx" ON "post_tag" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "post_category_to_post_post_idx" ON "post_category_to_post" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_category_to_post_category_idx" ON "post_category_to_post" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "post_tag_to_post_post_idx" ON "post_tag_to_post" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_tag_to_post_tag_idx" ON "post_tag_to_post" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "press_release_slug_idx" ON "press_release" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "press_release_status_idx" ON "press_release" USING btree ("status");--> statement-breakpoint
CREATE INDEX "press_release_publishedAt_idx" ON "press_release" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "press_release_updatedAt_idx" ON "press_release" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "press_release_status_publishedAt_idx" ON "press_release" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "press_release_authorId_idx" ON "press_release" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "press_release_to_media_asset_press_idx" ON "press_release_to_media_asset" USING btree ("press_release_id");--> statement-breakpoint
CREATE INDEX "press_release_to_media_asset_media_idx" ON "press_release_to_media_asset" USING btree ("media_asset_id");--> statement-breakpoint
CREATE UNIQUE INDEX "content_entry_domain_slug_unique" ON "content_entry" USING btree ("domain","slug");--> statement-breakpoint
CREATE INDEX "content_entry_domain_idx" ON "content_entry" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "content_entry_template_key_idx" ON "content_entry" USING btree ("template_key");--> statement-breakpoint
CREATE INDEX "content_entry_status_idx" ON "content_entry" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_entry_updated_at_idx" ON "content_entry" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "content_publication_published_at_idx" ON "content_publication" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "content_publication_scheduled_at_idx" ON "content_publication" USING btree ("scheduled_at");--> statement-breakpoint
CREATE UNIQUE INDEX "content_revision_entry_version_unique" ON "content_revision" USING btree ("entry_id","version");--> statement-breakpoint
CREATE INDEX "content_revision_entry_id_idx" ON "content_revision" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "content_revision_created_at_idx" ON "content_revision" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "email_preference_updated_at_idx" ON "email_preference" USING btree ("updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "email_subscription_email_topic_unique" ON "email_subscription" USING btree ("email","topic");--> statement-breakpoint
CREATE INDEX "email_subscription_user_idx" ON "email_subscription" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "email_subscription_status_idx" ON "email_subscription" USING btree ("status");--> statement-breakpoint
CREATE INDEX "email_subscription_topic_idx" ON "email_subscription" USING btree ("topic");--> statement-breakpoint
CREATE INDEX "email_message_to_email_idx" ON "email_message" USING btree ("to_email");--> statement-breakpoint
CREATE INDEX "email_message_to_user_idx" ON "email_message" USING btree ("to_user_id");--> statement-breakpoint
CREATE INDEX "email_message_status_idx" ON "email_message" USING btree ("status");--> statement-breakpoint
CREATE INDEX "email_message_topic_idx" ON "email_message" USING btree ("topic");--> statement-breakpoint
CREATE INDEX "email_message_provider_message_id_idx" ON "email_message" USING btree ("provider_message_id");--> statement-breakpoint
CREATE INDEX "email_message_created_at_idx" ON "email_message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "email_event_message_idx" ON "email_event" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "email_event_type_idx" ON "email_event" USING btree ("type");--> statement-breakpoint
CREATE INDEX "email_event_created_at_idx" ON "email_event" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "email_event_provider_event_id_unique" ON "email_event" USING btree ("provider_event_id");--> statement-breakpoint
CREATE INDEX "media_asset_type_idx" ON "media_asset" USING btree ("type");--> statement-breakpoint
CREATE INDEX "media_asset_createdAt_idx" ON "media_asset" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "media_asset_uploadedById_idx" ON "media_asset" USING btree ("uploaded_by_id");--> statement-breakpoint
CREATE INDEX "media_asset_mimeType_idx" ON "media_asset" USING btree ("mime_type");--> statement-breakpoint
CREATE INDEX "contact_submission_email_idx" ON "contact_submission" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contact_submission_status_idx" ON "contact_submission" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contact_submission_assigned_to_idx" ON "contact_submission" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "contact_submission_created_at_idx" ON "contact_submission" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "contact_submission_service_interest_idx" ON "contact_submission" USING btree ("service_interest");--> statement-breakpoint
CREATE INDEX "contact_submission_urgency_idx" ON "contact_submission" USING btree ("urgency");
