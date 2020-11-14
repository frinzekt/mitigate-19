<template>
  <div id='chart'>
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
      layout: {
        title: 'Susceptible, infected, recovered populations per day',
        xaxis: {
          title: 'Time (days)',
        },
        yaxis: {
          title: 'Population',
        },
        margin: {
          t: 50,
          b: 50,
        },
      },
      config: {
        responsive: false,
      },
    };
  },
  methods: {
  },
  mounted() {
    Plotly.newPlot(this.graphElement, this.caseData, this.layout, this.config);
  },
  computed: {
    caseData() {
      return [
        this.$store.getters.getCaseData,
        // this.$store.getters.getActiveData,
        // this.$store.getters.getResolvedData,
        // this.$store.getters.getSusceptibleData,
      ];
    },
  },
  watch: {
    caseData() {
      // const xAxis = [...this.caseData.x];
      // const yAxis = [...this.caseData.y];
      // Plotly.animate(this.graphElement, {
      //   data: this.caseData,
      //   traces: [0],
      //   layout: {
      //     xaxis: { range: [Math.min(...xAxis), Math.max(...xAxis)] },
      //     yaxis: { range: [Math.min(...yAxis), Math.max(...yAxis)] },
      //     margin: {
      //       t: 50,
      //       b: 50,
      //     },
      //   },
      // },
    //   {
    //     transition: {
    //       duration: 500,
    //       easing: 'cubic-in-out',
    //     },
    //     frame: {
    //       duration: 500,
    //     },
    //   });
    },
  },
};
</script>

<style>
</style>
