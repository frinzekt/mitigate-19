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
            <v-card>
              <totalCasesSim
              :graphElement='totalCasesDiv'
              />
              <div :id='totalCasesDiv' class='graph'>
              </div>
            </v-card>
          <br/>
             <v-card>
              <newCasesSim
              :graphElement='newCasesDiv'
              />
              <div :id='newCasesDiv' class='graph'>
              </div>
            </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import totalCasesSim from '../components/totalCasesSim.vue';
import newCasesSim from '../components/newCasesSim.vue';
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
    totalCasesSim,
    newCasesSim,
    SimControls,
  },
  mounted() {
    this.graphElem = document.getElementById('graphElem');
  },
};
</script>
<style scoped>
</style>
