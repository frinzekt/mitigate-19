<template>
  <div
    class='chartdiv'
    ref='chartdiv'
    id='chartdiv'
    style='width: 100%; height: 100%'
  >
    <v-dialog v-model='introDialogue' width='60%' persistent>
      <v-overlay
        :z-index="100"
        :value="introDialogue"
      >
        <v-card>
          <v-card-title class='headline'>
            Welcome to the COVID-19 mitigation strategy simulator.
          </v-card-title>
          <v-card-text>
            Please select a country that you wish to model the mitigation
            simulation.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color='green darken-1' text @click='introDialogue = false'>
              Begin
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
    </v-dialog>
    <v-dialog v-model='dialog' persistent max-width='70%'>
      <v-card>
        <v-card-title class='headline'>
          Simulate COVID-19 mitigation strategies for:
          <span class='ml-3'
            ><b
              ><u>{{ selectedCountry }}</u></b
            ></span
          >
        </v-card-title>
        <v-card-text>
          <div v-if='Object.keys(this.selectedCountryStats).length == 0'>
            <p>
              <b>ERROR:</b> Currently no data available for
              {{ selectedCountry }}.
            </p>
          </div>
          <div v-else>
            <br />
            <br />
            <h3><u>Country Statistics</u></h3>
            <br />
            <ul
              v-for='([statname, value], i) in Object.entries(
                selectedCountryStats
              ).slice(15)'
              :key='i'
            >
              <p>
                <b>> {{ capFirst(statname) }}:</b> {{ Math.round(value) }}
                {{ unitOf(capFirst(statname)) }}
              </p>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color='red darken-1' text @click='zoomOutBro'>
            Choose another
          </v-btn>
          <v-btn
            color='green darken-1'
            text
            @click='(dialog = false),
            (formDialogue = true),
            (countryInitSusceptible = selectedCountryPopulation - 1)'
            :disabled='Object.keys(this.selectedCountryStats).length == 0'
          >
            Proceed with {{ selectedCountry }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model='formDialogue' persistent max-width='70%'>
      <v-card>
        <v-card-title class='headline'>
          Initial {{ selectedCountry }} COVID-19 parameters:
        </v-card-title>
        <v-card-text
        @mouseover="initSusceptibleAdapt">
          <v-form>
            <v-text-field
              class='ma-4'
              label='Total Population'
              v-model='selectedCountryPopulation'
              required
              readonly
            ></v-text-field>

            <v-text-field
              class='ma-4'
              label='Infected Persons'
              v-model='countryInitInfected'
              required
              type='number'
              @change='initSusceptibleAdapt'
            ></v-text-field>

            <v-text-field
              class='ma-4'
              label='Resolved Cases'
              v-model='countryInitResolved'
              required
              type='number'
              @change='initSusceptibleAdapt'
            ></v-text-field>

            <v-text-field
              class='ma-4'
              label='Susceptible Persons'
              v-model='countryInitSusceptible'
              required
              readonly
              type='number'
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color='red darken-1' text @click='zoomOutBro2'> Cancel </v-btn>
          <v-btn
            color='green darken-1'
            text
            @click='selectCountry'
            :disabled='Object.keys(this.selectedCountryStats).length == 0'
          >
            Proceed with {{ selectedCountry }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import mapsData, {
  convert3LetterCountry,
  convert2LetterCountry,
} from '../data/maps';

am4core.useTheme(am4themes_animated);

export default {
  components: {},
  data: () => ({
    introDialogue: true,
    dialog: false,
    formDialogue: false,
    selectedCountry: '',
    selectedCountryStats: {},
    selectedCountryPopulation: 0,
    countryInitInfected: 1,
    countryInitResolved: 0,
    /* eslint-disable */
    countryInitSusceptible: 0,
  }),
  methods: {
    formDialogueValidator() {
      if (
        this.countryInitInfected > this.selectedCountryPopulation
        || this.countryInitResolved > this.selectedCountryPopulation
        || this.countryInitResolved + this.countryInitInfected > this.selectedCountryPopulation
        || this.countryInitResolved < 0
        || this.countryInitInfected < 1
        ) {
        return false;
      } else {
        return true;
      }
    },
    initSusceptibleAdapt() {
      if (this.countryInitInfected < 1) {
        this.countryInitInfected = 1;
      }
      if (this.countryInitResolved < 0) {
        this.countryInitResolved = 0;
      }
      if (this.countryInitResolved + this.countryInitInfected > this.selectedCountryPopulation) {
        this.countryInitResolved = 0;
        this.countryInitInfected = 1;
      }
      this.countryInitSusceptible = this.selectedCountryPopulation
      - this.countryInitInfected
      - this.countryInitResolved;
    },
    selectCountry() {
      this.formDialogue = false;
      const countryStats = {
        intercept: this.selectedCountryStats[0],
        population: this.selectedCountryStats.population,
        coefficients: {
          0: this.selectedCountryStats[1],
          1: this.selectedCountryStats[2],
          2: this.selectedCountryStats[3],
          3: this.selectedCountryStats[4],
          4: this.selectedCountryStats[5],
          5: this.selectedCountryStats[6],
          6: this.selectedCountryStats[7],
          7: this.selectedCountryStats[8],
          8: this.selectedCountryStats[9],
          9: this.selectedCountryStats[10],
          10: this.selectedCountryStats[11],
          11: this.selectedCountryStats[12],
          12: this.selectedCountryStats[13],
          13: this.selectedCountryStats[14],
        },
      }
      const stateObj = {
        ...countryStats,
        initialInfected: parseInt(this.countryInitInfected),
        initialResolved: parseInt(this.countryInitResolved),
        initialSusceptible: parseInt(this.countryInitSusceptible),
        countryName: this.selectedCountry,
      };
      const valid = this.formDialogueValidator();
      if (valid === true) {
        this.formDialogue = false;
        this.$store.commit('setInitState', stateObj);
        console.log(this.selectedCountryStats);
        console.log(stateObj);
        this.routeToSimulation();
      } else {
        alert('ERROR: Non-conformity found in initial values. Please correct input values.')
        this.countryInitResolved = 0;
        this.countryInitInfected = 1;
      }
    },
    zoomOutBro() {
      this.dialog = false;
      this.selectedCountry = '';
      this.selectedCountryPopulation = 0;
      window.chart.goHome();
    },
    zoomOutBro2() {
      this.formDialogue = false;
      this.dialog = false;
      this.selectedCountry = '';
      this.selectedCountryPopulation = 0;
      this.countryInitInfected = 1;
      this.countryInitResolved = 0;
      window.chart.goHome();
    },
    capFirst(stringg) {
      const out = stringg.replace(/_/g, ' ');
      return out.charAt(0).toUpperCase() + out.slice(1);
    },
    /* eslint-disable */
    unitOf(stringg) {
      if (stringg === 'Population') {
        return 'Persons';
      } else if (stringg === 'Population density') {
        return ' Persons per km squared';
      } else if (stringg === 'Gdp per capita') {
        return ' US Dollars';
      } else if (stringg === 'Life expectancy') {
        return ' Years';
      }
    },
    routeToSimulation() {
      this.$router.push('/home');
    },
    /* eslint-enable */
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
    polygonTemplate.fill = am4core.color('#ffffff');

    // Create hover state and set alternative fill color
    const hs = polygonTemplate.states.create('hover');
    hs.properties.fill = am4core.color('#367B25');
    window.polygonSeries = polygonSeries;
    window.am4core = am4core;

    polygonTemplate.events.on('hit', (ev) => {
      window.selectedCountryCode = convert2LetterCountry(
        ev.target.dataItem.dataContext.id,
      );
      // zoom to an object
      ev.target.series.chart.zoomToMapObject(ev.target);
      /* eslint-disable */
      this.selectedCountry = ev.target.dataItem.dataContext.name;

      this.dialog = !this.dialog;
      // get object info
      if (mapsData.hasOwnProperty(window.selectedCountryCode)) {
        this.selectedCountryStats = mapsData[window.selectedCountryCode];
        const selectedPop = this.selectedCountryStats['population'];
        this.selectedCountryPopulation = selectedPop;
      } else {
        this.selectedCountryStats = {};
        this.selectedCountryPopulation = 1;
      }
      /* eslint-enable */
      console.log(ev.target.dataItem.dataContext.name);
    });
    // PREVENT RIGHT CLICK CONTEXT MENU
    document.addEventListener('contextmenu', (event) => event.preventDefault());
    polygonTemplate.events.on('rightclick', (ev) => {
      chart.goHome();

      // get object info
      console.log(ev.target.dataItem.dataContext.name);
    });

    // COLORISED COUNTRIES WE HAVE DATA
    setTimeout(() => {
      const countriesDataAvailable = Object.keys(mapsData).map(
        convert3LetterCountry,
      );
      window.countriesDataAvailable = countriesDataAvailable;
      countriesDataAvailable.forEach((key) => {
        try {
          polygonSeries.getPolygonById(key).fill = am4core.color('#74B266');
        } catch (err) {
          // console.log(err);
        }
      });
    }, 1000); // HACK COLOR
  },
};
</script>
