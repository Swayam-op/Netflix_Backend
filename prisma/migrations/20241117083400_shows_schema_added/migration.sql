-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Shows" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3),
    "bgImage" TEXT,
    "genre" TEXT,
    "rating" DOUBLE PRECISION,
    "description" TEXT,
    "likes" INTEGER,
    "isPaid" BOOLEAN NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "showsType" TEXT NOT NULL,

    CONSTRAINT "Shows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shows_title_key" ON "Shows"("title");
