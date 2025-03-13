function SidebarManager() {
    const sidebar = document.getElementById("app-sidebar");
    const appBody = document.getElementById("app-body");
    const collapseButton = document.getElementById("collapse-button");
    const storageSidebarKey = "nota-bene-sidebar-collapsed";

    // Load previous state
    chrome.storage.local.get([storageSidebarKey]).then(result => {
        if (result[storageSidebarKey]) {
            sidebar.classList.add("collapsed");
            appBody.classList.add("sidebar-collapsed");
            collapseButton.textContent = "open";
        }
    });

    // Add click handler for collapse button
    collapseButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        appBody.classList.toggle("sidebar-collapsed");
        collapseButton.textContent = sidebar.classList.contains("collapsed") ? "open" : "collapse";
        
        // Store state
        chrome.storage.local.set({ 
            [storageSidebarKey]: sidebar.classList.contains("collapsed") 
        });
    });
}

export default SidebarManager;