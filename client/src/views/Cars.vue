<template>
  <div class="cars is-flex is-align-content-stretch">
    <b-sidebar position="static" type="is-light" open class="mr-4" fullheight>
      <div class="p-2">
        <p class="is-has-text-weight-bold mb-2">Make</p>
        <b-field>
          <b-select multiple native-size="8" v-model="selectedMakes">
            <option v-for="make in makes" :key="make.id" :value="make.slug">
              {{ make.name }}
            </option>
          </b-select>
        </b-field>
      </div>
    </b-sidebar>
    <section>
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
      selectedMakes: [],
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        if (to.params.make) {
          this.selectedMakes = [to.params.make];
        }
      },
    },
    selectedMakes(to) {
      if (to.length === 1) {
        this.$router.push(`/cars/${to[0]}`);
      } else {
        this.$router.push("/cars");
      }
    },
  },
  apollo: {
    makes: gql`
      {
        makes {
          id
          name
          slug
        }
      }
    `,
    cars: {
      query: gql`
        query GetCars($makeSlug: String) {
          cars(makeSlug: $makeSlug) {
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
        return {
          makeSlug: this.$route.params.make,
        };
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
