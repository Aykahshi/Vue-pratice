<template>
  <header>
    <img class="logo" src="/src/assets/img/weather.png" alt="氣象查詢" />
    <h1 class="title">36小時區域氣象</h1>
  </header>
  <section>
    <div class="selecter">
      <label class="select">
        請選擇地區
        <select v-model="selectedCity">
          <option :value="null" disabled selected>選擇縣市</option>
          <option v-for="location in locations" :value="location.locationName">
            {{ location.locationName }}
          </option>
        </select>
      </label>
      <button class="yes" @click="comfirm">確認縣市</button>
      <button class="reset" @click="reset">重置</button>
    </div>
    <div class="present">
      <div class="contentL">
        <span class="country">{{ city }}實時氣象</span>
        <span class="chance">降雨機率：{{ rainchance }}％</span>
        <span class="tp1">{{ temperature }}°C</span>
      </div>
      <div class="contentR">
        <span class="now">現在日期時間</span>
        <span class="date">{{ date }}</span>
        <span class="time">{{ time }}</span>
      </div>
      <img class="wImg" :src="wImg[0]" arc="" />
    </div>
    <div class="main">
      <div class="weather" v-for="(data, index) in wxData" :key="index">
        <span>{{ startTime }}</span>
        <span>~</span>
        <span>{{ endTime }}</span>
        <span>{{ data }}</span>
        <img class="wImg" :src="wImg[index]" arc="" />
      </div>
    </div>
  </section>
</template>

<script setup>
// 透過axios進行API串接並獲取所需的資料;
import axios from "axios";
import $http from "@/API/http";
import $google from "@/API/google";
const wxData = ref([]);
const rainchance = ref("0");
const temperature = ref("0");
const city = ref("當前");
const selectedCity = ref(null); //默認選擇為null
const locations = ref([]); //賦值給locations一個空的陣列
const wImg = ref(["", "", ""]);
const date = ref("2000-01-01");
const time = ref("00:00:00");
const startTime = ref();
const endTime = ref();

//獲取當前時間與日期
const getTime = () => {
  let now = new Date();

  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // 補零
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  date.value = year + "-" + month + "-" + day;
  time.value = hours + ":" + minutes + ":" + seconds;
};
setInterval(getTime, 1000);

//按下確認按鈕時取得當前選擇縣市資料，並同時改變氣象預報前的地區名稱
const comfirm = () => {
  if (selectedCity.value) {
    $http
      .get("/api/v1/rest/datastore/F-C0032-001", {
        params: {
          locationName: selectedCity.value,
        },
      })
      .then((rs2) => {
        //獲取起訖時間
        startTime.value =
          rs2.data.records.location[0].weatherElement[0].time[0].startTime;
        endTime.value =
          rs2.data.records.location[0].weatherElement[0].time[0].endTime;
        //獲取降雨機率
        rainchance.value =
          rs2.data.records.location[0].weatherElement[1].time[0].parameter.parameterName;
        //獲取氣溫資訊
        temperature.value =
          rs2.data.records.location[0].weatherElement[2].time[0].parameter.parameterName;
        //獲取資料中的三筆天氣資訊
        for (let i = 0; i < 3; i++) {
          wxData.value[i] =
            rs2.data.records.location[0].weatherElement[0].time[
              i
            ].parameter.parameterName;
        }
        weatherUpdate();
      });
    city.value = selectedCity.value;
  }
};

// 利用Geolocation API獲取使用者當前位置
const getPosition = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      $google
        .get("/maps/api/geocode/json", {
          params: {
            latlng: latitude + "," + longitude,
            language: "zh-TW",
          },
        })
        .then((response) => {
          const results = response.data.results;
          if (results[0]) {
            const address = results[8].formatted_address;
            let parts = address.split("台灣");
            const locationName = parts[1]; // 從地址中提取出縣市資訊
            // 使用縣市資訊來發送 API 請求
            $http
              .get("/api/v1/rest/datastore/F-C0032-001", {
                params: {
                  locationName: locationName.value,
                },
              })
              .then((rs3) => {
                //獲取起訖時間
                startTime.value =
                  rs3.data.records.location[0].weatherElement[0].time[0].startTime;
                endTime.value =
                  rs3.data.records.location[0].weatherElement[0].time[0].endTime;
                //獲取降雨機率
                rainchance.value =
                  rs3.data.records.location[0].weatherElement[1].time[0].parameter.parameterName;
                //獲取氣溫資訊
                temperature.value =
                  rs3.data.records.location[0].weatherElement[2].time[0].parameter.parameterName;
                //獲取資料中的三筆天氣資訊
                for (let i = 0; i < 3; i++) {
                  wxData.value[i] =
                    rs3.data.records.location[0].weatherElement[0].time[
                      i
                    ].parameter.parameterName;
                }
                city.value = locationName;
                weatherUpdate();
              });
          }
        });
    });
  }
};

//圖片變更事件
const weatherUpdate = () => {
  for (let i = 0; i < 3; i++) {
    console.log(wxData.value[i]);
    if (wxData.value[i] !== undefined) {
      switch (true) {
        case wxData.value[i].includes("短暫雨"):
          wImg.value[i] = "/src/assets/img/rain.png";
          break;
        case wxData.value[i].includes("陰天"):
          wImg.value[i] = "/src/assets/img/cloudy.png";
          break;
        case wxData.value[i].includes("晴") &&
          !wxData.value[i].includes("多雲"):
          wImg.value[i] = "/src/assets/img/sun.png";
          break;
        case wxData.value[i].includes("晴") && wxData.value[i].includes("多雲"):
          wImg.value[i] = "/src/assets/img/sun-cloud.png";
          break;
        case wxData.value[i].includes("多雲") &&
          !wxData.value[i].includes("晴"):
          wImg.value[i] = "/src/assets/img/more-cloud.png";
          break;
        case wxData.value[i].includes("豪大雨"):
          wImg.value[i] = "/src/assets/img/storm.png";
          break;
        default:
          console.log("Error");
      }
    }
  }
};

//重置按鈕
const reset = () => {
  selectedCity.value = null;
  getPosition();
};

onMounted(async () => {
  await axios
    .get("https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001", {
      params: {
        Authorization: "CWA-2977C9FC-E45A-47BA-A5EA-966C0BE1136C",
        locationName: "",
      },
    })
    .then((rs1) => {
      console.clear();
      // 取得API數據並賦予locations陣列
      locations.value = rs1.data.records.location;
      console.log(locations);
    })

    .catch((error) => {
      console.log(error);
    });
  getTime();
  getPosition();
});
</script>
