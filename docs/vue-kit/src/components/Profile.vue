<template>
  <div class="w-96 bg-gray-50 flex-1 mx-auto">
    <h2>Profile</h2>
    {{ signingKey }}
    {{ encryptionKey }}
  </div>
</template>
<script>
export default {
  props: {
    profile: {
      type: Object,
      default: () => ({
        name: '',
      })
    },
    signingKey: {
      type: Object,
      default: () => ({}),
    },
    encryptionKey: {
      type: Object,
      default: () => ({})
    },
  },
};
</script>
