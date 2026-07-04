-- CreateTable
CREATE TABLE "muc_tieu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ten" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "nguon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nguon" TEXT NOT NULL,
    "tenNguon" TEXT NOT NULL,
    "thoiGianSuDung" TEXT NOT NULL,
    "tinhTrang" TEXT NOT NULL DEFAULT 'HOAT_DONG',
    "danhGia" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "nhu_cau_anh" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mucTieuId" INTEGER NOT NULL,
    "nguonId" INTEGER NOT NULL,
    "loaiNhuCau" TEXT NOT NULL,
    "diaBan" TEXT NOT NULL,
    "loaiAnhChup" TEXT NOT NULL,
    "toaDoX" REAL NOT NULL,
    "toaDoY" REAL NOT NULL,
    "thoiGianDat" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thoiGianChup" DATETIME,
    "thoiGianMongMuonTu" DATETIME,
    "thoiGianMongMuonDen" DATETIME,
    "thoiGianTra" DATETIME,
    "doPhanGiai" TEXT NOT NULL,
    "trangThai" TEXT NOT NULL DEFAULT 'CHO_DUYET',
    "moTa" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "nhu_cau_anh_mucTieuId_fkey" FOREIGN KEY ("mucTieuId") REFERENCES "muc_tieu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "nhu_cau_anh_nguonId_fkey" FOREIGN KEY ("nguonId") REFERENCES "nguon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "nhu_cau_anh_lich_su" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nhuCauId" INTEGER NOT NULL,
    "trangThaiCu" TEXT,
    "trangThaiMoi" TEXT NOT NULL,
    "thoiGian" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ghiChu" TEXT,
    CONSTRAINT "nhu_cau_anh_lich_su_nhuCauId_fkey" FOREIGN KEY ("nhuCauId") REFERENCES "nhu_cau_anh" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "muc_tieu_ten_key" ON "muc_tieu"("ten");

-- CreateIndex
CREATE UNIQUE INDEX "nguon_tenNguon_key" ON "nguon"("tenNguon");

-- CreateIndex
CREATE INDEX "nhu_cau_anh_trangThai_idx" ON "nhu_cau_anh"("trangThai");

-- CreateIndex
CREATE INDEX "nhu_cau_anh_nguonId_idx" ON "nhu_cau_anh"("nguonId");

-- CreateIndex
CREATE INDEX "nhu_cau_anh_mucTieuId_idx" ON "nhu_cau_anh"("mucTieuId");

-- CreateIndex
CREATE INDEX "nhu_cau_anh_loaiNhuCau_idx" ON "nhu_cau_anh"("loaiNhuCau");

-- CreateIndex
CREATE INDEX "nhu_cau_anh_lich_su_nhuCauId_idx" ON "nhu_cau_anh_lich_su"("nhuCauId");
