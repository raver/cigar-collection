ALTER TABLE "cigars" ADD COLUMN "name_sort_key" varchar(255);--> statement-breakpoint
CREATE INDEX "cigars_name_sort_key_idx" ON "cigars" USING btree ("name_sort_key","id");