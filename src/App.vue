<template>
  <div id="app">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="VastSelectTree">
        <VastSelectTree v-model="values" :treeParams="treeParams" :styles="styles" />
      </el-form-item>
      <el-form-item label="下拉树123"> </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TREE_JSON from './assets/json/treeData.json'
import VastSelectTree from './components/VastSelectTree.vue'

export default {
  name: 'App',
  components: {
    VastSelectTree,
  },
  methods: {},
  data() {
    return {
      values: [],
      popoverClass: 'vast-popover-class', // 弹窗类名
      styles: {
        width: '400px',
      },

      treeParams: {
        'check-strictly': true,
        'default-expand-all': true,
        'expand-on-click-node': false,
        clickParent: false,
        filterable: true,
        data: TREE_JSON,
        props: {
          children: 'children',
          label: 'label',
          disabled: 'disabled',
          value: 'id',
        },
      },
    }
  },
}
</script>

<style lang="scss">
// .el-popover {
//   padding: 0px;
// }
</style>
