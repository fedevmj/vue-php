<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                TODO Create
            </div>
            <div class="card-body">
                <form @submit.prevent="onSubmit">
                    <div class="form-group">
                        <label for="title">제목</label>
                        <input type="text" v-model="todo.title" class="form-control" name="title" id="title" aria-describedby="helpId" placeholder="">
                        <small id="helpId" class="form-text text-muted">제목을 입력하세요.</small>
                    </div>

                    <div class="form-group">
                        <label for="body"></label>
                        <textarea class="form-control" v-model="todo.body" name="body" id="body" rows="3"></textarea>
                        <small id="helpId" class="form-text text-muted">내용을 입력하세요.</small>
                    </div>

                    <div class="btn-group" role="group">
                        <button type="submit" class="btn btn-success">확인</button>
                        <button type="button" class="btn btn-warning">취소</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
    
<script>
    import {reactive} from 'vue'
    import { useRouter } from 'vue-router'
    export default{

        setup(){
            // 값이 변하는 것을 계속 유지.
            const todo = reactive({
                title: '',
                body: ''
            })

            const router = useRouter();

            const onSubmit = () => {
                console.log(todo);
                // ?를 기준으로 앞이 주소, 뒤가 query
                // &은 변수 구분 (title, body)
                fetch(`http://mjleemj.dothome.co.kr/data_add.php?title=${todo.title}&body=${todo.body}`)
                .then(res => res.json())
                .then(data => {
                    if(data.result == 1){
                        // List 화면으로 이동
                        router.push('/list');
                    }else{
                        console.log('서버에서 자료를 불러오는 데 실패했습니다.')
                    }
                })
                .catch()
            }
            return{
                todo,
                onSubmit
            }
        }
    
    }
</script>
    
<style>
    
</style>