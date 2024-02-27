該專案為個人Vue練習專案，網站主要內容如下：
=====
* 進入網站時，透過Google Geolocation API獲取使用者位置
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/start.jpg)
* 透過Quert City API進行台灣各縣市名稱資料獲取，並使用v-for使其自動生成下拉式選單
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/options.jpg)
* 選取下拉式選單需要查詢之縣市，點擊確定執行API串接函式，透過中央氣象署之開放API進行36小時內氣象資料獲取
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/selected.jpg)
* 執行後獲取氣象資料，並獲取當前時間之氣溫、天氣、降雨機率
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/present.jpg)
* 透過迴圈執行，分別取出3筆天氣資料，使用v-for使其自動生成天氣區塊，moment.js套件優化時間格式
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/36hr.jpg)
* 透過RWD調整移動端頁面，使網頁畫面可以自適應手機、平板等裝置
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/mobile.jpg)
* 手機版頁面使用@change方式取代原先的確認按鍵，優化使用者體驗
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/change.jpg)
