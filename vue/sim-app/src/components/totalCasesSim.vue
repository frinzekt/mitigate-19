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
        title: 'Total cases per day',
        xaxis: {
          title: 'Time (days)',
        },
        yaxis: {
          title: 'Total cases',
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
        { ...this.$store.getters.getCaseData, name: 'Actual cases' },
        { ...this.$store.getters.getUncontrolledCaseData, name: 'Uncontrolled growth' },
      ];
    },
  },
  watch: {
    caseData() {
      const maxX = Math.max(
        Math.max(...this.caseData[0].x),
        Math.max(...this.caseData[1].x),
      );
      const maxY = Math.max(
        Math.max(...this.caseData[0].y),
        Math.max(...this.caseData[1].y),
      );
      Plotly.animate(this.graphElement, {
        data: this.caseData,
        traces: [0, 1],
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
