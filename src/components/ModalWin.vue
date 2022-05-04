<template>
  <div class="modal-wrap">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <!-- Delete TODO -->
            <slot name="title"></slot>
          </h5>

          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="onClose"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>
            <!-- 내용을 삭제하시겠습니까? -->
            <slot name="body"></slot>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="onDelete">
            확인
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
            @click="onClose"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";

export default {
  emits: ["delete-modal", "close-modal"],
  setup() {
    const { emit } = getCurrentInstance();
    const onDelete = () => {
      emit("delete-modal");
    };

    const onClose = () => {
      emit("close-modal");
    };
    return {
      onDelete,
      onClose,
    };
  },
};
</script>

<style>
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
}
</style>
