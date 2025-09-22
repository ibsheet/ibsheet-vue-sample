<template>
  <div>
    <p>서울시 정류장 운행 통계 (25.08.05)</p>

    <div class="control-bar">
      <button @click="dataLoad">데이터 조회</button>
    </div>

    <IBSheetVue
      :options="sheetOption"
      :style="{ width: '100%', height: '350px' }"
      @instance="getInstance"
    />
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { IBSheetVue, type IBSheetInstance, type IBSheetOptions, type IBSheetEvents } from '@ibsheet/vue';

const sheet = shallowRef<IBSheetInstance | undefined>(undefined);

const handleSearchFinish: IBSheetEvents['onSearchFinish'] = (param) => { 
    // The type of the parameter is automatically inferred.
    param.sheet.showFilterRow();
};

const sheetOption: IBSheetOptions = {
  Cfg: {
    SearchMode: 0,
  },
  LeftCols: [
    { Type: "Int", Width: 80, Align: "Center", Name: "SEQ" }
  ],
  Cols: [
    { Header: "정류장ID", Name: "nodeId", Type: "Text", MinWidth: 120 },
    { Header: "정류장명", Name: "nodeNm", Type: "Text", Align: "Center", NumberSort: true, MinWidth: 150, RelWidth: 1 },
    { Header: "노선명", Name: "routeNm", Type: "Text", Align: "Center" },
    { Header: "노선유형", Name: "routeTy", Type: "Enum", EnumKeys: "|1|2|3|4|5|6|7|8|10", Enum: "|공항|마을|간선|지선|순환|광역|인천|경기|관광" },
    { Header: "승차인원", Name: "tkcarNmpr", Type: "Int" },
    { Header: "하차인원", Name: "gffNmpr", Type: "Int" },
    { Header: "재차인원", Name: "nownmprNmpr", Type: "Int" },
    { Header: "구간명", Name: "sctnNm", Type: "Text", Align: "Center" },
    { Header: "구간거리", Name: "sctnDstnc", Type: "Float", Align: "Center", MinWidth: 200, RelWidth: 1 },
    { Header: "기준일자", Name: "stdrDe", Type: "Date", DataFormat: "yyyyMMdd", Format: "yyyy-MM-dd" },
  ],
  Events: {
    onSearchFinish: handleSearchFinish
  }
};

function getInstance(instance: IBSheetInstance) {
  sheet.value = instance;
}

async function dataLoad() {
  if (!sheet.value) {
    alert("시트가 생성되지 않았습니다.");
    return;
  }

  const jsonPath = 'assets/json/bus_traffic.json';

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
