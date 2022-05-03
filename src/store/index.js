import { createStore } from "vuex";
// toast.js -> index.js : dispatch
// actions -> mutations : commit. commit을 통해 mutations에 접근
// actions에는 함수 입력
export default createStore({
  state: {
    toastMessage: "",
    showToast: false,
  },
  mutations: {
    // 대문자로 변수명 지정
    UPDATE_MESSAGE(state, payload) {
      // 아래 actions의 msg가 payload로 들어간다.
      state.toastMessage = payload;
    },
    UPDATE_STATE(state, payload) {
      state.showToast = payload;
    },
  },
  actions: {
    triggerToast({ commit }, msg) {
      // toastMessage.value = msg;
      commit("UPDATE_MESSAGE", msg);

      // showToast.value = true;
      commit("UPDATE_STATE", true);

      setTimeout(() => {
        // showToast.value = false;
        commit("UPDATE_STATE", false);

        // toastMessage.value = '';
        commit("UPDATE_MESSAGE", "");
      }, 2000);
    },
  },
  getters: {},
});
