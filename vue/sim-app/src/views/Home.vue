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
            <v-card-title> Daily Cases </v-card-title>
            <GraphSim />
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
      graphElem: null,
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
