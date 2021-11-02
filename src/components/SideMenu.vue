<template>
  <div class="menu" v-click-outside="onClickOutside">
    <div class="toolbar">
      <div class="toolbar__header">
        <template v-if="!isUserOpened">
          <h3>Подразделения</h3>
        </template>
        <template v-else>
          <div class="action" @click="closeProfile">
            <div class="arrow"></div>
          </div>
          <h3>Профиль</h3>
        </template>
      </div>
      <div class="toolbar__actions"></div>
    </div>
    <div class="content">
      <div v-if="!isUserOpened" class="legend">
        <div class="legend__data">
          <div v-if="legend.length > 0" class="legend__items">
            <draggable
              v-model="legend"
              @start="drag = true"
              @end="drag = false"
            >
              <transition-group>
                <LegendItem
                  v-for="item in legend"
                  class="legend__item"
                  :key="item.group_id"
                  :color="item.color"
                  :text="item.text"
                  :counter="item.counter"
                />
              </transition-group>
            </draggable>
          </div>
          <span v-else class="legend--empty">Список пуст </span>
        </div>
        <div class="legend__chart">
          <Doughnut ref="chart" />
        </div>
      </div>
      <div v-else class="profile">
        <div v-if="!person" class="profile__empty">Место пустое</div>

        <PersonCard :person="person" />
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import draggable from "vuedraggable";
import { Doughnut } from "vue-chartjs";

import LegendItem from "./SideMenu/LegendItem.vue";
import PersonCard from "./SideMenu/PersonCard.vue";

import * as state from "@/state";

export default {
  props: {
    isUserOpened: { type: Boolean, default: false },
    person: { type: Object, default: null },
  },

  components: { Doughnut, draggable, LegendItem, PersonCard },

  directives: { ClickOutside },

  computed: {
    legend: {
      get: function () {
        return state.getGroups();
      },
      set: function (value) {
        state.setGroups(value);
      },
    },
  },

  watch: {
    legend() {
      this.drawChart();
    },
  },

  mounted() {
    this.drawChart();
  },

  methods: {
    onClickOutside() {
      if (!this.isUserOpened) return;

      this.$emit("outside");
    },

    closeProfile() {
      this.$emit("update:isUserOpened", false);
      this.$nextTick(() => this.drawChart());
    },

    drawChart() {
      if (this.isUserOpened) return;

      const data = {
        labels: this.legend.map((i) => i.text),
        datasets: [
          {
            label: "Legend",
            backgroundColor: this.legend.map((i) => i.color),
            data: this.legend.map((i) => i.counter),
          },
        ],
      };

      const options = { animation: false, legend: { display: false } };

      this.$refs.chart.renderChart(data, options);
    },
  },
};
</script>

<style scoped>
.menu {
  border-left: 1px solid #ccd8e4;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar .toolbar__actions button {
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08rem;
  padding: 2px 6px;
}

.toolbar__header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.toolbar__header .action {
  cursor: pointer;
  margin-right: 14px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.toolbar__header .action .arrow {
  width: 10px;
  height: 10px;
  border-top: 2px solid blue;
  border-right: 2px solid blue;
  transform: rotate(-135deg);
}

h3 {
  margin: 0;
}

.content {
  flex: 1;
}

.content .legend {
  display: flex;
  flex-direction: column;
  gap: 40px;
  height: 100%;
}

.content .legend .legend__data {
  display: flex;
}

.content .legend .legend__items {
  flex: 1;
  width: 100%;
}

.content .legend .legend__items .legend__item:not(:first-child) {
  margin-top: 4px;
}

.content .legend .legend__items .legend__item {
  border: 1px solid #ccd8e4;
  cursor: pointer;
  padding: 3px;
}

.content .legend .legend__items .legend__item.sortable-chosen {
  opacity: 25%;
}

.content .legend .legend--empty {
  align-self: center;
  width: 100%;
  text-align: center;
}

.profile {
  padding-top: 20px;
}
</style>
