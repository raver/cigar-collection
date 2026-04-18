CREATE TYPE "public"."comment_status" AS ENUM('pending', 'approved', 'rejected', 'hidden', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."era" AS ENUM('80年代', '90年代', '2000年以后', '不详');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	CONSTRAINT "admins_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "cigars" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"factory" varchar(100) NOT NULL,
	"era" "era" NOT NULL,
	"theme" varchar(50) NOT NULL,
	"image_original" varchar(255) NOT NULL,
	"image_watermarked" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cigars_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"cigar_id" integer,
	"author_name" varchar(50) NOT NULL,
	"author_email" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"quote_id" integer,
	"status" "comment_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_cigar_id_cigars_id_fk" FOREIGN KEY ("cigar_id") REFERENCES "public"."cigars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_quote_id_comments_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;