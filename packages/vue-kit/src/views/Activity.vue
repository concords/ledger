<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-gray-50 mb-8">
    <div class="flex p-2 justify-between shadow-inner bg-white border-b border-gray-200">
      <h1 class="py-2 text-3xl truncate">
        Activity
      </h1>
    </div>
    <div class="flex-1 overflow-y-auto px-8">
      <div class="w-full md:w-3/4 lg:w-2/3 m-auto">
        <h2 class="text-2xl my-4">
          Pending
        </h2>
        <ul class="flex flex-col m-auto">
          <div
            v-if="!pendingRecords.length"
            class="text-3xl text-center text-gray-400 my-6"
          >
            No pending records
          </div>
          <li
            v-for="item in pendingRecords"
            v-else
            :key="item.id"
          >
            <todo-item :item="item.data" />
            <!-- <ul>
              <li>ID: {{ item.id }}</li>
              <li>Time: {{ item.timestamp }}</li>
              <li>User: {{ item.user }}</li>
              <li>Signature: {{ item.signature }}</li>
            </ul> -->
          </li>
        </ul>
        <h2 class="text-2xl my-4">
          Confirmed
        </h2>
        <p class="m-2 text-gray-600">
          Records that have been commit to the ledger and cannot be edited or tampered.
        </p>
        <ul>
          <div
            v-if="!records.length"
            class="text-3xl text-center text-gray-400 my-6"
          >
            No confirmed records
          </div>
          <li
            v-for="item in records"
            v-else
            :key="item.id"
          >
            <todo-item :item="item.data" />
            <!-- <ul>
              <li>ID: {{ item.id }}</li>
              <li>Time: {{ item.timestamp }}</li>
              <li>User: {{ item.user }}</li>
              <li>Signature: {{ item.signature }}</li>
            </ul> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
import ledger from '@concords/ledger';

import TodoItem from '../components/TodoItem.vue'

export default defineComponent({
  components: { TodoItem },
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
    ledger({
      ...props.user,
      ledger: props.ledger,
      plugins: [
        {
          onReady: handleUpdates,
          onUpdate: handleUpdates,
        }
      ],
    });

    const records = ref([]);
    const pendingRecords = ref([]);

    function handleUpdates({ ledger }) {
      const { chain, pending_records } = ledger;

      records.value = [
          ...chain.reduce((acc, block) => ([ ...acc, ...block.records ]), []),
      ].sort((a, b) => b.timestamp - a.timestamp)
      
      pendingRecords.value = pending_records.sort((a, b) => b.timestamp - a.timestamp);
    }

    return {
      records,
      pendingRecords,
    }
  },
})
</script>