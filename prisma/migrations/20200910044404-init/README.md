# Migration `20200910044404-init`

This migration has been generated by Eduardo Zarraga at 9/10/2020, 12:44:04 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
DROP INDEX "loose$dev"."Organization_ownerId_unique"

ALTER TABLE "loose$dev"."Organization" ADD COLUMN "userId" text   

ALTER TABLE "loose$dev"."User" ADD COLUMN "organizationId" text   

ALTER TABLE "loose$dev"."Organization" ADD FOREIGN KEY ("userId")REFERENCES "loose$dev"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "loose$dev"."User" ADD FOREIGN KEY ("organizationId")REFERENCES "loose$dev"."Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200910044051-init..20200910044404-init
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
@@ -13,8 +13,9 @@
   githubToken String?
   githubOrganization String?
   owner User @relation("UserOrganizations", fields: [ownerId], references: [id])
   ownerId String
+  users User[] @relation("OrganizationUsers")
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
 }
@@ -31,9 +32,10 @@
   emailVerificationCodeIssuedAt DateTime?
   hash String
   resetPasswordCode String?
   resetPasswordCodeIssuedAt DateTime?
-  ownOrganizations Organization @relation("UserOrganizations")
+  ownOrganizations Organization[] @relation("UserOrganizations")
+  organizations Organization[]
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   }
```


