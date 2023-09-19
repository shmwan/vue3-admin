

const useKeyEnter = (callBack:any) => {
    // 监听回车
        document.onkeydown = (e: any) => {
            if (e.defaultPrevented) {
                return;
            }
            if (e.keyCode === 13) {
                callBack()
            }
        };
};
export default useKeyEnter;