import { useRoute } from "vue-router";

export function useRouterPermission(){
    const router = useRoute;
    return router().path?.replace('/','')
}