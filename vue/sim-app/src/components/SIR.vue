<template>
  <div id='chart'>
  </div>
</template>

<script>
/* eslint-disable */
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
        { ...this.$store.getters.getActiveData, stackgroup: 'one', name: 'Infected' },
        { ...this.$store.getters.getResolvedData, stackgroup: 'one', name: 'Resolved' },
        { ...this.$store.getters.getSusceptibleData, stackgroup: 'one', name: 'Susceptible' },
      ];
    },
  },
  watch: {
    caseData() {
      const maxX = Math.max(
        Math.max(...this.caseData[0].x),
        Math.max(...this.caseData[1].x),
        Math.max(...this.caseData[2].x),
      );
      const maxY = Math.max(
        Math.max(...this.caseData[0].y),
        Math.max(...this.caseData[1].y),
        Math.max(...this.caseData[2].y),
      );
      Plotly.animate(this.graphElement, {
        data: this.caseData,
        traces: [0,1,2],
        layout: {
          xaxis: { range: [0, maxX] },
          yaxis: { range: [0, maxY] },
          margin: {
            t: 50,
            b: 50,
          },
        },
      },
      {
        transition: {
          duration: 500,
          easing: 'cubic-in-out',
        },
        frame: {
          duration: 500,
        },
      });
    },
  },
};
</script>

<style>
</style>
