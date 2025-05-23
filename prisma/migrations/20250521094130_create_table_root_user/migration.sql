-- CreateTable
CREATE TABLE "root_user" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "root_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "root_user_login_key" ON "root_user"("login");
