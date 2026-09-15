-- Simpan password ter-encode base64 agar admin dapat melihatnya

-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordPlain" TEXT;
