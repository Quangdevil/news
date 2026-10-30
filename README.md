# Quang Duren

Trang tĩnh bằng tiếng Việt, lấy dữ liệu từ `dist/data.json`. Khoảng nghiên cứu từ 2024-01-01; bản đầu CHƯA hoàn tất thu thập lịch sử.

## Nguyên tắc nhập

Mỗi video có một bản ghi `sources`, giữ URL gốc, ngày của số liệu và ghi riêng ngày đăng nếu khác. Mỗi chỉ tiêu/hạng/địa điểm là một `observations` riêng. Ưu tiên chữ trên video và lời nói trực tiếp. Giữ `low`/`high` cho khoảng gần đúng và ghi tính chất gần đúng trong note. Nếu mới đọc được tiêu đề hoặc tóm tắt AI phải ghi rõ `evidence`.

Không coi lượng tại chợ là lượng hàng mới; không coi lượng thông quan là sản lượng vùng trồng. Không trộn giá/kg, giá/斤 hoặc giá/thùng. Không suy ra giá tuyệt đối từ mức tăng giảm chưa rõ đơn vị. Không điền các ngày thiếu bằng 0 hoặc nội suy. Không dùng số liệu nguồn khác và gắn thành số Kim Đồng.

Dự báo lưu ngày phát biểu ở `date`, kỳ dự báo ở `forecastPeriod`, `kind` bằng `Dự báo`. Không dùng như kết quả thực tế. Không tự cộng ảnh chụp tồn kho hoặc số hàng về lặp nhiều lần trong ngày. Chuỗi biểu đồ chỉ lập khi có cùng định nghĩa, giống, hạng, nơi và đơn vị.

## Bản đầu

10 URL nguồn đã tìm được, 6 bản ghi trích một phần cho 3 ngày; chưa có chuỗi giá tuyệt đối hoặc sản lượng vùng trồng. Video 2024-09-22 mới đọc được một phụ đề thay đổi giá hàng xử lý; số 350 ngày 2025-09-28 chỉ lấy từ tiêu đề; các số 2026-10-28 lấy từ tóm tắt chương AI của Douyin, chưa đối chiếu toàn video.

Chạy `node --check dist/app.js` và kiểm tra JSON trước khi triển khai. Xuất CSV trong trang theo bộ lọc. JSON gốc tải trực tiếp từ trang. Sửa nguồn và triển khai lại để cập nhật bền vững; chưa có trình thu thập Douyin tự động.
