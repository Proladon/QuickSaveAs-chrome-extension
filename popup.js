
const {ref} = Vue;
export default {
    name: 'Test',
    
    setup() {
        const title = "Hello";
        const folderList = ref(null)
        
        const addFolder = () => {
            // folderList.
            // const folderList = document.getElementById("folder-list")
            folderList.value.appendChild(document.createElement("input"))
        }

        const test = (evnt) => {
            console.log(evnt)
        }

        
        return {
            title,
            addFolder,
            folderList,
            test,
        };
    },

};

