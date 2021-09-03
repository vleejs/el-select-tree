<template>
  <div id="app">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="下拉树">
        <Tree :tree-data="treeData" />
      </el-form-item>
      <el-form-item label="下拉树123"> </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tree from './components/Tree.vue'

export default {
  name: 'App',
  components: {
    Tree,
  },
  methods: {},
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      values: [],
      treeData: [
        {
          id: '0',
          label: '全部',
          children: [
            {
              id: '1',
              label: '客车',
              children: [
                {
                  id: '1-1',
                  label: '客1',
                },
                {
                  id: '1-2',
                  label: '客2',
                },
                {
                  id: '1-3',
                  label: '客3',
                },
                {
                  id: '1-4',
                  label: '客4',
                },
              ],
            },
            {
              id: '2',
              label: '货车',
              children: [
                {
                  id: '2-1',
                  label: '货1',
                },
                {
                  id: '2-2',
                  label: '货2',
                },
                {
                  id: '2-3',
                  label: '货3',
                },
                {
                  id: '2-4',
                  label: '货4',
                },
                {
                  id: '2-5',
                  label: '货5',
                },
                {
                  id: '2-6',
                  label: '货6',
                },
              ],
            },
            {
              id: '3',
              label: '专项作业车',
            },
          ],
        },
      ],
    }
  },
}
</script>
