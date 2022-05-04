<template>
  <div class="card">
    <div class="card-header">Todo</div>
    <div class="card-body">
      <h4 class="card-title">{{ todo.title }}</h4>
      <h3>내용</h3>
      <p class="card-text">
        <span>
          {{ todo.body }}
        </span>
      </p>
      <h3>완료여부</h3>
      <p class="card-text">
        <span>
          {{ todo.complete === "0" ? "진행중" : "완료" }}
        </span>
      </p>
      <div class="btn-group" role="group" aria-label="">
        <button
          type="button"
          class="btn btn-warning"
          @click="editTodo(todo.id)"
        >
          수정
        </button>
        <button
          type="button"
          class="btn btn-danger"
          @click="openModal(todo.id)"
        >
          삭제
        </button>
        <button type="button" class="btn btn-primary" @click="moveList">
          목록보기
        </button>
      </div>
    </div>
  </div>

  <teleport to="#popup">
    <ModalWin
      v-if="showModal"
      @close-modal="closeModal"
      @delete-modal="deleteTodo"
    >
      <template v-slot:title>내용삭제</template>
      <template v-slot:body>내용을 삭제하시겠습니까?</template>
    </ModalWin>
  </teleport>
</template>

<script>
// useRouter는 보낼 때, useRoute는 받아올 때
import { useRoute, useRouter } from "vue-router";
// import {useRoute} from 'vue-router'
import { reactive, ref } from "vue";
import ModalWin from "@/components/ModalWin.vue";

export default {
  components: {
    ModalWin,
  },
  setup() {
    const route = useRoute();
    // console.log(route.params.id);

    const router = useRouter();

    const todo = reactive({
      title: "",
      body: "",
      id: 0,
      complete: 0,
    });

    // ID를 전달하고 자료를 받아온다.
    const getInfo = () => {
      fetch(
        `http://mjleemj.dothome.co.kr/data_read_id.php?id=${route.params.id}`
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          todo.title = data.result[0].title;
          todo.body = data.result[0].body;
          todo.complete = data.result[0].complete;
          todo.id = data.result[0].id;
        })
        .catch();
    };
    getInfo();

    const deleteTodo = () => {
      console.log();
      fetch(`http://mjleemj.dothome.co.kr/data_delete.php?id=${deleteId.value}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result == 1) {
            // router.push('/list')
            moveDetail();
          } else {
            console.log("삭제에 실패했습니다");
          }
        });
    };

    const moveDetail = (id) => {
      // console.log(id);
      router.push({
        name: "List",
        params: {
          id: id,
        },
      });
    };

    const editTodo = (id) => {
      router.push({
        name: "Update",
        params: {
          id: id,
        },
      });
    };

    const moveList = () => {
      router.push({
        name: "List",
      });
    };

    const showModal = ref(false);
    // 선택된 id를 저장
    const deleteId = ref(null);
    // 모달창
    const closeModal = () => {
      showModal.value = false;
      deleteId.value = null;
    };
    // 모달창 보여주기
    const openModal = (_id) => {
      console.log(_id);
      deleteId.value = _id;
      showModal.value = true;
    };

    return {
      todo,
      deleteTodo,
      editTodo,
      moveList,
      closeModal,
      openModal,
      showModal,
    };
  },
};
</script>

<style></style>
