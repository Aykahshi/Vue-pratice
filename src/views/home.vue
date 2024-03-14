<template>
  <header>
    <img class="logo" src="@/assets/img/weather.png" alt="氣象查詢" />
    <h1 class="title">36小時區域氣象</h1>
  </header>
  <section>
    <div class="selecter">
      <label class="select">
        請選擇地區
        <select class="normal-select" v-model="selectedCity">
          f
          <option :value="null" disabled selected>選擇縣市</option>
          <option v-for="i in locations" :value="i">
            {{ i }}
          </option>
        </select>
        <!-- 移動端下拉選單 -->
        <select class="mobile-select" v-model="selectedCity" @change="comfirm">
          <option :value="null" disabled selected>選擇縣市</option>
          <option v-for="i in locations" :value="i">
            {{ i }}
          </option>
        </select>
      </label>
      <button class="yes" @click="comfirm">確認縣市</button>
      <button class="reset" @click="reset">重置</button>
    </div>
    <div class="mobile-btn">
      <button class="reset-mobile" @click="reset">重置</button>
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
      <div class="imgandtp">
        <img class="wImg" :src="wImg[0]" arc="" />
        <div class="tp2">{{ temperature }}°C</div>
      </div>
    </div>
    <div class="main">
      <div class="weather" v-for="(data, index) in wxData" :key="index">
        <span>
          {{ moment(new Date(data.startTime)).format("MM/DD HH:mm") }}
        </span>
        <span>~</span>
        <span>
          {{ moment(new Date(data.endTime)).format("MM/DD HH:mm") }}
        </span>
        <span>{{ data.parameter.parameterName }} </span>
        <img class="wImg" :src="wImg[index]" arc="" />
      </div>
    </div>
  </section>
</template>

<script setup>
// 透過axios進行API串接並獲取所需的資料;
import moment from "moment";
import axios from "axios";

import $http from "@/API/http";
import $google from "@/API/google";

import Imgrain from "@/assets/img/rain.png";
import Imgcloud from "@/assets/img/cloudy.png";
import Imgsun from "@/assets/img/sun.png";
import Imgsc from "@/assets/img/sun-cloud.png";
import Imgmc from "@/assets/img/more-cloud.png";
import Imgstorm from "@/assets/img/storm.png";

const wxData = ref([]);
const rainchance = ref("0");
const temperature = ref("0");
const city = ref("當前");
const selectedCity = ref(null); //默認選擇為null
const locations = ref([]);
const wImg = ref(["", "", ""]);
const date = ref("2000-01-01");
const time = ref("00:00:00");

//獲取當前時間與日期
const getTime = () => {
  let now = new Date();
  date.value = moment(now).format("YYYY/MM/DD");
  time.value = moment(now).format("HH:mm:ss");
};
setInterval(getTime, 1000);

//按下確認按鈕時取得當前選擇縣市資料，並同時改變氣象預報前的地區名稱
const comfirm = () => {
  if (selectedCity.value) {
    getWeatherData(selectedCity.value);
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
            const locationName =
              results[results.length - 2].address_components[0].long_name; // 從地址中提取出縣市資訊

            getWeatherData(locationName);
          }
        });
    });
  }
};

//圖片變更事件
const weatherUpdate = () => {
  for (let i = 0; i < 3; i++) {
    const data = wxData.value[i].parameter.parameterName;
    if (data !== undefined) {
      switch (true) {
        case data.includes("短暫雨"):
          wImg.value[i] = Imgrain;
          break;
        case data.includes("陰天"):
          wImg.value[i] = Imgcloud;
          break;
        case data.includes("晴") && !data.includes("多雲"):
          wImg.value[i] = Imgsun;
          break;
        case data.includes("晴") && data.includes("多雲"):
          wImg.value[i] = Imgsc;
          break;
        case data.includes("多雲") && !data.includes("晴"):
          wImg.value[i] = Imgmc;
          break;
        case data.includes("豪大雨"):
          wImg.value[i] = Imgstorm;
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

function getWeatherData(local) {
  $http
    .get("/api/v1/rest/datastore/F-C0032-001", {
      params: {
        locationName: local,
      },
    })
    .then((rs3) => {
      //獲取降雨機率
      rainchance.value =
        rs3.data.records.location[0].weatherElement[1].time[0].parameter.parameterName;
      //獲取氣溫資訊
      temperature.value =
        rs3.data.records.location[0].weatherElement[2].time[0].parameter.parameterName;
      //獲取資料中的三筆天氣資訊

      for (let i = 0; i < 3; i++) {
        wxData.value[i] =
          rs3.data.records.location[0].weatherElement[0].time[i];
      }

      city.value = local;
      weatherUpdate();
    });
}

onMounted(() => {
  $http
    .get("/api/v1/rest/datastore/F-C0032-001", {
      params: {
        locationName: "",
      },
    })
    .then((rs1) => {
      // 取得API數據並賦予locations陣列
      for (let i = 0; i < rs1.data.records.location.length; i++) {
        locations.value[i] = rs1.data.records.location[i].locationName;
      }
    })

    .catch((error) => {
      console.log(error);
    });

  getTime();
  getPosition();
});
</script>
