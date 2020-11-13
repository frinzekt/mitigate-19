<template>
  <div class="home">
    <v-container
    >
    <v-row
      align='center'
      justify='center'
      >
        <v-col>
          <SimControls />
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>
              Daily Cases
            </v-card-title>
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
