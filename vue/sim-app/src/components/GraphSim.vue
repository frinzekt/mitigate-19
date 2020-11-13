<template>
  <div id='chart'>
    <div style='width: 600px; height: 250px'>
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
    };
  },
  methods: {
    addData() {
      this.currentDay += 1;
      this.$store.commit('addCase', Math.exp(this.currentDay));
      this.$store.commit('addDay');
      Plotly.react('graph', [this.caseData], {
        margin: { t: 0 },
      });
    },
  },
  mounted() {
    Plotly.newPlot('graph', [this.caseData], {
      margin: { t: 0 },
    });
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
