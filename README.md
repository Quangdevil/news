# Quang Duren News

**Web công khai: https://quangdevil.github.io/news/**

**Biểu đồ: https://quangdevil.github.io/news/charts.html**

Web điểm tin sầu riêng bằng tiếng Việt. GitHub Pages xuất bản nhánh `main`, thư mục `docs`.

- `docs/index.html`, `docs/news.css`, `docs/news.js`: giao diện điểm tin.
- `docs/news.json`: bản tin hiện tại và kho tin, mỗi số liệu có ngày nguồn riêng.
- `NEWS_UPDATE.md`: quy trình cập nhật và schema bản tin.
- `docs/history.html`, `docs/data.json`: bộ dữ liệu lịch sử ban đầu, còn thiếu nhiều ngày; không phải chuỗi giá hoàn chỉnh.
- `dist/`: bản web dữ liệu ban đầu dùng cho Cloudflare.

Kiểm tra: `node --check docs/news.js`, `python -m json.tool docs/news.json /dev/null`.

Nguồn thiếu được ghi rõ. Không tự suy diễn giá thành giao, lượng bán hay video mới. Lịch cập nhật sử dụng tác vụ điểm tin đã có; nếu thu thập hoặc ghi GitHub lỗi, web có thể chậm cập nhật. Ngày bản tin trên trang giúp nhận biết bản mới nhất.


## Biểu đồ từ 2023

`docs/charts.html` có bộ lọc năm và 4 nhóm: Lượng nhập Trung Quốc, Giá gốc, Giá bán, Sản lượng. Đợt đầu nhập 44 tháng / 132 dòng lượng nhập từ 01/2023–08/2026 qua nguồn tổng hợp, 30 dòng giá, 9 dòng sản lượng và dự kiến. Độ phủ mỗi chỉ tiêu khác nhau. Xem `DATA_SOURCES.md` để biết nguồn, chênh lệch và phép tính. Tải CSV ngay trên trang. Không nội suy tháng trống hoặc coi dự kiến là thực tế.
