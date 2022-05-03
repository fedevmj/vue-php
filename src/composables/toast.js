import { computed } from "vue";
import { useStore } from "vuex";

export const useToast = () => {
  const store = useStore();
  // state 참조할 때는 항상 computed 활용
  const showToast = computed(() => store.state.showToast);

  const toastMessage = computed(() => store.state.toastMessage);

  // 타이머로 제어하기 위한 것
  const triggerToast = (msg) => {
    store.dispatch("triggerToast", msg);
    // store.dispatch()하면 vuex index.js의 actions로 접근.
    // triggerToast와 msg는 vuex index.js actions에 있는 것과 동일.
  };

  return {
    toastMessage,
    showToast,
    triggerToast,
  };
};
