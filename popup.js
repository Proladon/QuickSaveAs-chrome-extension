
const {ref, reactive, onMounted} = Vue;

export default {
    name: 'Test',
    
    setup() {
        const title = "Hello";
        const newDirectoryName = ref(null)
        const newDirectoryPath = ref(null)
        const directorysList = reactive({data:[]})
        var error = chrome.runtime.lastError;
        
        onMounted(() => {
            
            // get storge data
            chrome.storage.sync.get(['directorys'], res => {
                if (res.directorys === undefined) {
                    chrome.storage.sync.set({ 'directorys': [] }, () => { })
                }
                directorysList.data = res.directorys
                console.log(res)
                console.log(directorysList.data)
            })



        })

        const clearStorge = () => {
            chrome.storage.sync.clear(() => {
                if (error) {console.error(error);}
            })
        }

        const addFolder = (e) => {
            const name = newDirectoryName.value.value
            const path = newDirectoryPath.value.value

            chrome.storage.sync.get(['directorys'], (res) => {
                // Update new data
                let newData = res.directorys
                newData.push({name,path})
                
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
        };


        
        return {
            title,
            newDirectoryName,
            newDirectoryPath,
            addFolder,
            clearStorge,
            directorysList
        };
    },

};

