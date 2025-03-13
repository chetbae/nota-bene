class DividerHandler {
    constructor() {
        this.divider = document.getElementById("app-divider");
        this.sidebar = document.getElementById("app-sidebar");
        this.mainContent = document.getElementById("app-main-content");
        this.isDragging = false;
        this.startX = 0;
        this.startWidth = 0;
        this.appBody = document.getElementById("app-body");

        // Load saved width
        this.loadSavedWidth();

        // Bind events
        this.divider.addEventListener(
            "mousedown",
            this.startDragging.bind(this)
        );
        document.addEventListener("mousemove", this.drag.bind(this));
        document.addEventListener("mouseup", this.stopDragging.bind(this));
    }

    loadSavedWidth() {
        chrome.storage.local.get(["sidebarWidth"], (result) => {
            if (result.sidebarWidth) {
                this.sidebar.style.width = result.sidebarWidth + "px";
            }
        });
    }

    saveWidth(width) {
        if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ sidebarWidth: width });
        } else {
            localStorage.setItem("sidebarWidth", width + "px");
        }
    }

    startDragging(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.startWidth = this.sidebar.offsetWidth;
        document.body.style.cursor = "col-resize";
        this.appBody.classList.add("resizing");

        // Add a class to the divider for visual feedback
        this.divider.classList.add("dragging");

        // Prevent text selection during drag
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;

        const delta = e.clientX - this.startX;
        const newWidth = Math.max(200, Math.min(400, this.startWidth + delta));

        this.sidebar.style.width = `${newWidth}px`;

        // No need to adjust main content width as it's flex: 1
    }

    stopDragging() {
        if (!this.isDragging) return;

        this.isDragging = false;
        document.body.style.cursor = "";
        this.divider.classList.remove("dragging");
        this.appBody.classList.remove("resizing");

        // Save the final width
        this.saveWidth(this.sidebar.offsetWidth);
    }
}

export default DividerHandler;
