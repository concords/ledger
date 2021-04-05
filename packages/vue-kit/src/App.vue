<template>
  <div>
    <div>
      <button @click="addItem">
        Add Todo
      </button>
      <ul>
        <li
          v-for="todo in todos"
          :key="todo.id"
        >
          <button @click="completeItem(todo)">
            Complete Me
          </button>
          <span>{{ todo.title }}</span>{{ todo.completed }}
        </li>
      </ul>
      <button @click="commit">
        Save
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Ledger from '@concords/ledger';

const user = {
  "secret": "JRxW6TjcK76B1KLKi7uo5syiKAFkgPWmSb6cmnv95i2cV5mClSv1dYCDD8uuYs3S",
  "identity": {
    "x": "ztE--LL6yBgQOy7Yr6egGZYi4n3OLWX22GsBCYPx-efYNvePZQ6GEYT1SIvaIgZA",
    "y": "RuOLBSMJmD-BK5URkjwP32MoGLRzmyqNUIrdTpBOwnGP2BZepXzMNu9114YvMOoG"
  }
}

export default defineComponent({
  setup() {
    const todos = ref([]);

    const {
      add,
      load,
      auth,
      commit
    } = Ledger({
      plugins: [
        {
          onLoad({ ledger }) {
            localStorage.setItem('ledger', JSON.stringify(ledger))
          },
          onUpdate({ ledger }) {
            localStorage.setItem('ledger', JSON.stringify(ledger))
          },
          onCommit({ ledger }) {
            console.log('commit', ledger.chain.pop());
          },
          onAdd(record) {
            const index = todos.value.findIndex(
              ({ id }) => id === record.data.id
            );

            if (index > -1) {
              todos.value.splice(index, 1, record.data);
            } else {
              todos.value.push(record.data);
            }
          }
        }
      ]
    });

    onMounted(async() => {
      await auth(user);
      await load(JSON.parse(localStorage.getItem('ledger')), 1);
    });

    function addItem() {
      add({
          title: `Task ${todos.value.length + 1}`,
          completed: false,
        }
      );
    }

    function completeItem(todo) {
      add({
          ...todo,
          completed: !todo.completed
        }
      );
    }

    return { addItem, completeItem, todos, commit }
  },
})
</script>
