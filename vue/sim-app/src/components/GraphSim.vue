<template>
  <div id='chart'>
    <v-card style='width: 600px; height: 250px'>
      <div id='graph'></div>
      <v-card-actions>
        <v-btn v-show='sim === false' @click='startSim'> Start sim</v-btn>
        <v-btn v-show='sim === true' @click='stopSim'> Stop sim</v-btn>
        <v-spacer></v-spacer>
        <v-slider
          max='950'
          min='50'
          v-model='speed'
          @change='changeSpeed'
          color='accent'
          label='Simulation speed'
        ></v-slider>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist';

export default {
  data() {
    return {
      sim: false,
      intervalId: null,
      speed: 50,
      currentDay: 1,
    };
  },
  methods: {
    changeSpeed() {
      if (this.sim) {
        this.stopSim();
        this.startSim();
      }
    },
    addData() {
      this.currentDay += 1;
      this.$store.commit('addCase', Math.exp(this.currentDay));
      this.$store.commit('addDay');
      Plotly.react('graph', [this.$store.getters.getCaseData], {
        margin: { t: 0 },
      });
    },
    startSim() {
      this.sim = true;
      this.intervalId = setInterval(() => {
        this.addData();
      }, this.trueSpeed);
    },
    stopSim() {
      clearInterval(this.intervalId);
      this.sim = false;
    },
  },
  mounted() {
    Plotly.newPlot('graph', [this.$store.getters.getCaseData], {
      margin: { t: 0 },
    });
  },
  computed: {
    trueSpeed() {
      return 2000 - this.speed;
    },
  },
};
</script>

<style>
</style>
