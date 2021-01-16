chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "contextRoot",
        title: "Quick Save As",
        contexts: ["image"],
    });

    chrome.storage.sync.get(['categorys'], res => {
        for (let cate of res.categorys) {
            chrome.contextMenus.create({
                id: cate,
                title: cate,
                parentId: 'contextRoot',
                contexts: ["image"],
            })
        }
    })


    
});
