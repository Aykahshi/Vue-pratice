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
        <span class="country">{{ city }}<br />實時氣象</span>
        <span class="chance">降雨機率：{{ rainchance }}％</span>
        <span class="tp1">{{ temperature }}°C</span>
      </div>
      <div class="contentR">
        <span class="now">現在日期時間</span>
        <span class="date">{{ date }}</span>
        <span class="time">{{ time }}</span>
      </div>
      <div class="imgandtp">
        <img v-if="isRainy" :src="rainImg" arc="" />
        <img v-else-if="isCloudy" :src="cloudyImg" arc="" />
        <img v-else-if="isSunny" :src="sunImg" arc="" />
        <img v-else-if="isSunC" :src="sunCloudImg" arc="" />
        <img v-else-if="isMcloudy" :src="moreCloudImg" arc="" />
        <img v-else :src="stormImg" arc="" />
        <div class="tp2">{{ temperature }}°C</div>
      </div>
    </div>
    <div class="main">
      <weather-card
        v-for="(data, index) in wxData"
        :key="index"
        :startTime="data.startTime"
        :endTime="data.endTime"
        :weatherInfo="data.parameter.parameterName"
        :imgURL="imgURL[index]"
      />
    </div>
  </section>
</template>

<script setup>
//引入moment.js插件
import moment from "moment";

// 引入設置好的API串接並獲取所需的資料;
import $http from "@/API/http";
import $google from "@/API/google";

import weatherCard from "@/components/weather-card.vue";

//預先引入圖片
import rainImg from "../assets/img/rain.png";
import cloudyImg from "../assets/img/cloudy.png";
import sunImg from "../assets/img/sun.png";
import sunCloudImg from "../assets/img/sun-cloud.png";
import moreCloudImg from "../assets/img/more-cloud.png";
import stormImg from "../assets/img//storm.png";

const wxData = ref([]);
const rainchance = ref("0");
const temperature = ref("0");
const city = ref("當前");
const selectedCity = ref(null); //默認選擇為null
const locations = ref([
  "嘉義縣",
  "新北市",
  "嘉義市",
  "新竹縣",
  "新竹市",
  "臺北市",
  "臺南市",
  "宜蘭縣",
  "苗栗縣",
  "雲林縣",
  "花蓮縣",
  "臺中市",
  "臺東縣",
  "桃園市",
  "南投縣",
  "高雄市",
  "金門縣",
  "屏東縣",
  "基隆市",
  "澎湖縣",
  "彰化縣",
  "連江縣",
]);
const date = ref("");
const time = ref("");

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

//圖片URLmap;
// const wImg = new Map([
//   ["rain", rainImg],
//   ["cloud", cloudyImg],
//   ["sun", sunImg],
//   ["sun-cloud", sunCloudImg],
//   ["more-cloud", moreCloudImg],
//   ["storm", stormImg],
// ]);

// const getWImg = (weather) => {
//   // let wImgURL;
//   // if (weather !== undefined) {
//   //   switch (true) {
//   //     case weather.includes("短暫雨"):
//   //       wImgURL = "rain";
//   //       break;
//   //     case weather.includes("陰天"):
//   //       wImgURL = "cloud";
//   //       break;
//   //     case weather.includes("晴") && !weather.includes("多雲"):
//   //       wImgURL = "sun";
//   //       break;
//   //     case weather.includes("晴") && weather.includes("多雲"):
//   //       wImgURL = "sun-cloud";
//   //       break;
//   //     case weather.includes("多雲") && !weather.includes("晴"):
//   //       wImgURL = "more-cloud";
//   //       break;
//   //     case weather.includes("豪大雨"):
//   //       wImgURL = "storm";
//   //       break;
//   //     default:
//   //       console.log("Error");
//   //   }
//   // }
//   return wImg.get(weather);
// };

//圖片判斷規則
let isRainy = false;
let isCloudy = false;
let isSunny = false;
let isSunC = false;
let isMcloudy = false;

const imgURL = ref(["", "", ""]);

//圖片變更事件
const weatherUpdate = () => {
  for (let i = 0; i < 3; i++) {
    const data = wxData.value[i].parameter.parameterName;
    if (data !== undefined) {
      switch (true) {
        case data.includes("短暫雨"):
          isRainy = true;
          imgURL.value[i] = rainImg;
          break;
        case data.includes("陰天"):
          isCloudy = true;
          imgURL.value[i] = cloudyImg;
          break;
        case data.includes("晴") && !data.includes("多雲"):
          isSunny = true;
          imgURL.value[i] = sunImg;
          break;
        case data.includes("晴") && data.includes("多雲"):
          isSunC = true;
          imgURL.value[i] = sunCloudImg;
          break;
        case data.includes("多雲") && !data.includes("晴"):
          isMcloudy = true;
          imgURL.value[i] = moreCloudImg;
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
  getTime();
  getPosition();
});
</script>
