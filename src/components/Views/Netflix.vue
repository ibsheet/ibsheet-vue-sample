<template>
  <div>
    <p>넷플릭스 국가별 최고인기 작품 (영화, TV) (2025년 8월 8일 기준 by https://flixpatrol.com/)</p>

    <IBSheetVue
      :options="sheetOption"
      :style="{ width: '100%', height: '500px' }"
      @instance="getInstance"
    />
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

import { IBSheetVue, type IBSheetInstance, type IBSheetOptions } from '@ibsheet/vue';

const sheet = shallowRef<IBSheetInstance | undefined>(undefined);

async function dataLoad() {
  if (!sheet.value) {
    console.error("시트가 생성되지 않았습니다.");
    return;
  }

  const jsonPath = 'assets/json/netflix_favorite.json';

  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    sheet.value.loadSearchData(data);
  } catch (error) {
    console.error("데이터 로딩에 실패했습니다:", error);
    alert("데이터를 불러오는 중 오류가 발생했습니다.");
  }
}

function getInstance(instance: IBSheetInstance) {
  sheet.value = instance;
}

const sheetOption: IBSheetOptions = {
  Cfg: {
    SearchMode: 2,
    NoVScroll: true,
    CanEdit: 0,
    HeaderMerge: 5,
  },
  Cols: [
    { Header: "국가", Name: "n_country", Type: "Html", Width: 250, TextSize: '18px', TextFont: "Inter var,ui-sans-serif,system-ui,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'", Color: "#1f2937", TextColor: "white", CanFocus: 0 },
    { Header: "최고인기 영화", Name: "n_topMovie", Type: "Html", MinWidth: 350, RelWidth: 1, TextSize: '18px', TextFont: "Inter var,ui-sans-serif,system-ui,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'", Color: "#1f2937", TextColor: "white", CanFocus: 0 },
    { Header: "최고인기 TV방송", Name: "n_topTvShow", Type: "Html", MinWidth: 350, RelWidth: 1, TextSize: '18px', TextFont: "Inter var,ui-sans-serif,system-ui,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'", Color: "#1f2937", TextColor: "white", CanFocus: 0 },
  ],
  Events: {
    // 데이터를 받은 후, HTML 컬럼에 표시할 내용을 가공하는 이벤트 핸들러입니다.
    onReceiveData: (evt: any) => {
      let data = evt.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      data.forEach((row: any) => {
        const countrySpt = row['countryFlagImage'].split('|');
        row['n_country'] = `<img border="0" draggable="false" width="20px" src="${countrySpt[1]}"> ${row['country']}`;

        const movieSpt = row['topMovieImage'].split('|');
        row['n_topMovie'] = `<img border="0" draggable="false" width="40px" src="${movieSpt[1]}"> ${row['topMovie']}`;

        const tvSpt = row['topTvShowImage'].split('|');
        row['n_topTvShow'] = `<img border="0" draggable="false" width="40px" src="${tvSpt[1]}"> ${row['topTvShow']}`;
      });

      return data;
    },
    onRenderFirstFinish: () => {
      dataLoad();
    }
  }
};
</script>

<style scoped>
p {
  margin-bottom: 10px;
}
</style>
