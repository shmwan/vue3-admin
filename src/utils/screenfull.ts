class screenfull {
    id: string;
    isEnabled: boolean;

    constructor(id: string) {
        this.id = id;
        this.isEnabled = false
    }
    initScreen() {
        const elem = document.getElementById(this.id);
        if (elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem?.msRequestFullscreen) {
                /* IE11 */
                elem.msRequestFullscreen();
            }
            this.isEnabled = true;
        } else {
            throw new Error("Invalid DomElement requested")
        }
    }
    exitScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        this.isEnabled = false;
    }
}

export default screenfull;