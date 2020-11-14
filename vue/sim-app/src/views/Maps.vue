<template>
        <div class="chartdiv" ref="chartdiv" id="chartdiv" style="width: 100%;height:100%">
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
  }),
  mounted() {
    // Create map instance
    const chart = am4core.create('chartdiv', am4maps.MapChart);
    chart.width = am4core.percent(100);
    chart.height = am4core.percent(100);

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

      // get object info
      console.log(ev.target.dataItem.dataContext.name);
    });
    // PREVENT RIGHT CLICK CONTEXT MENU
    document.addEventListener('contextmenu', (event) => event.preventDefault());
    polygonTemplate.events.on('rightclick', (ev) => {
      chart.goHome();

      // get object info
      console.log(ev.target.dataItem.dataContext.name);
    });
  },
};
</script>
