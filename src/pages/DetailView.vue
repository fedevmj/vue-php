<template>
    <div class="card">
        <div class="card-header">
            Todo
        </div>
        <div class="card-body">
            <h4 class="card-title">{{todo.title}}</h4>
            <p class="card-text">{{todo.body}}</p>
            <p class="card-text">{{todo.complete}}</p>
            <p class="card-text">{{todo.body}}</p>
            <div class="btn-group" role="group" aria-label="">
                <button type="button" class="btn btn-warning" @click="editTodo(todo.id)">수정</button>
                <button type="button" class="btn btn-danger" @click="deleteTodo(todo.id)">삭제</button>
                <button type="button" class="btn btn-primary" @click="moveList">목록보기</button>
            </div>
        </div>
    </div>
</template>

<script>
    // useRouter는 보낼 때, useRoute는 받아올 때
    import {
        useRoute,
        useRouter
    } from 'vue-router'
    // import {useRoute} from 'vue-router'
    import {
        reactive
    } from 'vue'
    export default {
        setup() {
            const route = useRoute();
            // console.log(route.params.id);

            const router = useRouter();

            const todo = reactive({
                title: '',
                body: '',
                id: 0,
                complete: 0
            })

            // ID를 전달하고 자료를 받아온다.
            const getInfo = () => {
                fetch(`http://mjleemj.dothome.co.kr/data_read_id.php?id=${route.params.id}`)
                    .then(res => res.json())
                    .then(data => {
                        // console.log(data);
                        todo.title = data.result[0].title;
                        todo.body = data.result[0].body;
                        todo.complete = data.result[0].complete;
                        todo.id = data.result[0].id;
                    })
                    .catch()
            }
            getInfo()

            const deleteTodo = (id) => {
                console.log(id)
                fetch(`http://mjleemj.dothome.co.kr/data_delete.php?id=${id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.result == 1) {
                            // router.push('/list')
                            moveDetail();
                        } else {
                            console.log('삭제에 실패했습니다')
                        }
                    })
            }

            const moveDetail = (id) => {
                // console.log(id);
                router.push({
                    name: 'List',
                    params: {
                        id: id
                    }
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

            const moveList = () => {
                router.push({
                    name: 'List'
                })
            }

            return {
                todo,
                deleteTodo,
                editTodo,
                moveList
            }

        }

    }
</script>

<style>

</style>