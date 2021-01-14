<template>
  <div class="car p-4">
    <div class="container" v-if="$apollo.queries.car.loading">
      <nav class="breadcrumb">
        <ul>
          <li>
            <b-skeleton width="20%" animated></b-skeleton>
          </li>
          <li>
            <b-skeleton width="20%" animated></b-skeleton>
          </li>
        </ul>
      </nav>
      <div class="view" v-if="!editing">
        <h1 class="is-size-2">
          <b-skeleton width="60%" animated></b-skeleton>
        </h1>
        <h2 class="is-size-4 subtitle is-uppercase has-text-weight-light">
          <b-skeleton width="40%" animated></b-skeleton>
        </h2>
        <br />
        <div class="columns is-8">
          <div class="column is-half"><b>Price per day</b></div>
          <div class="column is-half">
            <b-skeleton width="10%" animated></b-skeleton>
          </div>
          <div class="column is-half"><b>Available units</b></div>
          <div class="column is-half is-flex is-align-content-center">
            <b-skeleton width="10%" animated></b-skeleton>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-else>
      <nav class="breadcrumb">
        <ul>
          <li>
            <router-link :to="'/cars/' + car.make.slug">
              {{ car.make.name }}
            </router-link>
          </li>
          <li>
            <router-link :to="'/cars/' + car.make.slug + '/' + car.slug">
              {{ car.model }}
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="view" v-if="!editing">
        <h1 class="is-size-2">{{ car.model }}</h1>
        <h2 class="is-size-4 subtitle is-uppercase has-text-weight-light">
          {{ car.make.name }}
        </h2>
        <br />
        <div class="columns is-8">
          <div class="column is-half"><b>Price per day</b></div>
          <div class="column is-half">${{ car.pricePerDay }}</div>
          <div class="column is-half"><b>Available units</b></div>
          <div class="column is-half is-flex is-align-content-center">
            {{ car.availableUnits }}
            <b-icon
              class="ml-2"
              v-if="car.availableUnits < 2"
              icon="alert-decagram"
              type="is-warning"
            ></b-icon>
          </div>
        </div>
        <div class="buttons">
          <b-button @click="editing = true" icon-left="pencil">Edit</b-button>
          <b-button
            @click="$router.push('/rent')"
            icon-left="car"
            class="is-primary"
          >
            Rent
          </b-button>
        </div>
      </div>
      <div class="edit" v-else>
        <form @submit.prevent="submitForm" class="mb-4">
          <b-field label="Model">
            <b-input v-model="form.model" placeholder="Model"></b-input>
          </b-field>
          <b-field label="Make">
            <b-autocomplete
              v-model="form.makeSearch"
              field="name"
              :data="filteredMakes"
              placeholder="Make"
              icon="magnify"
              clearable
              @select="(option) => (form.make = option)"
              open-on-focus
            >
              <template v-slot="props">
                {{ props.option.name }}
              </template>
              <template #empty>No results found</template>
            </b-autocomplete>
          </b-field>
          <b-field label="Price per day">
            <b-field>
              <p class="control"><span class="button">$</span></p>
              <b-numberinput
                v-model="form.pricePerDay"
                :controls="false"
                expanded
              ></b-numberinput>
            </b-field>
          </b-field>
          <b-field label="Units">
            <b-field>
              <b-numberinput v-model="form.units"></b-numberinput>
            </b-field>
          </b-field>
          <b-button native-type="submit" icon-left="check">Save</b-button>
        </form>
      </div>
      <b-loading v-model="saving"></b-loading>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

const GET_CAR = gql`
  query GetCar($slug: String) {
    car(slug: $slug) {
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
`;

export default {
  data() {
    return {
      editing: false,
      form: { model: "", makeSearch: "", make: null, pricePerDay: 0, units: 0 },
      saving: false,
    };
  },
  computed: {
    filteredMakes() {
      return this.makes.filter(
        (m) =>
          m.name.toLowerCase().indexOf(this.form.makeSearch.toLowerCase()) !==
          -1
      );
    },
  },
  watch: {
    car(to) {
      this.form.model = to.model;
      this.form.make = to.make;
      this.form.makeSearch = to.make.name;
      this.form.pricePerDay = to.pricePerDay;
      this.form.units = to.units;
    },
  },
  methods: {
    submitForm() {
      this.saving = true;
      this.editing = false;
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: EditCarInput!) {
              editCar(input: $input) {
                car {
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
            }
          `,
          variables: {
            input: {
              id: this.car.id,
              units: this.form.units,
              pricePerDay: this.form.pricePerDay,
              makeId: this.form.make.id,
            },
          },
          update: (store, { data: { editCar } }) => {
            const data = store.readQuery({
              query: GET_CAR,
              variables: {
                slug: this.car.slug,
              },
            });
            data.car = editCar.car;
            store.writeQuery({
              query: GET_CAR,
              variables: {
                slug: this.car.slug,
              },
              data,
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            editCar: {
              car: {
                ...this.car,
                ...this.form,
                make: {
                  ...this.car.make,
                  ...this.form.make,
                },
              },
            },
          },
        })
        .then(() => (this.saving = false))
        .catch(() => {
          this.saving = false;
          this.$buefy.snackbar.open({
            duration: 3000,
            message: "An error occured while saving the car.",
            type: "is-danger",
            position: "is-bottom-right",
            actionText: "OK",
            queue: false,
            onAction: () => alert("Please notify a site administrator!"),
          });
        });
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
    car: {
      query: GET_CAR,
      variables() {
        return {
          slug: this.$route.params.model,
        };
      },
    },
  },
};
</script>
