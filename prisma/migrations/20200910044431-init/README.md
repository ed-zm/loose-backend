# Migration `20200910044431-init`

This migration has been generated by Eduardo Zarraga at 9/10/2020, 12:44:31 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "loose$dev"."Organization" DROP CONSTRAINT "Organization_userId_fkey"

ALTER TABLE "loose$dev"."User" DROP CONSTRAINT "User_organizationId_fkey"

ALTER TABLE "loose$dev"."Organization" DROP COLUMN "userId"

ALTER TABLE "loose$dev"."User" DROP COLUMN "organizationId"

CREATE TABLE "loose$dev"."_OrganizationUsers" (
"A" text   NOT NULL ,
"B" text   NOT NULL 
)

CREATE UNIQUE INDEX "_OrganizationUsers_AB_unique" ON "loose$dev"."_OrganizationUsers"("A", "B")

CREATE INDEX "_OrganizationUsers_B_index" ON "loose$dev"."_OrganizationUsers"("B")

ALTER TABLE "loose$dev"."_OrganizationUsers" ADD FOREIGN KEY ("A")REFERENCES "loose$dev"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "loose$dev"."_OrganizationUsers" ADD FOREIGN KEY ("B")REFERENCES "loose$dev"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200910044404-init..20200910044431-init
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model Organization {
   id String @default(cuid()) @id
@@ -33,9 +33,9 @@
   hash String
   resetPasswordCode String?
   resetPasswordCodeIssuedAt DateTime?
   ownOrganizations Organization[] @relation("UserOrganizations")
-  organizations Organization[]
+  organizations Organization[] @relation("OrganizationUsers")
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   }
```


