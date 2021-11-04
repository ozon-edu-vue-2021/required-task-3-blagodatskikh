<template>
  <div id="app">
    <div class="office">
      <Map
        :selected="selectedPlace"
        @click:place="onPlaceClick"
        @update:selected="onSelectionChanged"
      />
      <SideMenu
        :person="person"
        :isUserOpened="isUserOpened"
        @update:isUserOpened="onUserOpenedUpdated"
        @outside="onClickOutside"
      />
    </div>
  </div>
</template>

<script>
import Map from "./components/Map.vue";
import SideMenu from "./components/SideMenu.vue";

import * as state from "@/state";

export default {
  name: "App",
  components: { Map, SideMenu },

  data: () => ({
    person: null,
    selectedPlace: null,
    isUserOpened: false,
  }),

  computed: {
    people() {
      return state.getPeople();
    },
  },

  watch: {
    isUserOpened(curr) {
      if (!curr) {
        this.selectedPlace = null;
      }
    },
  },

  created() {
    state.loadData();
  },

  methods: {
    onClickOutside() {
      this.isUserOpened = false;
      this.selectedPlace = null;
      this.person = null;
    },
    onPlaceClick(place) {
      this.person = this.people?.find((p) => p.tableId === place._id);
      this.isUserOpened = !!this.person;
    },
    onSelectionChanged(place) {
      this.selectedPlace = place;
    },
    onUserOpenedUpdated(value) {
      this.isUserOpened = value;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  background-color: #fafafa;
  padding: 24px;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

* {
  box-sizing: border-box;
}

h3 {
  margin-top: 0px;
}

.office {
  display: grid;
  grid-template-columns: 1fr 320px;
  border-radius: 6px;
  border: 1px solid #ccd8e4;
  height: 100%;
  background: white;
  max-width: 1500px;
  margin: 0 auto;
}
</style>
