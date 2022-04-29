<template>
    <div class="container">

        <div class="card">
            <div class="card-header">
                Todo List
                <button class="btn btn-success bt-write" @click="writeTodo">글작성</button>
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
                            <td><span @click="moveDetail(item.id)" class="detail">{{ item.title }}</span></td>
                            <!-- <td>{{ item.body }}</td> -->
                            <td>{{ item.complete }}</td>
                            <td>
                                <div class="btn-group" role="group">
                                    <button class="btn btn-warning" @click="editTodo(item.id)">수정</button>
                                    <button class="btn btn-danger" @click="deleteTodo(item.id)">삭제</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>


        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item"><a class="page-link" href="#">Previous</a></li>

                <li class="page-item"
                    v-for="item in page_total"
                    :key="item"
                ><a class="page-link" href="#" @click="getInfo(item)">{{item}}</a></li>

                <li class="page-item"><a class="page-link" href="#">Next</a></li>
            </ul>
        </nav>
    </div>
</template>

<script>
    import {
        ref
    } from 'vue'
    import {
        useRouter
    } from 'vue-router'

    export default {

        setup() {
            // 자료 보관 배열
            const todos = ref([])
            // 서버에서 자료를 읽어오기
            const router = useRouter();

            const getInfo = (_page = 1) => {
                page_now.value = _page;
                fetch(`http://mjleemj.dothome.co.kr/data_read.php?page_now=${page_now.value}&data_count=${data_count}`)
                    .then(res => res.json())
                    .then(data => {
                        // console.log(data.result);
                        todos.value = data.result;
                    })
                    .catch()
            }

            const deleteTodo = (id) => {
                // console.log(id);
                fetch(`http://mjleemj.dothome.co.kr/data_delete.php?id=${id}`)
                    .then(res => res.json())
                    .then(data => {
                        // console.log(data);
                        if (data.result == 1) {
                            getInfo();
                        } else {
                            console.log('삭제에 실패했습니다')
                        }
                    })
            }

            const moveDetail = (id) => {
                // console.log(id);
                router.push({
                    name: 'Detail',
                    params: {
                        id: id
                    }
                })
            }

            const writeTodo = () => {
                router.push({
                    name: 'Create'
                })
            }

            const editTodo = (id) => {
                router.push({
                    name: 'Update',
                    params: {
                        id: id
                    }
                })
            }

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
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        console.log(data.total);
                        // 전체 페이지 갱신
                        data_total.value = data.total;
                        page_total.value = Math.ceil(data_total.value / data_count);
                        page_now.value = 1;
                        console.log(page_total.value);

                        getInfo();
                    })
                    .catch()
            }

            getTotal()

            return {
                todos,
                deleteTodo,
                moveDetail,
                editTodo,
                writeTodo,
                page_total,
                getInfo
            }
        }

    }
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

    .bt-write{
        float: right;
    }
</style>