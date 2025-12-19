# Học Viện Siêu Nhí 100+ 🧸

Chuỗi 100 game giáo dục hoàn chỉnh cho bé từ 2-7 tuổi.

## 🚀 Hướng dẫn chạy trên GitHub (GitHub Pages)

### Cách 1: Triển khai từ Source Code (Dùng cho Developer)
Vì dự án sử dụng React và TypeScript, bạn nên dùng một bundler như Vite để triển khai:
1. Đưa toàn bộ source code lên GitHub.
2. Sử dụng **GitHub Actions** để tự động build dự án mỗi khi push code.
3. Trong phần cấu hình `vite.config.ts`, đảm bảo `base` được đặt là tên repository của bạn (ví dụ: `/ten-repo/`).

### Cách 2: Triển khai bản Single-file (Dành cho người dùng phổ thông)
Nếu bạn muốn gửi link nhanh cho bạn bè:
1. Bạn có thể gộp toàn bộ logic từ các file `.tsx` vào một file `index.html` duy nhất (như phiên bản trước đó).
2. Tải file `index.html` đó lên repo và bật GitHub Pages trong phần **Settings > Pages**.

## 🎮 Danh sách 100 Game Hiện Có
Nội dung được chia thành 9 nhóm chủ đề lớn (Đã cấu hình trong `constants.tsx`):
1. **Tiếng Anh (g1-g15)**: Chữ cái, Số, Hành động...
2. **Toán Học (g16-g30)**: Đếm, Phép tính, So sánh...
3. **Tiếng Việt (g31-g45)**: Chữ cái Tiếng Việt, Dấu câu, Đọc câu...
4. **Ghi Nhớ (g46-g55)**: Lật hình, Ghi nhớ vị trí...
5. **Ghép Hình (g56-g65)**: Ghép mảnh con vật, Ghép bóng...
6. **Ghép Chữ (g66-g75)**: Ghép từ Tiếng Việt theo hình...
7. **Tìm Khác Biệt (g76-g85)**: Phân biệt chi tiết sai, khác màu...
8. **Phân Loại (g86-g95)**: Nhóm đối tượng, Loại trừ...
9. **Tư Duy IQ (g96-g100)**: Logic cơ bản, Phản xạ...

---
**Triết lý giáo dục**: Kiến trúc code đã được thiết kế để không có "thất bại". Khi bé chọn sai, hệ thống sẽ đưa ra gợi ý nhẹ nhàng để bé thử lại, giúp xây dựng sự tự tin cho trẻ.