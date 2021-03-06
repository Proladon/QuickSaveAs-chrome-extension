
const {ref, reactive, onMounted} = Vue;

export default {
    name: 'Test',
    
    setup() {
        const page = ref("folder");
        const newDirectoryName = ref(null)
        const newDirectoryPath = ref(null)
        const newDirectoryCategory = ref(null)
        const directorysList = reactive({data:[]})
        var error = chrome.runtime.lastError;
        
        
        const clearStorge = () => {
            chrome.storage.sync.clear(() => {
                if (error) { console.error(error); }
                else {
                    chrome.storage.sync.get(['directorys'], res => {
                        directorysList.data = res.directorys
                    })
                }
            })
        }


        const changePage = name => {
            page.value = name
        }

        const updateContextMenu = (data) => {
            chrome.contextMenus.create({
                id: data.name,
                title: data.name,
                parentId: data.category,
                // contexts: ["image"],
            });
        }
        
        const updateDirectorysStorge = (method, data = null, index = null) => {
            chrome.storage.sync.get(['directorys', 'categorys'], (res) => {
                // Update new data
                let newData = res.directorys
                let cates = res.categorys
                const storge = {}
                
                //:: ADD
                if (method === 'add') {
                    newData.push(data)
                    
                    // Checking category already exist or not
                    if (!cates.includes(data.category)) {
                        cates.push(data.category)
                        storge['categorys'] = cates
                        
                        // create new category contextMenu
                        chrome.contextMenus.create({
                            id: data.category,
                            title: data.category,
                            parentId: 'contextRoot',
                            contexts: ["image"],
                        })
                    }
                    
                    // push to contextMenu
                    chrome.contextMenus.create({
                        id: data.name,
                        title: data.name,
                        parentId: data.category,
                        contexts: ["image"],
                    })
                }
                //:: DELETE
                else if (method === 'delete') {
                    const targetName = newData[index].name
                    const targetCate = newData[index].category
                    newData.splice(index, 1)
                    
                    // create new category contextMenu
                    chrome.contextMenus.remove(targetName)

                    // Checking category alive or not
                    let alive = false
                    for (let data of newData) {
                        if (data.category === targetCate) {
                            alive = true
                            break;
                        }
                    }
                    if(!alive) {
                        cates.splice(cates.indexOf(targetCate), 1)
                        chrome.contextMenus.remove(targetCate)
                        storge['categorys'] = cates
                    }

                }
                
                storge['directorys'] = newData

                
                
                // Push new data to storge
                chrome.storage.sync.set(storge, () => {
                    if (error) { console.error(error); }
                    else {
                        // Re-get storge data & sync local variable
                        chrome.storage.sync.get(['directorys', 'categorys'], res => {
                            directorysList.data = res.directorys     
                            console.log(res)
                        })
                    }
                })
            })
        }
        

        
        
        const addFolder = (e) => {
            const name = newDirectoryName.value.value
            const path = newDirectoryPath.value.value
            const category = newDirectoryCategory.value.value
            
            // input checking
            name.trim()
            path.trim()
            category.trim()
            if (name === ''|| category === '' || path === '') {
                return
            }

            // Update ContextMenu
            
            
            updateDirectorysStorge('add', {name, category, path})
        };
        
        const deleteFolder = num => {
            updateDirectorysStorge('delete', null, num)
        }

        
        onMounted(() => {
            // get storge data
            chrome.storage.sync.get(['directorys'], res => {
                if (res.directorys === undefined) {
                    chrome.storage.sync.set({ 'directorys': [], 'categorys':[] }, () => { })
                }
                directorysList.data = res.directorys
                
                
            })
        })
        
        return {
            page,
            changePage,
            newDirectoryName,
            newDirectoryPath,
            newDirectoryCategory,
            updateDirectorysStorge,
            addFolder,
            clearStorge,
            directorysList,
            deleteFolder
        };
    },
    
};

