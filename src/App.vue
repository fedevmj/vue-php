<template>
  <div class="container">
    <nav>
      <router-link :to="{ name: 'Home' }">Home</router-link> |
      <router-link :to="{ name: 'Create' }">Create</router-link> |
      <router-link :to="{ name: 'List' }">List</router-link> |
      <router-link :to="{ name: 'About' }">About</router-link> |
    </nav>
    <router-view />
    <!-- 안내창 -->
    <transition name="fade">
      <ToastBox :message="toastMessage" v-if="showToast" />
    </transition>
  </div>
</template>

<script>
import { useToast } from "@/composables/toast.js";
import ToastBox from "@/components/ToastBox.vue";

export default {
  components: {
    ToastBox,
  },
  setup() {
    const { toastMessage, showToast, triggerToast } = useToast();

    return {
      toastMessage,
      showToast,
      triggerToast,
    };
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
