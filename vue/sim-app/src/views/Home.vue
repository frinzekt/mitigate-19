<template>
  <div class='home'>
    <v-container>
      <v-row
      wrap
      >
        <v-col cols='6'>
          <SimControls />
        </v-col>
        <v-col cols='6'>
          <v-card class='pa-4 ma-4'>
            <GraphSim
            :graphElement='newCasesDiv'
            />
            <div :id='newCasesDiv' class='graph'>
            </div>
          </v-card>
        </v-col>
        <v-col cols='6'>
          <v-card>
            <GraphSim
            :graphElement='totalCasesDiv'
            />
            <div :id='totalCasesDiv' class='graph'>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import GraphSim from '../components/GraphSim.vue';
import SimControls from '../components/SimControls.vue';

// @ is an alias to /src
export default {
  name: 'Home',
  data() {
    return {
      newCasesDiv: 'newCases',
      totalCasesDiv: 'totalCases',
    };
  },
  components: {
    GraphSim,
    SimControls,
  },
  mounted() {
    this.graphElem = document.getElementById('graphElem');
  },
};
</script>
<style scoped>
</style>
