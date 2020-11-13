<template>
  <div id='chart'>
    <div>
      <div id='graph'></div>
    </div>
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist';

export default {
  data() {
    return {
      currentDay: 1,
      layout: {
        title: 'New cases per day',
        xaxis: {
          title: 'time (days)',
        },
        yaxis: {
          title: 'cases',
        },
        margin: { t: 0 },
      },
    };
  },
  methods: {
    addData() {
      this.currentDay += 1;
      this.$store.commit('addCase', Math.exp(this.currentDay));
      this.$store.commit('addDay');
      Plotly.react('graph', [this.caseData], this.layout);
    },
  },
  mounted() {
    Plotly.newPlot('graph', [this.caseData], this.layout);
  },
  computed: {
    caseData() {
      return this.$store.getters.getCaseData;
    },
  },
  watch: {
    caseData() {
      Plotly.react('graph', [this.caseData], {
        margin: { t: 0 },
      });
    },
  },
};
</script>

<style>
</style>
