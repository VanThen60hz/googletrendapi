# Trend Analyzer

Ứng dụng phân tích xu hướng sử dụng Google Trends API và hiển thị kết quả bằng biểu đồ.

## Tính năng

-   Phân tích Interest over time cho nhiều từ khóa
-   Hiển thị xu hướng theo khu vực
-   Tính toán độ ổn định của xu hướng (ngắn hạn/dài hạn)
-   Hiển thị các truy vấn liên quan và đang tăng
-   Biểu đồ trực quan với Chart.js

## Cài đặt

1. Clone repository:

```bash
git clone [repository-url]
cd trend-analyzer
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Chạy ứng dụng:

```bash
npm start
```

4. Mở trình duyệt và truy cập:

```
http://localhost:3000
```

## Cách sử dụng

1. Nhập các từ khóa cần phân tích, phân cách bằng dấu phẩy (ví dụ: "bitcoin, ethereum, dogecoin")
2. Nhấn nút "Analyze Trends"
3. Xem kết quả phân tích được hiển thị trong các biểu đồ và bảng

## Giải thích kết quả

-   **Interest Over Time**: Biểu đồ đường thể hiện mức độ quan tâm theo thời gian
-   **Trend Stability**:
    -   Long-term trend: Xu hướng ổn định, dài hạn
    -   Medium-term trend: Xu hướng trung bình
    -   Short-term trend: Xu hướng ngắn hạn, không ổn định
-   **Related Queries**: Các truy vấn liên quan và đang tăng trưởng

## Lưu ý

-   API có giới hạn số lượng request, nên sử dụng hợp lý
-   Kết quả phân tích dựa trên dữ liệu 30 ngày gần nhất
#   g o o g l e t r e n d a p i  
 