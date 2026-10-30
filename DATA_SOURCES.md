# Dữ liệu đã đưa vào Quang Duren News

Ngày thu thập: 30/10/2026. Tệp `docs/trade.json`: 44 tháng, 132 dòng, 01/2023–08/2026; mỗi tháng có World, Việt Nam, Thái Lan. World đã bao gồm Việt Nam và Thái Lan. Không cộng ba dòng này thành tổng mới.

Nguồn công khai: https://www.xiaoju365.net/research-trade.php?year=2023 và cùng trang chọn năm 2024, 2025, 2026. Nguồn này ghi lấy ITC Trade Map, Trung Quốc nhập khẩu, Direct, HS 081060. Trích số kg trong thuộc tính hiển thị `title` của biểu đồ. Chỉ lấy một lần phần country-704 và country-764; không cộng bản sao tiếng Anh của cùng một nước trong HTML. Chưa kiểm chứng toàn bộ với Trade Map gốc.

Mẫu trực tiếp UN Comtrade: https://comtradeapi.un.org/public/v1/preview/C/M/HS?reporterCode=156&period=202301&partnerCode=0%2C704%2C764&cmdCode=081060&flowCode=M&partner2Code=0&customsCode=C00&motCode=0&maxRecords=500 . Tháng 01/2023, netWgt của Comtrade là World 31.807.800 kg, Việt Nam 8.612.900 kg, Thái Lan 23.194.900 kg. Chuỗi tổng hợp lần lượt là 31.807.795; 8.612.902; 23.194.893 kg. Giữ chênh lệch vài kg và provenance; không ép khớp. Truy vấn nhiều tháng bị 400 / 429 trong lần thu thập này; không dùng dữ liệu thiếu để dựng chuỗi giá nhập USD.

Tệp `docs/market-data.json`: 30 dòng giá và 9 dòng sản lượng/dự kiến. Mỗi dòng giữ URL nguồn riêng. Giá bình quân từ báo cáo nông nghiệp Việt Nam; các kỳ suy ra bằng cộng/trừ chênh lệch được gắn nhãn rõ. Giá Ri6 tháng 01/2024 có mâu thuẫn giữa hai báo cáo và đã ghi chú. Giá Monthong tháng 03/2025 không nhập vì số giá và số tăng trong nguồn không tương thích. Giá tháng 10/2026 là mẫu theo ngày, không coi là bình quân tháng.

Sản lượng Việt Nam năm 2024 dùng NSO 1.532.700 tấn. Sản lượng và giá Thái Lan 2023–2024 dùng OAE, giữ nhãn sơ bộ P cho sản lượng. Sản lượng tháng Sisaket 2025 và bảng Việt Nam tháng 07/2024, 04/2025 là dự kiến; giữ riêng khỏi kết quả thực tế. Chưa có chuỗi sản lượng tháng thực tế của cả ba nước. Không chia số năm cho 12, không nội suy ngày/tháng trống.

Trang tin: `docs/news.json`; cách cập nhật: `NEWS_UPDATE.md`. Biểu đồ: `docs/charts.html`, dữ liệu tải bằng đường dẫn tương đối để chạy dưới /news/.
