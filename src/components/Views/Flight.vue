<template>
  <div>
    <p>인천국제공항공사_국가별 항공 통계 서비스 (25.08.06)</p>

    <div class="control-bar">
      <select v-model="selectedCode" @change="onSelectChange">
        <option v-for="flight in flights" :key="flight.code" :value="flight.code">
          {{ flight.val }}
        </option>
      </select>
      <button @click="dataLoad">데이터 조회</button>
    </div>

    <IBSheetVue
      v-if="showSheet"
      :options="sheetOption"
      :style="{ width: '100%', height: '350px' }"
      @instance="getInstance"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, nextTick } from 'vue';
import { IBSheetVue, type IBSheetInstance, type IBSheetOptions } from '@ibsheet/vue';

const sheet = shallowRef<IBSheetInstance | undefined>(undefined);
const showSheet = shallowRef(true);
const flights = [
  { code: 'country', val: '국가별 항공통계-운항편' },
  { code: 'passenger', val: '국가별 항공통계-여객' },
  { code: 'cargo', val: '국가별 항공통계-화물' }
];
const selectedCode = ref(flights[0].code);

const country_cols = [
  { Header: '지역 구분명', Name: 'region', Type: "Text", Align: "Center" },
  { Header: '국가명', Name: 'country', Type: "Text", RelWidth: 1, MinWidth: 150 },
  { Header: '출발편수(편)', Name: 'depFlight', Type: 'Int', Width: 150 },
  { Header: '도착편수(편)', Name: 'arrFlight', Type: 'Int', Width: 150 },
  { Header: '합계편수(편)', Name: 'flights', Type: 'Int', Width: 150 },
];
const country_event = (evt: any) => {
  if (!evt.data) return;
  const data = typeof evt.data === 'string' ? JSON.parse(evt.data) : evt.data;
  data.forEach((row: any) => {
    row.depFlight = row.depFlight.replaceAll(',', '');
    row.arrFlight = row.arrFlight.replaceAll(',', '');
    row.flights = row.flights.replaceAll(',', '');
  });
  return data;
};

const passenger_cols = [
  { Header: '지역 구분명', Name: 'region', Type: "Text", Align: "Center" },
  { Header: '국가명', Name: 'country', Type: "Text", RelWidth: 1, MinWidth: 150 },
  { Header: '출발승객수(명)', Name: 'depPassenger', Type: 'Int', Width: 150 },
  { Header: '도착승객수착(명)', Name: 'arrPassenger', Type: 'Int', Width: 150 },
  { Header: '합계승객수(명)', Name: 'passenger', Type: 'Int', Width: 150 },
];
const passenger_events = (evt: any) => {
  if (!evt.data) return;
  const data = typeof evt.data === 'string' ? JSON.parse(evt.data) : evt.data;
  data.forEach((row: any) => {
    row.depPassenger = row.depPassenger.replaceAll(',', '');
    row.arrPassenger = row.arrPassenger.replaceAll(',', '');
    row.passenger = row.passenger.replaceAll(',', '');
  });
  return data;
};

const cargo_cols = [
  { Header: '지역 구분명', Name: 'region', Type: "Text", Align: "Center" },
  { Header: '국가명', Name: 'country', Type: "Text", RelWidth: 1, MinWidth: 150 },
  { Header: '출발화물(톤)', Name: 'depBaggage', Type: 'Int', Width: 150 },
  { Header: '도착화물(톤)', Name: 'arrBaggage', Type: 'Int', Width: 150 },
  { Header: '합계화물(톤)', Name: 'baggage', Type: 'Int', Width: 150 },
];
const cargo_events = (evt: any) => {
  if (!evt.data) return;
  const data = typeof evt.data === 'string' ? JSON.parse(evt.data) : evt.data;
  data.forEach((row: any) => {
    row.depBaggage = row.depBaggage.replaceAll(',', '');
    row.arrBaggage = row.arrBaggage.replaceAll(',', '');
    row.baggage = row.baggage.replaceAll(',', '');
  });
  return data;
};

const sheetOption = ref<IBSheetOptions>({
  Cfg: { SearchMode: 2 },
  Cols: country_cols // 초기 컬럼 설정
});

function getColsByCode(code: string) {
  switch (code) {
    case 'country': return country_cols;
    case 'passenger': return passenger_cols;
    case 'cargo': return cargo_cols;
    default: return country_cols;
  }
}

async function onSelectChange() {
  if (sheet.value) {
    sheet.value.dispose();
    sheet.value = undefined;
  }

  showSheet.value = false;

  sheetOption.value = {
    Cfg: { SearchMode: 2 },
    Cols: getColsByCode(selectedCode.value)
  };

  await nextTick();
  showSheet.value = true;
}

function getInstance(instance: IBSheetInstance) {
  sheet.value = instance;

  sheet.value.unbind('onReceiveData');

  if (selectedCode.value === 'country') {
    sheet.value.bind('onReceiveData', country_event);
  } else if (selectedCode.value === 'passenger') {
    sheet.value.bind('onReceiveData', passenger_events);
  } else if (selectedCode.value === 'cargo') {
    sheet.value.bind('onReceiveData', cargo_events);
  }
}

async function dataLoad() {
  if (!sheet.value) {
    alert("시트가 생성되지 않았습니다.");
    return;
  }

  const jsonMap: { [key: string]: string } = {
    country: 'assets/json/flight_country.json',
    passenger: 'assets/json/flight_passenger.json',
    cargo: 'assets/json/flight_cargo.json'
  };
  const jsonPath = jsonMap[selectedCode.value];

  if (jsonPath) {
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
}
</script>

<style scoped>
.control-bar {
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}
button, select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #f0f0f0;
}
</style>
