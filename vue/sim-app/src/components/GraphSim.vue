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
  props: {
    graphElement: {
      required: true,
    },
  },
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
        margin: {
          t: 50,
          b: 50,
        },
      },
      config: {
        responsive: true,
      },
    };
  },
  methods: {
    addData() {
      this.currentDay += 1;
      this.$store.commit('addCase', Math.exp(this.currentDay));
      this.$store.commit('addDay');
      Plotly.react(this.graphElement, [this.caseData], this.layout, this.config);
    },
  },
  mounted() {
    Plotly.newPlot(this.graphElement, [this.caseData], this.layout, this.config);
  },
  computed: {
    caseData() {
      return this.$store.getters.getCaseData;
    },
  },
  watch: {
    caseData() {
      Plotly.react(this.graphElement, [this.caseData], this.layout, this.config);
    },
  },
};
</script>

<style>
</style>
