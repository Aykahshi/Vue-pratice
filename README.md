該專案為個人Vue練習專案，網站主要內容如下：<br>
gh-pages:https://aykahshi.github.io/
=====
* 進入網站時，透過Google Geolocation API獲取使用者位置<br>
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/start.jpg)<br>
* 透過Query City API進行台灣各縣市名稱資料獲取，並使用v-for使其自動生成下拉式選單<br>
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/options.jpg)<br>
* 選取下拉式選單需要查詢之縣市，點擊確定執行API串接函式，透過中央氣象署之開放API進行36小時內氣象資料獲取<br>
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/selected.jpg)<br>
* 執行後獲取氣象資料，並獲取當前時間之氣溫、天氣、降雨機率<br>
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/present.jpg)<br>
* 透過迴圈執行，分別取出3筆天氣資料，使用v-for使其自動生成天氣區塊，moment.js套件優化時間格式<br>
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/36hr.jpg)<br>
* 透過RWD調整移動端頁面，使網頁畫面可以自適應手機、平板等裝置<br>
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/mobile.jpg)<br>
* 手機版頁面使用@change方式取代原先的確認按鍵，優化使用者體驗<br>
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/change.jpg)
