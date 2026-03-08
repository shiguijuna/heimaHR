<template>
  <!--
    dragover 事件在可拖动的元素或者被选择的文本被拖进一个有效的放置目标时（每几百毫秒）触发。
    drop 事件在元素或文本选择被放置到有效的放置目标上时触发。为确保 drop 事件始终按预期触发，应当在处理 dragover 事件的代码部分始终包含 preventDefault() 调用。
   -->
  <div>
    <div class="box" @dragover="dragoverFn" @drop="dropFn" />
  </div>
</template>

<script>
export default {

  components: {},
  data() {
    return {
    }
  },

  methods: {
    dragoverFn(e) {
      e.preventDefault() // 阻止默认行为
      console.log('dragoverFn')
    },
    async dropFn(e) {
      e.preventDefault()
      console.log('dropFn')
      console.log(e.dataTransfer.files)
    }
  }

}

</script>
<style  scoped lang="scss">
.box{
  width: 200px;
  height: 200px;
  background-color:pink;
  border: 1px solid red;
}
</style>
