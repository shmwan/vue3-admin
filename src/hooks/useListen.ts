const useListen = () => {
    // 监听鼠标事件
    const listenMouse = () => {
        document.addEventListener('keydown', () => {
            uploadToParent();
        });
        window.addEventListener('mouseenter', () => {
            uploadToParent();
        });
        window.addEventListener('mousemove', () => {
            uploadToParent();
        });
        //  鼠标停止
        window.addEventListener('mouseout', () => {
            uploadToParent();

        });
        window.addEventListener('click', () => {
            uploadToParent();
        });
    };
    // 上传到父级
    const uploadToParent = () => {
        window.parent.postMessage({ data: true, event: "listenEvent", msg:'' }, '*')
    };
    return {
        listenMouse
    };
};
export default useListen;