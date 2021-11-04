import Vue from "vue";

import legend from "@/assets/data/legend.json";
import people from "@/assets/data/people.json";
import tables from "@/assets/data/tables.json";

const state = Vue.observable({
  groups: [],
  people: [],
  places: [],
});

export const getGroups = () => state.groups;
export const setGroups = (groups) => (state.groups = groups);

export const getPeople = () => state.people;
export const setPeople = (people) => (state.people = people);

export const getPlaces = () => state.places;
export const setPlaces = (places) => (state.places = places);

export function loadData() {
  state.groups = legend;
  state.people = people;
  state.places = tables;
}
