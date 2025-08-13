<template>
  <div>
    <p>행정안전부_민방위대피시설 (24.03.19)</p>

    <div class="control-bar">
      <button @click="dataLoad">데이터 조회</button>
    </div>

    <IBSheetVue
      :options="sheetOption"
      :style="{ width: '100%', height: '500px' }"
      @instance="getInstance"
    />
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { IBSheetVue, IB_Preset, type IBSheetInstance, type IBSheetOptions } from '@ibsheet/vue';

const sheet = shallowRef<IBSheetInstance | undefined>(undefined);

const sheetOption: IBSheetOptions = {
  Cfg: {
    SearchMode: 2
  },
  LeftCols: [
    { Type: "Int", Width: 100, Align: "Center", Name: "SEQ" }
  ],
  Cols: [
    { Header: '관리번호', Name: 'managerment_number', Type: 'Text', Width: 150 },
    { Header: '지정일자', Name: 'designated_date', Extend: IB_Preset.YMD, Width: 150, DataFormat: "yyyy-MM-dd" },
    { Header: '해제일자', Name: 'release_date', Extend: IB_Preset.YMD, Width: 150, DataFormat: "yyyy-MM-dd" },
    { Header: '운영상태', Name: 'status', Type: 'Text', Width: 100, Align: "Center" },
    { Header: '시설명', Name: 'facility_name', Type: 'Text', Width: 250 },
    { Header: '시설구분', Name: 'facility_type', Type: 'Text', Width: 150, Align: "Center" },
    { Header: '도로명전체주소', Name: 'addr_doro', Type: 'Text', MinWidth: 300, RelWidth: 1 },
    { Header: '소재지전체주소', Name: 'addr_jibun', Type: 'Text', MinWidth: 300, RelWidth: 1 },
    { Header: '도로명우편번호', Name: 'post_no_doro', Type: 'Text', Width: 100, Align: "Center" },
    { Header: '시설위치(지상/지하)', Name: 'facility_location', Type: 'Text', Width: 150, Align: "Center" },
    { Header: '시설면적(㎡)', Name: 'facility_area', Type: 'Text', Width: 150, Align: "Center" },
    { Header: '최대수용인원', Name: 'maximum_capacity', Type: 'Text', Width: 150, Align: "Center" },
    { Header: '위도 (GPS)', Name: 'latitude_epsg4326', Type: 'Text', Width: 150 },
    { Header: '경도 (GPS)', Name: 'longitude_epsg4326', Type: 'Text', Width: 150 },
  ]
};

function getInstance(instance: IBSheetInstance) {
  sheet.value = instance;
}

async function dataLoad() {
  if (!sheet.value) {
    alert("시트가 생성되지 않았습니다.");
    return;
  }

  const jsonPath = 'assets/json/civil_defense_shelter.json';

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
</script>

<style scoped>
.control-bar {
  margin-bottom: 10px;
}
button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #f0f0f0;
}
</style>
