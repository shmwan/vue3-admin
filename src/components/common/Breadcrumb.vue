<template>
    <div class="viewCon">
        <el-breadcrumb class="breadcrumb" >
            <el-breadcrumb-item 
            v-for="(item,index) in menuList" 
            :key="index" 
            :href="item.path">
           <span>
            {{item.name}}
           </span>
        </el-breadcrumb-item> 
        </el-breadcrumb>
    </div>
  </template>
  <script>
  import { defineComponent ,computed } from 'vue';
import { useRoute ,} from 'vue-router';
  export default defineComponent({
    setup() {
        const routerList = useRoute();
        const menuList = computed(()=>{
            return routerList.matched
        })
          return {
            menuList,
          };

    },  
  });
  </script>
  <style lang="less" scoped>
     .breadcrumb {
        margin-bottom: 30px;
    }
    </style>