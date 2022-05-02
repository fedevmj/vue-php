<template>
  <div class="container">
    <div class="card">
      <div class="card-header">TODO Create</div>
      <div class="card-body">
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label for="title">제목</label>
            <input
              type="text"
              v-model="todo.title"
              class="form-control"
              name="title"
              id="title"
              aria-describedby="helpId"
              placeholder=""
            />
            <small id="helpId" class="form-text text-muted"
              >제목을 입력하세요.</small
            >
          </div>

          <div class="form-group">
            <label for="body"></label>
            <textarea
              class="form-control"
              v-model="todo.body"
              name="body"
              id="body"
              rows="3"
            ></textarea>
            <small id="helpId" class="form-text text-muted"
              >내용을 입력하세요.</small
            >
          </div>

          <div class="btn-group" role="group">
            <button type="submit" class="btn btn-success">확인</button>
            <button type="button" class="btn btn-warning" @click="moveList">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- 안내창 -->
    <ToastBox :message="toastMessage" v-if="showToast" />
  </div>
</template>

<script>
import { ref, reactive, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import ToastBox from "@/components/ToastBox.vue";
export default {
  components: {
    ToastBox,
  },
  setup() {
    const showToast = ref(false);

    const toastMessage = ref("");

    // 타이머로 제어하기 위한 것
    const toastId = ref(null);
    const triggerToast = (msg) => {
      console.log(msg);
      toastMessage.value = msg;
      showToast.value = true;
      toastId.value = setTimeout(() => {
        showToast.value = false;
        toastMessage.value = "";
        clearTimeout(toastId);
      }, 2000);
    };

    onUnmounted(() => {
      clearTimeout(toastId.value);
    });

    // 값이 변하는 것을 계속 유지.
    const todo = reactive({
      title: "",
      body: "",
    });

    const router = useRouter();

    const onSubmit = () => {
      // 제목이 없으면 생성 금지
      if (!todo.title) {
        triggerToast("제목을 입력하세요");
        return;
      }
      // 내용이 없으면 생성금지
      if (!todo.body) {
        triggerToast("내용을 입력하세요");
        return;
      }

      console.log(todo);
      // ?를 기준으로 앞이 주소, 뒤가 query
      // &은 변수 구분 (title, body)
      fetch(
        `http://mjleemj.dothome.co.kr/data_add.php?title=${todo.title}&body=${todo.body}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.result == 1) {
            // List 화면으로 이동
            router.push({
              name: "List",
            });
          } else {
            console.log("서버에서 자료를 불러오는 데 실패했습니다.");
          }
        })
        .catch();
    };

    const moveList = () => {
      router.push({
        name: "List",
      });
    };

    return {
      todo,
      onSubmit,
      moveList,
      //   ToastBox,
      toastMessage,
      showToast,
    };
  },
};
</script>

<style></style>
