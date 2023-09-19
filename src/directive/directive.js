import { createApp } from "vue";
import App from '@/App.vue'
import { _has} from "@/utils/directive.js";
let app = createApp(App);

app.directive('has',{
    mounted(el,binding){
        if (!_has(binding.value)) {
         el.parentNode && el.parentNode.removeChild(el) 
        }
    }
})


