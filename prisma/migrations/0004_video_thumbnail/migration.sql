-- Tambah kolom thumbnail dan duration ke Video

-- AlterTable
ALTER TABLE "Video" ADD COLUMN "thumbnailUrl" TEXT;
ALTER TABLE "Video" ADD COLUMN "duration" INTEGER;
