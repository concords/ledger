function useLedger() {
  const ledger = Vue.ref(null);
  const user = Vue.ref(null);
  const raw = Vue.ref({});
  const todos = Vue.ref([]);

  async function createLedger() {
    user.value = await Identity.createIdentity();

    ledger.value = await Ledger({
      ...Vue.unref(user),
      plugins: [
        {
          createRecord(record) {
            todos.value.push(record.data);
          },
          updateRecord(record) {
            const index = todos.value.findIndex(({ id }) => id === record.data.id);
            todos.value.splice(index, 1, record.data);
          }
        }
      ],
    });

    ledger.value.createLedger();
  }

  createLedger();

  return {
    ledger,
    user,
    raw,
    todos
  };
};

const RootComponent = {
  /* options */
  setup() {
    const { ledger, user, raw, todos } = useLedger();
    const count = Vue.ref(0);

    function createRecord() {
      count.value += 1;
      ledger.value.createRecord(
        'todos',
        {
          title: `Task ${count.value}`,
          completed: false,
        }
      );
    }

    function completeTodo(todo) {
      ledger.value.updateRecord(
        'todos',
        { ...todo, completed: !todo.completed }
      );
    }
    return { todos, raw, createRecord, completeTodo }
  },
  template: `
    <div>
      <button @click="createRecord">Add Todo</button>
     <ul>
      <li v-for="todo in todos" :key="todo.id">
        <button @click="completeTodo(todo)">Complete Me</button>
        <span>{{ todo.title }}</span>{{ todo.completed }}
      </li>
     </ul>
    </div>
  `
}
const app = Vue.createApp(RootComponent)
const vm = app.mount('#app')

