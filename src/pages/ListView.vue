<template>
  <ModalWin
    v-if="showModal"
    @close-modal="closeModal"
    @delete-modal="deleteTodo"
  />

  <div class="container">
    <div class="card">
      <div class="card-header">
        Todo List
        <button class="btn btn-success bt-write" @click="writeTodo">
          글작성
        </button>

        <!-- 검색필드 -->
        <div class="input-group mr-2 search">
          <input
            class="form-control"
            placeholder="검색어를 입력하세요."
            v-model="searchText"
            @keyup.enter="getTotalSearch()"
          />
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>No.</th>
              <!-- <th>ID</th> -->
              <th>Title</th>
              <!-- <th>Body</th> -->
              <th>Complete</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in todos" :key="item.id">
              <th>{{ index + 1 }}</th>
              <!-- <td>{{ item.id }}</td> -->
              <td>
                <span @click="moveDetail(item.id)" class="detail">{{
                  item.title
                }}</span>
              </td>
              <!-- <td>{{ item.body }}</td> -->
              <td>
                <input
                  type="checkbox"
                  class="ml-2 mr-2"
                  :id="item.id"
                  v-model="item.active"
                  @change="toggleTodo(item)"
                />
                <span
                  class="form-check-label"
                  :class="item.active == false ? 'active' : ''"
                >
                  {{ item.active ? "완료" : "진행중" }}
                </span>
              </td>
              <td>
                <div class="btn-group" role="group">
                  <button class="btn btn-warning" @click="editTodo(item.id)">
                    수정
                  </button>
                  <button class="btn btn-danger" @click="openModal(item.id)">
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <nav aria-label="Page navigation example">
      <ul class="pagination" v-show="page_total > 1">
        <!-- 현재 페이지가 1페이지일 때 hidden -->
        <li class="page-item" v-show="page_now !== 1">
          <a class="page-link" href="#" @click="getInfo(page_now - 1)"
            >Previous</a
          >
        </li>

        <li class="page-item" v-for="item in page_total" :key="item">
          <a
            class="page-link"
            href="#"
            @click="getInfo(item)"
            :class="page_now == item ? 'active' : ''"
            >{{ item }}</a
          >
        </li>

        <li class="page-item" v-show="page_now !== page_total">
          <a class="page-link" href="#" @click="getInfo(page_now + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import ModalWin from "@/components/ModalWin.vue";

export default {
  components: {
    ModalWin,
  },
  setup() {
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

    const deleteTodo = () => {
      // console.log(id);
      fetch(`http://mjleemj.dothome.co.kr/data_delete.php?id=${deleteId.value}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.result == 1) {
            deleteId.value = null;
            // 닫기 in 모달창
            showModal.value = false;
            getInfo();
          } else {
            console.log("삭제에 실패했습니다");
          }
        });
    };

    // 자료 보관 배열
    const todos = ref([]);
    // 서버에서 자료를 읽어오기
    const router = useRouter();

    const getInfo = (_page = 1) => {
      page_now.value = _page;

      if (searchActive.value == true) {
        searchTodo(page_now.value);
        return;
      }
      fetch(
        `http://mjleemj.dothome.co.kr/data_read.php?page_now=${page_now.value}&data_count=${data_count}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data.result);
          todos.value = data.result;
          // todos 종류는 배열. for 이용해서 접근해서 complete가 0이냐 1이냐에 따라 그 값을 반영하는 객체를 추가.
          for (let item of todos.value) {
            if (item.complete === "0") {
              item.active = false;
            } else {
              item.active = true;
            }
            // console.log(item);
          }
        })
        .catch();
    };

    // 상태 업데이트
    const toggleTodo = (_obj) => {
      console.log(_obj);
      if (_obj.active == true) {
        _obj.complete = 1;
      } else {
        _obj.complete = 0;
      }

      fetch(
        `http://mjleemj.dothome.co.kr/data_update.php?id=${_obj.id}&title=${_obj.title}&body=${_obj.body}&complete=${_obj.complete}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch();
    };

    const moveDetail = (id) => {
      // console.log(id);
      router.push({
        name: "Detail",
        params: {
          id: id,
        },
      });
    };

    const writeTodo = () => {
      router.push({
        name: "Create",
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

    // 페이지네이션

    // 전체 데이터 개수
    const data_total = ref(0);
    // 페이지당 보여줄 개수
    const data_count = 5;
    // 총 페이지 수
    const page_total = ref(0);
    // 현재 페이지
    const page_now = ref(1);

    // 전체 데이터 수 받아오기
    const getTotal = () => {
      fetch(`http://mjleemj.dothome.co.kr/data_total.php`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          // console.log(data.total);
          // 전체 페이지 갱신
          data_total.value = data.total;
          page_total.value = Math.ceil(data_total.value / data_count);
          page_now.value = 1;
          // console.log(page_total.value);

          getInfo();
        })
        .catch();
    };

    getTotal();

    // 현재 생성된 목록이 검색으로 인한 것인지 아니면 검색없이 일반적인 목록인지를 구분하는 변수가 필요.
    const searchActive = ref(false);

    // 검색 기능 구현
    const searchText = ref("");
    let searchTimer = null;
    // searchText 변화 감시
    watch(searchText, () => {
      clearTimeout(searchTimer);

      if (searchText.value !== "") {
        searchActive.value = true;
        searchTimer = setTimeout(() => {
          // 검색어와 동일한 내용을 php를 이용해서 전체 개수를 파악한다 (data_total_search.php)
          getTotalSearch();
        }, 2000);
      } else {
        searchActive.value = false;
        getTotal();
      }
    });

    // 검색에 해당하는 총 목록 개수를 가지고 온다.
    const getTotalSearch = () => {
      clearTimeout(searchTimer);
      fetch(
        `http://mjleemj.dothome.co.kr/data_total_search.php?title=${searchText.value}`
      )
        .then((res) => res.json())
        .then((data) => {
          // 검색어에 해당하는 데이터 개수
          data_total.value = data.total;
          console.log(data_total.value);
          // 페이지네이션 갱신
          page_total.value = Math.ceil(data_total.value / data_count);
          // 시작페이지는 1페이지로 세팅
          page_now.value = 1;
          // 실제 내용 가져오기
          searchTodo();
        })
        .catch();
    };

    // 검색에 해당하는 내용을 목록으로 가지고 오는 php를 실행
    const searchTodo = () => {
      fetch(
        `http://mjleemj.dothome.co.kr/data_read_search.php?page_now=${page_now.value}&data_count=${data_count}&title=${searchText.value}`
      )
        .then((res) => res.json())
        .then((data) => {
          // 검색된 배열을 받아서 todos 업데이트
          todos.value = data.result;
          // complete 값에 따라 처리
          for (let item of todos.value) {
            if (item.complete === "0") {
              item.active = false;
            } else {
              item.active = true;
            }
          }
        })
        .catch();
    };

    return {
      todos,
      deleteTodo,
      moveDetail,
      editTodo,
      writeTodo,
      page_total,
      getInfo,
      page_now,
      ModalWin,
      closeModal,
      openModal,
      showModal,
      toggleTodo,
      searchText,
      getTotalSearch,
    };
  },
};
</script>

<style scoped>
.detail {
  cursor: pointer;
  color: #000;
}

.detail:hover {
  text-decoration: underline;
  color: green;
}

.bt-write {
  float: right;
}

.active {
  background-color: hotpink;
  color: #fff;
}

.search {
  width: 50%;
  float: right;
}
</style>
