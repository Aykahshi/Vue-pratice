該專案為個人Vue練習專案，網站主要內容如下：<br>
gh-pages:https://aykahshi.github.io/
=====
## 0320維護更新：
* 修復Query City API失效問題，考量到縣市列表不會更動，因此將下拉式選單寫死節省網頁性能。<br>
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/location-list.jpg)<br>
* 將畫面中實時氣象區塊的圖片寫死，並透過v-if進行判斷，以避免每次判斷圖片都須重新載入URL的卡頓。<br>
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/imgchange.jpg)<br>
* 將最下方的天氣區塊製作成component，作為組件化練習。<br>
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/component.jpg)<br>
### 留言：此專案將持續擴大，日後會先以優化氣象查詢網站為主，並持續追加新的練習項目。
=====
* 進入網站時，透過Google Geolocation API獲取使用者位置<br>
![image](https://github.com/Aykahshi/Vue-pratice/blob/main/performance/start.jpg)<br>
* 透過預先設定好的縣市資料陣列，使用v-for使其自動生成下拉式選單<br>
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

