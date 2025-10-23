# Đặt đường dẫn tuyệt đối đến thư mục dự án
$projectPath = "C:\Users\Admin\TTYT-DanhGia"

# Danh sách file quan trọng
$filesToCheck = @(
    "index.html",
    "style.css",
    "app.js",
    "menu.js"
)

# Thư mục hình ảnh
$imageFolder = "images"

Write-Host "----- Kiểm tra file quan trọng -----"

# Kiểm tra file
foreach ($file in $filesToCheck) {
    $fullPath = Join-Path $projectPath $file
    if (Test-Path $fullPath) {
        Write-Host "[OK] $file tồn tại"
    } else {
        Write-Host "[LỖI] $file KHÔNG TỒN TẠI" -ForegroundColor Red
    }
}

# Kiểm tra thư mục hình ảnh
$fullImagePath = Join-Path $projectPath $imageFolder
if (Test-Path $fullImagePath) {
    Write-Host "[OK] Thư mục hình ảnh '$imageFolder' tồn tại"
    # Kiểm tra có file trong images không
    $images = Get-ChildItem $fullImagePath
    if ($images.Count -eq 0) {
        Write-Host "[CẢNH BÁO] Thư mục hình ảnh rỗng" -ForegroundColor Yellow
    } else {
        Write-Host "[OK] Thư mục hình ảnh có" $images.Count "file"
    }
} else {
    Write-Host "[LỖI] Thư mục hình ảnh '$imageFolder' KHÔNG TỒN TẠI" -ForegroundColor Red
}

Write-Host "----- Kiểm tra hoàn tất -----"
