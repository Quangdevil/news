import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
src={
'jan24':'https://nafiqpm.mae.gov.vn/portal/DinhKemTinBai/2024-08/Thang-1-2024_fYXJQ9yx7kufbwkt.pdf',
'feb24':'https://nafiqpm.mae.gov.vn/portal/DinhKemTinBai/2024-07/Thang-2-2024_LMXipvMu-02SDGAz.pdf',
'jun24':'https://qlclbinhdinh.vn/Uploads/files/Thang-6-2024.pdf',
'dec24':'https://sonongnghiep.ninhbinh.gov.vn/img/file/th%C3%A1ng%201%20n%C4%83m%202025/QLCL/16-1/Nam%202024_final.pdf',
'mar25':'https://nafiqpm.mae.gov.vn/portal/DinhKemTinBai/2025-07/Thang%203_2025_AZsnYxeaEkO-32MU.pdf',
'aug25':'https://www.quangninh.gov.vn/So/sonongnghiepptnt/Lists/TinTuc/Attachments/9006/B%E1%BA%A3n%20tin%20th%E1%BB%8B%20tr%C6%B0%E1%BB%9Dng%20trong%20n%C6%B0%E1%BB%9Bc%20T8.2025.pdf',
'oae':'https://catalog.oae.go.th/dataset/ccd2d1f9-1ceb-478d-bfd2-db95b283bcee/resource/b18e5233-6320-4795-a610-83ad5af1a23e/download/durian.pdf?preview=1',
'nso':'https://www.nso.gov.vn/wp-content/uploads/2026/01/Nien-giam-tom-tat-2024.pdf',
'sisaket':'https://sisaket.doae.go.th/wp-content/uploads/2025/11/68-05-19-%E0%B8%AA%E0%B8%A3%E0%B8%B8%E0%B8%9B%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%9E%E0%B8%B7%E0%B8%8A%E0%B9%80%E0%B8%A8%E0%B8%A3%E0%B8%A9%E0%B8%90%E0%B8%81%E0%B8%B4%E0%B8%88-%E0%B8%88.%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%AA%E0%B8%B0%E0%B9%80%E0%B8%81%E0%B8%A9.pdf',
'din':'https://www.xiaoju365.net/durian-daily.php',
'jx':'https://www.xiaoju365.net/'
}
obs=[]
def farm(month,variety,value,source,derived=False,note='',grade='Loại 1',region='Tiền Giang'):
    obs.append(dict(kind='farm',series=f'Việt Nam · {region} · {variety} · {grade}',frequency='monthly',month=month,country='VN',region=region,metric='Giá thu mua bình quân tháng',variety=variety,grade=grade,low=value,high=value,unit='VND/kg',status='Suy ra từ chênh lệch công bố' if derived else 'Bình quân tháng do báo cáo công bố',sourceUrl=src[source],note=note))

for month,mt,ri,source,derived in [
('2023-01',75003,85000,'jan24',True),
('2023-02',82222,93750,'feb24',True),
('2023-12',130000,107071,'jan24',True),
('2024-01',121909,107071,'jan24',False),
('2024-02',131000,113667,'feb24',False),
('2024-05',83421,70368,'jun24',True),
('2024-06',80800,66133,'jun24',False),
('2024-11',124524,88000,'dec24',True),
('2024-12',136182,114864,'dec24',False)]:
    for variety,value in [('Monthong',mt),('Ri6',ri)]:
        note='Tính bằng giá tháng công bố cộng/trừ chênh lệch cùng kỳ hoặc tháng trước; không đọc điểm từ hình biểu đồ.' if derived else ''
        if month=='2024-01' and variety=='Ri6': note='Bản tháng 1 công bố 107.071; chênh lệch nêu trong bản tháng 2 ngụ ý tháng 1 là 105.600. Giữ số công bố trực tiếp, chưa giải quyết khác biệt.'
        farm(month,variety,value,source,derived,note)
farm('2025-03','Ri6',78800,'mar25',note='Không nhập giá Monthong cùng bản vì số tiền và mức tăng trong nguồn mâu thuẫn.')
for month,mt,ri,derived in [('2025-07',70100,47000,True),('2025-08',76600,51000,False)]:
    for variety,value in [('Monthong',mt),('Ri6',ri)]: farm(month,variety,value,'aug25',derived,'Tháng 7 suy ra từ giá và mức tăng tháng 8.' if derived else '',grade='Nguồn không nêu hạng',region='Đồng Tháp · Tiền Giang cũ')
