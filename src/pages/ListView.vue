<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                Todo List
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
                        <tr 
                        v-for="(item, index) in todos"
                        :key="item.id"
                        >
                            <th>{{ index + 1 }}</th>
                            <!-- <td>{{ item.id }}</td> -->
                            <td><span @click="moveDetail(item.id)" class="detail">{{ item.title }}</span></td>
                            <!-- <td>{{ item.body }}</td> -->
                            <td>{{ item.complete }}</td>
                            <td>
                                <div class="btn-group" role="group">
                                    <button class="btn btn-primary">편집</button>
                                    <button class="btn btn-danger" @click="deleteTodo(item.id)">삭제</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import {ref} from 'vue'
    import {useRouter} from 'vue-router'

    export default {

        setup() {
            // 자료 보관 배열
            const todos =ref([])
            // 서버에서 자료를 읽어오기
            const router = useRouter();

            const getInfo = () => {
                fetch('http://mjleemj.dothome.co.kr/data_read.php')
                    .then(res => res.json())
                    .then(data => {
                        console.log(data.result);
                        todos.value = data.result;
                    })
                    .catch()
            }
            getInfo();

            const deleteTodo = (id) => {
                console.log(id);
                fetch(`http://mjleemj.dothome.co.kr/data_delete.php?id=${id}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        if(data.result == 1){
                            getInfo();
                        }else{
                            console.log('삭제에 실패했습니다')
                        }
                    })
            }

            const moveDetail = (id) => {
                console.log(id);
                router.push({
                    name: 'Detail',
                    params: {
                        id : id
                    }
                })
            }
            return {
                todos,
                deleteTodo,
                moveDetail
            }
        }

    }
</script>

<style scoped>

.detail{
    cursor: pointer;
    color: #000;
}

.detail:hover{
    text-decoration: underline;
    color: green;
}

</style>