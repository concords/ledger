<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-gray-50">
    <div class="flex p-2 justify-between shadow-inner bg-white border-b border-gray-200">
      <h1 class="py-2 text-3xl truncate">
        Data
      </h1>
    </div>
    <div class="overflow-x-scroll">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              v-for="cell in headerCells"
              :key="`header_${cell}`"
              scope="col"
              class="bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ cell }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="item in filteredList"
            :key="item.id"
          >
            <td
              v-for="cell in headerCells"
              :key="`body_${item.id}_${cell}`"
              class="px-6 py-4 whitespace-nowrap"
            > 
              <img
                v-if="item[cell] && item[cell].x && item[cell].y"
                :src="`https://robohash.org/${item[cell].x}${item[cell].y}`"
                class="inline-block w-10 h-10 ring-white shadow rounded-full ml-4 border border-gray-400"
              >
              <p v-else>
                {{ item[cell] }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, watch, computed } from 'vue';
import ledger from '@concords/ledger';
import loki from 'lokijs';

import useLokiPlugin from '../composables/useLokiPlugin';

export default defineComponent({
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
  setup(props) {
    // LokiJS Plugin
    const {
      getCollection,
      plugin: lokiPlugin
    } = useLokiPlugin(new loki('ledger.db'));

    // Filters
    const searchFilter = ref('');
    const showCompletedFilter = ref(true);

    // Ledger
    ledger({
      ...props.user,
      ledger: props.ledger,
      plugins: [
        lokiPlugin,
        {
          onReady: handleUpdates,
        }
      ],
    });

    const filteredList = ref([]);
    const headerTypes = ref(new Set());

    function handleUpdates() {
      const collection = getCollection();

      filteredList.value = collection.chain()
        .where((item) => {
          Object.keys(item).filter((key) => key !== '$loki').forEach(headerTypes.value.add, headerTypes.value)

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
    }
    watch([searchFilter, showCompletedFilter], handleUpdates);
    const headerCells = computed(() => Array.from(headerTypes.value));

    return {
      headerCells,
      filteredList,
      searchFilter,
      showCompletedFilter,
    }
  },
})
</script>