<template>
  <div class="map">
    <h3 @click="drawPlaces">Карта офиса</h3>

    <div v-if="!isLoading" class="map-root">
      <MapSvg ref="map" />
      <TableSvg v-show="false" ref="table" />
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import * as d3 from "d3";

import MapSvg from "@/assets/images/map.svg";
import TableSvg from "@/assets/images/workPlace.svg";

import * as state from "@/state";

export default {
  components: { MapSvg, TableSvg },

  props: {
    selected: Object,
  },

  data: () => ({
    isLoading: false,
    tables: null,
    tableMarkup: null,
  }),

  computed: {
    legend() {
      return state.getGroups();
    },
    places() {
      return state.getPlaces();
    },
  },

  watch: {
    selected(curr, prev) {
      if (!curr && prev) {
        this.tables
          .select(`#place-${prev._id}`)
          .select(".table-block")
          .style("fill", this.getPlaceColor(prev));
      }
    },
  },

  mounted() {
    const map = d3.select(this.$refs.map);
    this.tableMarkup = d3.select(this.$refs.table).html();
    this.tables = map.append("g").attr("class", "places");

    const defs = map.append("defs");
    defs
      .append("pattern")
      .attr("id", "hatch")
      .attr("width", 2)
      .attr("height", 2)
      .attr("patternTransform", "rotate(-45)")
      .attr("patternUnits", "userSpaceOnUse")
      .append("rect")
      .attr("width", 1)
      .attr("height", 2)
      .style("fill", "#606060");

    this.drawPlaces();
  },

  methods: {
    drawPlaces() {
      const self = this;

      this.tables
        .selectAll("g.place")
        .data(this.places, (d) => d._id)
        .join(
          (enter) =>
            enter
              .append("g")
              .attr("id", (d) => `place-${d._id}`)
              .attr("class", "place")
              .attr("transform", this.getPlaceTransform)
              .html(this.tableMarkup)
              .on("click", function (event, place) {
                event.stopPropagation();

                if (self.selected) {
                  self.tables
                    .select(`#place-${self.selected._id}`)
                    .select(".table-block")
                    .style("fill", self.getPlaceColor(place));
                }

                d3.select(this)
                  .select(".table-block")
                  .style("fill", "url(#hatch)");

                self.$emit("update:selected", place);
                self.onPlaceClick(event, place);
              })
              .select(".table-block")
              .attr("fill", this.getPlaceColor),
          (update) =>
            update
              .attr("transform", this.getPlaceTransform)
              .select(".table-block")
              .attr("fill", this.getPlaceColor),
          (exit) => exit.remove()
        );
    },

    getPlaceColor(place) {
      const group = this.legend.find((it) => it.group_id === place.group_id);
      return group?.color ?? "transparent";
    },
    getPlaceTransform(place) {
      return `translate(${place.x},${place.y}) scale(0.5) rotate(${place.rotate})`;
    },

    onPlaceClick(event, place) {
      this.$emit("click:place", place);
    },
  },
};
</script>

<style scoped>
.map {
  height: 100%;
  width: 100%;
  padding: 24px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.map-root {
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

h3 {
  margin-top: 0px;
}

::v-deep svg {
  height: 100%;
  width: 100%;
}

::v-deep .table {
  cursor: pointer;
}
</style>
