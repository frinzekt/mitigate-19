<template>
  <div class="chartdiv" ref="chartdiv" id="chartdiv" style="width: 100%; height:100%">
      <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="70%"
    >
      <v-card>
        <v-card-title class="headline">
          Simulate COVID-19 mitigation strategies for:
           <span class="ml-3 "><b><u>{{selectedCountry}}</u></b></span>
        </v-card-title>
        <v-card-text>Let Google help apps determine location.
          This means sending anonymous location data to Google, even when no apps are running.
          </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click='zoomOutBro'
          >
            Choose another
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Proceed with {{selectedCountry}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  </div>
</template>
<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';

am4core.useTheme(am4themes_animated);

export default {
  components: { },
  data: () => ({
    dialog: false,
    selectedCountry: '',
  }),
  methods: {
    zoomOutBro() {
      this.dialog = false;
      this.selectedCountry = '';
      window.chart.goHome();
    },
  },
  mounted() {
    // Create map instance
    const chart = am4core.create('chartdiv', am4maps.MapChart);
    window.chart = chart;
    chart.width = am4core.percent(100);
    chart.height = am4core.percent(100);
    chart.chartContainer.wheelable = false;

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}';
    polygonTemplate.fill = am4core.color('#74B266');

    // Create hover state and set alternative fill color
    const hs = polygonTemplate.states.create('hover');
    hs.properties.fill = am4core.color('#367B25');

    polygonTemplate.events.on('hit', (ev) => {
      // zoom to an object
      ev.target.series.chart.zoomToMapObject(ev.target);
      this.selectedCountry = ev.target.dataItem.dataContext.name;
      this.dialog = !this.dialog;
      // get object info
      console.log(ev.target.dataItem.dataContext.name);
    });
  },
};
</script>
