<template>
  <div class="cars is-flex is-align-content-stretch">
    <b-sidebar position="static" type="is-light" open class="mr-4" fullheight>
      <div class="p-4">
        <b-field label="Make">
          <b-taginput
            v-model="selectedMakes"
            :data="filteredMakes"
            autocomplete
            icon="car"
            placeholder="Add a make"
            @typing="setMakeSearch"
            open-on-focus
          >
            <template v-slot="props">
              {{ props.option }}
            </template>
            <template #empty> There are no items </template>
          </b-taginput>
        </b-field>
        <b-field label="Price per day">
          <b-slider
            size="is-medium"
            :min="50"
            :max="600"
            v-model="priceRange"
            rounded
            :custom-formatter="(val) => '$' + val"
          >
            <template v-for="val in [100, 200, 300, 400, 500]">
              <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
            </template>
          </b-slider>
        </b-field>
      </div>
    </b-sidebar>
    <section class="px-4">
      <h1 class="is-size-1">Cars</h1>
      <div v-if="$apollo.queries.cars.loading">
        <div class="columns is-multiline">
          <div class="column is-one-quarter-desktop" v-for="n in 15" :key="n">
            <div class="card">
              <div class="card-content">
                <div class="content">
                  <p class="is-size-3 mb-1">
                    <b-skeleton width="60%" animated></b-skeleton>
                  </p>
                  <p class="subtitle is-uppercase has-text-weight-light">
                    <b-skeleton width="30%" animated></b-skeleton>
                  </p>
                  <p>
                    <b-skeleton width="10%" animated></b-skeleton>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="columns is-multiline">
        <div
          class="column is-one-quarter-desktop"
          v-for="car in cars"
          :key="car.id"
        >
          <div class="card">
            <div class="card-content">
              <div class="content">
                <p class="is-size-3 mb-1">{{ car.model }}</p>
                <p class="subtitle is-uppercase has-text-weight-light">
                  {{ car.make.name }}
                </p>
                <p class="has-has-text-grey">{{ car.pricePerDay }}$ / day</p>
                <p>
                  <router-link :to="'/cars/' + car.make.slug + '/' + car.slug">
                    View
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  data() {
    return {
      makes: [],
      selectedMakes: [],
      makeSearch: "",
      priceRange: [],
    };
  },
  methods: {
    setMakeSearch(val) {
      this.makeSearch = val;
    },
  },
  computed: {
    filteredMakes() {
      return this.makes
        .filter((m) => this.selectedMakes.indexOf(m.name) === -1)
        .filter(
          (m) =>
            m.name.toLowerCase().indexOf(this.makeSearch.toLowerCase()) !== -1
        )
        .map((m) => m.name);
    },
  },
  watch: {
    makes(to) {
      if (this.$route.params.make) {
        this.selectedMakes = [
          to.find((m) => m.slug === this.$route.params.make).name,
        ];
      }
    },
    selectedMakes(to) {
      if (to.length === 1) {
        const make = this.makes.find((m) => m.name === to[0]);
        if (this.$route.path !== `/cars/${make.slug}`) {
          this.$router.push(`/cars/${make.slug}`);
        }
      } else if (this.$route.path !== "/cars") {
        this.$router.push("/cars");
      }
    },
  },
  apollo: {
    makes: {
      query: gql`
        {
          makes {
            id
            name
            slug
          }
        }
      `,
    },
    cars: {
      query: gql`
        query GetCars(
          $makeSlug: String
          $makeSlugs: [String!]
          $minPricePerDay: Int
          $maxPricePerDay: Int
        ) {
          cars(
            makeSlug: $makeSlug
            makeSlugs: $makeSlugs
            minPricePerDay: $minPricePerDay
            maxPricePerDay: $maxPricePerDay
          ) {
            id
            make {
              name
              slug
            }
            model
            pricePerDay
            units
            availableUnits
            slug
          }
        }
      `,
      variables() {
        let vars = {
          minPricePerDay: this.priceRange[0],
          maxPricePerDay: this.priceRange[1],
        };
        if (this.selectedMakes.length > 1) {
          vars = {
            ...vars,
            makeSlugs: this.makes
              .filter((m) => this.selectedMakes.indexOf(m.name) !== -1)
              .map((m) => m.slug),
          };
        } else if (this.$route.params.make) {
          vars = {
            ...vars,
            makeSlug: this.$route.params.make,
          };
        }
        return vars;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.cars {
  display: flex;
  align-items: stretch;
}
</style>
