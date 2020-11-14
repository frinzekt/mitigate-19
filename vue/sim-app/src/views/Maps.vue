<template>
      <gmaps-map>
        <gmaps-info-window v-for="(item, i) in items" :key="i" :options="item.options">
            <p class="black--text">{{item.countryName}}</p>
            <v-btn>Click</v-btn>
        </gmaps-info-window>
      </gmaps-map>
</template>

<script>
import { gmapsMap, gmapsInfoWindow } from 'x5-gmaps';
import mapsData from '../data/maps';

export default {
  components: { gmapsMap, gmapsInfoWindow },
  data: () => ({
    items: mapsData,
  }),
};
</script>
