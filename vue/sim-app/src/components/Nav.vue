<template>
  <v-app-bar app color="primary" dark>
     <v-toolbar-title class="mr-5">
       <v-icon large class="px-2">
         mdi-virus
        </v-icon>
        <b>Mitigate-19</b>
     </v-toolbar-title>
     <span class="mb-1">Strategic pandemic response simulator</span>
    <v-spacer></v-spacer>
    <v-btn
    to='/'
    class='accent darken-1 ma-1'
    small
    >
      Home
    </v-btn>
    <v-btn
    small
    class="ma-1"
    @click='$vuetify.theme.dark = !$vuetify.theme.dark;'
    >
      Toggle Dark Theme
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {};
</script>

<style>
</style>
