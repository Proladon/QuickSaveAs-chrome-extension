chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "contextRoot",
        title: "Quick Save As",
        contexts: ["image"],
    });
});
