# Quang Duren News — cập nhật bản tin

Trang công khai dùng GitHub Pages, nhánh `main`, thư mục `docs`. Trang đọc `docs/news.json`. Mã giao diện ở `docs/index.html`, `docs/news.css`, `docs/news.js`. Kho dữ liệu cũ ở `docs/history.html` và `dist/`.

Mỗi lần cập nhật: dùng GitHub connector đọc `docs/news.json` và lấy SHA mới nhất; giữ các bản cũ, thêm một bản vào `stories`, đặt `updatedAt` theo giờ Việt Nam. Khi chạy lại cùng bản tin, cập nhật cùng `id`, không tạo trùng. Giữ tối đa 180 bản gần nhất. Ghi bằng `update_file` với SHA vừa đọc, sau đó đọc lại đúng tệp để xác minh. Nếu xung đột, đọc mới rồi ghép lại; không ghi đè thay đổi của người khác. Không thay giao diện hoặc phần lịch sử trong lượt điểm tin.

Mỗi story có `id`, `date` (YYYY-MM-DD), `publishedAt` (ISO 8601 có múi giờ +07:00), `label` (Sáng/Chiều/Tối), `tag`, `headline`, `summary`, `videoStatus`, `rows`, `takeaway`, `limits`, `sources`. Mỗi row có `market`, `asOf`, `volume`, `price`, `sales`; mỗi source có `label`, `url` HTTPS trực tiếp. Các trường nội dung là văn bản thuần, không HTML, không trích dẫn nội bộ kiểu turn... .

Đầu đề ngắn, có điểm nhấn thực tế. Bảng tối đa 4 chợ quan trọng, câu ngắn. Ghi rõ ngày số liệu trong từng dòng, hạng/giống/khâu/đơn vị và tính chất giá. Không trộn hàng mới, tổng tại chợ, tồn kho, lượng thông quan. Không trộn giá chào với thành giao. Dữ liệu chưa rõ thì ghi thiếu; không suy diễn từ bài cũ. Có thể đăng bản ngắn nói chưa xác minh được tin mới; không nâng ngày của số liệu cũ. `takeaway` là nhận định có điều kiện, không khẳng định dự báo.

Nguồn chính: đúng tài khoản 水果猎人-----金童, Douyin ID shuiguoliere41. Không lấy tài khoản 阿龙 làm Kim Đồng. Khi tìm nguồn Cao Bi Điếm, 小宝哥/刘宝峰 chỉ là ứng viên cho đến khi xác minh đúng tài khoản. Nguồn ngành khác ghi rõ là nguồn độc lập, không gán cho chủ kênh.

Không cần đăng nhập trình duyệt để cập nhật; writer là GitHub connector có quyền `push` trên Quangdevil/quang-duren. GitHub Pages tự triển khai khi `docs` đổi. Nếu writer không khả dụng, vẫn gửi bản tin trong chat và nói rõ web chưa cập nhật; không báo thành công khi chưa đọc lại được.
