<template>
  <div class='home'>
    <v-container>
      <v-row align="center"
      justify="center"
        wrap
        >
          <v-col cols='12'>
            <SimStatistics />
          </v-col>
        </v-row>
    </v-container>
    <v-container>
      <v-row wrap>
          <v-col cols='4'>
              <v-card>
                <totalCasesSim
                :graphElement='totalCasesDiv'
                />
                <div :id='totalCasesDiv' class='graph'>
                </div>
              </v-card>
          </v-col>
          <v-col cols='4'>
            <v-card>
            <newCasesSim
            :graphElement='newCasesDiv'
            />
            <div :id='newCasesDiv' class='graph'>
            </div>
          </v-card>
          </v-col>
          <v-col cols='4'>
            <v-card>
            <SIR
            :graphElement='SIRDiv'
            />
            <div :id='SIRDiv' class='graph'>
            </div>
          </v-card>
          </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row
      align='center'
      justify='center'
      wrap
      >
        <v-col
        cols='12'
        >
          <SimControls/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import totalCasesSim from '../components/totalCasesSim.vue';
import newCasesSim from '../components/newCasesSim.vue';
import SimStatistics from '../components/SimStatistics.vue';
import SimControls from '../components/SimControls.vue';
import SIR from '../components/SIR.vue';

// @ is an alias to /src
export default {
  name: 'Home',
  data() {
    return {
      newCasesDiv: 'newCases',
      totalCasesDiv: 'totalCases',
      SIRDiv: 'SIRDiv',
    };
  },
  components: {
    totalCasesSim,
    newCasesSim,
    SimStatistics,
    SimControls,
    SIR,
  },
  mounted() {
    this.graphElem = document.getElementById('graphElem');
  },
};
</script>
<style scoped>
</style>
