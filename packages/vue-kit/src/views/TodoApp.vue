<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-gray-50">
    <div class="flex p-2 justify-between shadow-inner bg-white border-b border-gray-200">
      <h1 class="py-2 text-3xl truncate">
        Todo App
      </h1>

      <filters
        v-model:searchTerm="searchFilter"
        v-model:showCompleted="showCompletedFilter"
      />
    </div>
    
    <todo-list
      :items="filteredList"
      :user="user"
      @addItem="add"
    />

    <actions-bar
      :ledger="ledger"
      @commit="commit"
      @delete="newLedger"
    />
  </div>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';
import ledger from '@concords/ledger';
import loki from 'lokijs';

import Filters from '../components/Filters.vue';
import TodoList from '../components/TodoList.vue';
import ActionsBar from '../components/ActionsBar.vue';

import useLokiPlugin from '../composables/useLokiPlugin';

export default defineComponent({
  components: { Filters, TodoList, ActionsBar },
  props: {
    user: {
      type: Object,
      required: true,
    },
    ledger: {
      type: Object,
      default: null,
    },
  },
  emits: [
    'update:ledger',
    'create:ledger'
  ],
  setup(props, { emit }) {
    // LokiJS Plugin
    const {
      getCollection,
      plugin: lokiPlugin
    } = useLokiPlugin(new loki('ledger.db'));

    // Filters
    const searchFilter = ref('');
    const showCompletedFilter = ref(true);

    // Ledger
    const { add, commit, auth, destroy, create } = ledger({
      ...props.user,
      ledger: props.ledger,
      plugins: [
        lokiPlugin,
        {
          onReady: handleUpdates,
          onUpdate: handleUpdates,
        }
      ],
    });

    const filteredList = ref([]);

    function handleUpdates({ ledger }) {
      const collection = getCollection();

      filteredList.value = collection.chain()
        .where((item) => {
          // filter completed items
          if (!showCompletedFilter.value && item.completed) {
            return false
          }

          // filter by search term
          if (searchFilter.value) {
            return new RegExp(searchFilter.value.toLowerCase())
              .test(item.title.toLowerCase());
          }
          return true;
        })
        .compoundsort([['created_at', false], ['title', true]])
        .data();

      if (ledger) {
       emit('update:ledger', ledger);
      }
    }
    watch([searchFilter, showCompletedFilter], handleUpdates);
    watch(() => props.user, (user) => auth(user));

    function newLedger() {
      if (confirm('This is a destructive action, are you sure you want to continue? \n\n Any unsaved changes will be lost!')) {
        create();
      }
    }

    return {
      commit,
      add,
      newLedger,
      filteredList,
      searchFilter,
      showCompletedFilter,
    }
  },
})
</script>