<template>
    <div class="card">
        <div class="card-header">
            TODO UPDATE
        </div>
        <div class="card-body">
            <form @submit.prevent="onSubmit">
                <div class="form-group">
                    <label for="title">제목</label>
                    <input type="text" v-model="todo.title" class="form-control" name="title" id="title"
                        aria-describedby="helpId" placeholder="">
                    <small id="helpId" class="form-text text-muted">제목을 입력하세요.</small>
                </div>
                <div class="form-group">
                    <label for="body">내용</label>
                    <textarea class="form-control" v-model="todo.body" name="body" id="body" rows="3"></textarea>
                    <small id="helpId" class="form-text text-muted">내용을 입력하세요.</small>
                </div>
                <div class="form-check">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue" checked>
                        완료여부
                    </label>
                </div>

                <div class="btn-group" role="group" aria-label="">
                    <button type="submit" class="btn btn-success">확인</button>
                    <button type="button" class="btn btn-danger" @click="moveList">취소</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import {
        reactive
    } from 'vue'
    import {
        useRoute,
        useRouter
    } from 'vue-router';
    export default {

        setup() {
            const route = useRoute();
            const router = useRouter();

            const todo = reactive({
                title: '',
                complete: false,
                body: '',
                id: 0
            })

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

            const onSubmit = () => {
                fetch(
                        `http://mjleemj.dothome.co.kr/data_update.php?id=${todo.id}&title=${todo.title}&body=${todo.body}&complete=${todo.complete}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        if (data.result == 1) {
                            router.push({
                                name: 'Detail',
                                params: {
                                    id: todo.id
                                }
                            })
                        }
                    })
                    .catch()

                router.push({
                    name: 'List'
                })
            }

            const moveList = () => {
                router.push({
                    name: 'List'
                })
            }

            return {
                todo,
                onSubmit,
                moveList
            }
        }

    }
</script>

<style>

</style>