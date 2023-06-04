// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsement-solo-project-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const messageInDB = ref(database, "endorsementMessage")

const publishBtn = document.getElementById("publish-btn")
const messageEl = document.getElementById("message-el")
const senderEl = document.getElementById("msgsender-el")
const recipientEl = document.getElementById("recipient-el")
const messageDisplayEl = document.getElementById("Endorsement-messages-div")

publishBtn.addEventListener("click", function() {
    let messageArray = [messageEl.value, senderEl.value, recipientEl.value]
    
    push(messageInDB, messageArray)
    
    clearInputs()
})

function clearInputs(){
    messageEl.value = ""
    senderEl.value = ""
    recipientEl.value = ""
}

onValue(messageInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        messageDisplayEl.innerHTML = ""
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            // let currentItemID = currentItem[0]
            // let currentItemValue = currentItem[1]
            
            appendItemToMessageDisplayEl(currentItem)
        }    
    } else {
        messageDisplayEl.innerHTML = `<h2>No endorsements here... yet</h2`
    }
})

function appendItemToMessageDisplayEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("div")
    newEl.setAttribute("id",itemID)
    newEl.setAttribute("class","message")
    
    // newEl.textContent = itemValue
    
    newEl.innerHTML += `
                                    <p><span class="bold">To ${itemValue[2]}</span> <br>${itemValue[0]}<br><span class="bold">From ${itemValue[1]}</span></p>
                                  `
    
    
    
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `endorsementMessage/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    messageDisplayEl.append(newEl)
}