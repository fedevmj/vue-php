<template>
  <div class="card">
    <div class="card-header">TODO UPDATE</div>
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
          <label for="body">내용</label>
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

        <div class="form-group">
          <label>완료여부</label>
          <input
            type="checkbox"
            class="ml-2 mr-2"
            :id="todo.id"
            v-model="todo.active"
            @change="toggleTodo()"
          />
          <span
            class="form-check-label"
            :class="todo.active == false ? 'active' : ''"
          >
            {{ todo.active ? "완료" : "진행중" }}
          </span>
        </div>

        <div class="btn-group" role="group" aria-label="">
          <button type="submit" class="btn btn-success" :disabled="todoUpdate">
            확인
          </button>
          <button type="button" class="btn btn-danger" @click="moveList">
            취소
          </button>
        </div>
      </form>
    </div>
    <!-- 안내창 -->
    <!-- <ToastBox :message="toastMessage" v-if="showToast" /> -->
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
// import ToastBox from "@/components/ToastBox.vue";
import { useToast } from "@/composables/toast.js";
import _ from "lodash";
export default {
  // components: {
  //   ToastBox,
  // },
  setup() {
    const { toastMessage, showToast, triggerToast } = useToast();

    const route = useRoute();
    const router = useRouter();

    // 현재 화면에 보여지는 자료
    const todo = reactive({
      title: "",
      complete: false,
      body: "",
      id: 0,
      active: false,
    });

    // 원본 데이터
    const originalTodo = reactive({
      title: "",
      complete: false,
      body: "",
      id: 0,
      active: false,
    });

    // todo와 originalTodo를 비교해서 결과값이 true || false인지 비교.
    const todoUpdate = computed(() => {
      return _.isEqual(todo, originalTodo);
    });

    const getInfo = () => {
      fetch(
        `http://mjleemj.dothome.co.kr/data_read_id.php?id=${route.params.id}`
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          // 현재 화면에 보일 값 & 갱신되는 값 보관용
          todo.title = data.result[0].title;
          todo.body = data.result[0].body;
          todo.complete = data.result[0].complete;
          todo.id = data.result[0].id;
          if (todo.complete === "0") {
            todo.active = false;
          } else {
            todo.active = true;
          }

          //   원본 보관
          originalTodo.title = data.result[0].title;
          originalTodo.body = data.result[0].body;
          originalTodo.complete = data.result[0].complete;
          originalTodo.id = data.result[0].id;
          if (originalTodo.complete === "0") {
            originalTodo.active = false;
          } else {
            originalTodo.active = true;
          }
        })

        .catch();
    };
    getInfo();

    const toggleTodo = () => {
      if (todo.active == true) {
        todo.complete = "1";
      } else {
        todo.complete = "0";
      }
    };

    const onSubmit = () => {
      // 제목이 없으면 생성 금지
      if (!todo.title) {
        triggerToast("제목을 입력하세요");
        return;
      }
      // 내용이 없으면 생성 금지
      if (!todo.body) {
        triggerToast("내용을 입력하세요");
        return;
      }

      fetch(
        `http://mjleemj.dothome.co.kr/data_update.php?id=${todo.id}&title=${todo.title}&body=${todo.body}&complete=${todo.complete}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.result == 1) {
            router.push({
              name: "Detail",
              params: {
                id: todo.id,
              },
            });
          }
        })
        .catch();

      router.push({
        name: "List",
      });
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
      todoUpdate,
      toggleTodo,
      toastMessage,
      showToast,
    };
  },
};
</script>

<style></style>