for year,value in [(2023,98.07),(2024,122.07)]:
    obs.append(dict(kind='farm',series='Thái Lan · giá nông dân bán · bình quân năm',frequency='annual',year=year,country='TH',region='Toàn quốc',metric='Giá tại nông hộ bình quân năm',variety='Sầu riêng · chưa tách giống',grade='Chưa tách hạng',low=value,high=value,unit='THB/kg',status='Bình quân năm · OAE',sourceUrl=src['oae'],note='Không coi là giá bình quân từng tháng.'))
def sample(kind,series,country,region,variety,grade,lo,hi,unit,date,status,source,note=''):
    obs.append(dict(kind=kind,series=series,frequency='monthly',date=date,month=date[:7],country=country,region=region,metric='Giá thu mua mẫu' if kind=='farm' else 'Giá bán mẫu',variety=variety,grade=grade,low=lo,high=hi,unit=unit,status=status,sourceUrl=src[source],note=note))
sample('farm','Việt Nam · Đắk Lắk · Monthong A · mẫu ngày','VN','Đắk Lắk','Monthong','A thường–khá',88000,95000,'VND/kg','2026-10-26','Giá chào thu mua · mẫu một ngày','din','Không phải bình quân tháng hoặc giá mua đã xác nhận.')
sample('sale','TQ · Quảng Châu · Monthong Việt A3 tốt · thùng 10 kg','VN','Quảng Châu','Monthong','A3 tốt · 10 kg/thùng',350,360,'NDT/thùng','2026-10-27','Thành giao được báo · mẫu một ngày','din','Giá chào cùng quy cách 370–380 NDT/thùng. Mẫu không đại diện cả tháng.')
sample('sale','TQ · Quảng Châu · Monthong Thái A tốt · 16–17 kg','TH','Quảng Châu','Monthong','A tốt · 16–17 kg/thùng',800,900,'NDT/thùng','2026-10-27','Giá tham khảo · chưa rõ chào hay thành giao','din','Không so thẳng với thùng 10 kg Việt Nam; không coi là bình quân tháng.')
for origin,value in [('VN',38.90),('TH',62.40)]:
    sample('sale',f'TQ · Gia Hưng · Monthong {"Việt" if origin=="VN" else "Thái"} · giá tính tham khảo',origin,'Gia Hưng','Monthong','Nguồn không nêu hạng',value,value,'NDT/kg','2026-10-30','Giá tính tham khảo · không phải thành giao','jx','Mẫu ngày 30/10; không đại diện bình quân tháng.')
production=[]
for country,year,value,source,status in [('VN',2024,1532700,'nso','Thống kê năm · NSO'),('TH',2023,1482000,'oae','Số sơ bộ P · OAE'),('TH',2024,1287000,'oae','Số sơ bộ P · OAE')]:
    production.append(dict(frequency='annual',year=year,country=country,region='Toàn quốc',metric='Sản lượng sầu riêng cả năm',value=value,unit='tấn',status=status,sourceUrl=src[source],note='Không chia đều cho 12 tháng.'))
for month,value in [('2025-05',1535),('2025-06',11067),('2025-07',6321),('2025-08',941)]:
    production.append(dict(series='Thái Lan · Sisaket · dự kiến thu hoạch',frequency='monthly',month=month,country='TH',region='Chỉ tỉnh Sisaket',metric='Dự kiến sản lượng thu hoạch',value=value,unit='tấn',status='Dự kiến · không phải thực thu',sourceUrl=src['sisaket'],note='Giữ số tấn trong bảng. Một số tỷ lệ phần trăm trong nguồn không khớp với khối lượng, không sử dụng các tỷ lệ đó.'))
for month,value,series,source,note in [('2024-07',116700,'Việt Nam · tổng bảng dự kiến tháng 7/2024','jun24','Tổng các dòng tỉnh và các tỉnh khác trong bảng: 116,7 nghìn tấn; là phép cộng bảng dự kiến, không phải thống kê thực thu.'),('2025-04',80100,'Việt Nam · 5 tỉnh được nêu · dự kiến tháng 4/2025','mar25','Tổng 5 tỉnh được nêu: Tiền Giang, Đồng Nai, Bình Phước, Tây Ninh, Bà Rịa–Vũng Tàu. Không đại diện toàn quốc.')]:
    production.append(dict(series=series,frequency='monthly',month=month,country='VN',region='Phạm vi bảng trong nguồn',metric='Dự kiến sản lượng thu hoạch',value=value,unit='tấn',status='Dự kiến · cộng bảng, chưa phải thực thu',sourceUrl=src[source],note=note))
(ROOT/'docs/market-data.json').write_text(json.dumps(dict(updated='2026-10-30',observations=obs,production=production),ensure_ascii=False,indent=2))
print(len(obs),'price rows;',len(production),'production rows')
