
const {ref, reactive, onMounted} = Vue;

export default {
    name: 'Test',
    
    setup() {
        const title = "Hello";
        const newDirectoryName = ref(null)
        const newDirectoryPath = ref(null)
        const newDirectoryCategory = ref(null)
        const directorysList = reactive({data:[]})
        var error = chrome.runtime.lastError;
        
        onMounted(() => {
            
            // get storge data
            chrome.storage.sync.get(['directorys'], res => {
                if (res.directorys === undefined) {
                    chrome.storage.sync.set({ 'directorys': [] }, () => { })
                }
                directorysList.data = res.directorys
            })



        })

        const clearStorge = () => {
            chrome.storage.sync.clear(() => {
                if (error) {console.error(error);}
            })
        }

        const updateDirectorysStorge = (method, data=null, index=null) => {
            chrome.storage.sync.get(['directorys'], (res) => {
                // Update new data
                let newData = res.directorys

                if (method === 'add') {
                    newData.push(data)
                }
                else if (method === 'delete') {
                    newData.splice(index, 1)
                }
                
                const storge = {}
                storge['directorys'] = newData
                
                // Push new data to storge
                chrome.storage.sync.set(storge, () => {
                    if (error) { console.error(error); }
                    else {
                        // Re-get storge data & sync local variable
                        chrome.storage.sync.get(['directorys'], res => {
                            directorysList.data = res.directorys            
                        })
                    }
                })
            })
        }
        
        
        
        const addFolder = (e) => {
            const name = newDirectoryName.value.value
            const path = newDirectoryPath.value.value
            // const category = newDirectoryCategory.value.value
            
            updateDirectorysStorge('add', {name, path})
        };




        const deleteFolder = index => {
            updateDirectorysStorge('delete', index=index)
        }

        
        return {
            title,
            newDirectoryName,
            newDirectoryPath,
            updateDirectorysStorge,
            addFolder,
            clearStorge,
            directorysList,
            deleteFolder
        };
    },

};

