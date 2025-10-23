# Đường dẫn tuyệt đối đến project
$projectPath = "C:\Users\Admin\TTYT-DanhGia"

# Đường dẫn file index.html
$indexFile = Join-Path $projectPath "index.html"

if (-Not (Test-Path $indexFile)) {
    Write-Host "[LỖI] index.html KHÔNG TỒN TẠI" -ForegroundColor Red
    exit
}

# Đọc nội dung index.html
$htmlContent = Get-Content $indexFile

# Regex tìm các link CSS
$cssLinks = [regex]::Matches($htmlContent, '<link[^>]+href=["'']([^"'']+)["'']', 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value }

# Regex tìm các script JS
$jsLinks = [regex]::Matches($htmlContent, '<script[^>]+src=["'']([^"'']+)["'']', 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value }

Write-Host "----- Kiểm tra CSS -----"
foreach ($link in $cssLinks) {
    if ($link.StartsWith("http")) {
        Write-Host "[BỎ QUA] $link (URL bên ngoài)"
    } else {
        $fullPath = Join-Path $projectPath $link
        if (Test-Path $fullPath) {
            Write-Host "[OK] $link tồn tại"
        } else {
            Write-Host "[LỖI] $link KHÔNG TỒN TẠI" -ForegroundColor Red
        }
    }
}

Write-Host "`n----- Kiểm tra JS -----"
foreach ($link in $jsLinks) {
    if ($link.StartsWith("http")) {
        Write-Host "[BỎ QUA] $link (URL bên ngoài)"
    } else {
        $fullPath = Join-Path $projectPath $link
        if (Test-Path $fullPath) {
            Write-Host "[OK] $link tồn tại"
        } else {
            Write-Host "[LỖI] $link KHÔNG TỒN TẠI" -ForegroundColor Red
        }
    }
}
