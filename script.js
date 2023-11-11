"use strict"

const initialItem = document.querySelector(".list-itemsContainer-initialItem")
const itemsContainer = document.getElementById("itemsContainer")
const addItemBtn = document.getElementById("addItemBtn")
const saveBtn = document.getElementById("saveBtn")
const initialtext = document.getElementById("initialtext")
const initialnumb = document.getElementById("initialnumb")

const data = [ //хранилище введенных данных, текущие значения для показательности
    ["первый", "123"],
    ["второй", "456"],
    ["третий", "789"],
]

function itemsListEmptynessCheck() {
    const items = itemsContainer.querySelectorAll(".list-itemsContainer-item")


    if (items.length === 0) {
        initialItem.style.display = "none"
        itemsContainer.appendChild(initialItem)
        $(".list-itemsContainer-initialItem").fadeIn(100)
        return true
    }
}

function listHeightAnimation(animationType) {
    return new Promise(function(resolve, reject) {
        const itemsAmount = itemsContainer.children.length

        if (itemsAmount === 0) {
            resolve()
        }
        else {

            if (animationType === "grow") {
                let heightChange = 0
    
                const currentHeight = itemsContainer.offsetHeight
                const heightGrowGoal = 40 + currentHeight
        
                const interval = setInterval(() => {
                    heightChange = heightChange + 2
                    const newHeight = currentHeight + heightChange

                    itemsContainer.style.height = newHeight + "px"
        
                    if(newHeight > heightGrowGoal) {
                        itemsContainer.style.height = heightGrowGoal + "px"

                        resolve()
                        clearInterval(interval)
                    }
        
                    
                }, 10)
            } 

            else if (animationType === "reduction") {
                let heightChange = 0
    
                const currentHeight = itemsContainer.offsetHeight
                const heightReductionGoal = currentHeight - 40
            
                const interval = setInterval(() => {
                    heightChange = heightChange + 2
                    const newHeight = currentHeight - heightChange

                    itemsContainer.style.height = newHeight + "px"
            
                    if(newHeight < heightReductionGoal) {
                        itemsContainer.style.height = heightReductionGoal + "px"
                        resolve()
                        clearInterval(interval)
                    }
            
                    
                }, 10)
            }
        }
    })
}

function itemOpacityAnimation(item, animationType) {

    return new Promise(function(resolve, reject) {

        if (animationType === "grow") {
            const currentOpacity = 0
            const opacityGoal = 1
            let opacityChange = 0
        
            const interval = setInterval(() => {
                opacityChange = opacityChange + 0.03
                let newOpacity = currentOpacity + opacityChange
                item.style.opacity = newOpacity
        
                if(newOpacity > opacityGoal) {
                    
                    item.style.opacity = 1
                    clearInterval(interval)
                    resolve()
                }
        
            }, 10)
        }
    
        else if (animationType === "reduction") {
            const currentOpacity = 1
            const opacityGoal = 0
            let opacityChange = 0
        
            const interval = setInterval(() => {
                opacityChange = opacityChange + 0.03
                let newOpacity = currentOpacity - opacityChange
                item.style.opacity = newOpacity
        
                if(newOpacity < opacityGoal) {
                    item.style.opacity = 0
                    clearInterval(interval)
                    resolve()
                }
        
            }, 10)
        }
    })
}

function swapItems(item, swapDirection) {
    if (swapDirection === "top") {

        const topBlankItem = document.createElement("div")
        topBlankItem.classList.add("list-itemsContainer-item-blankItem")

        const bottomBlankItem = document.createElement("div")
        bottomBlankItem.classList.add("list-itemsContainer-item-blankItem")
        bottomBlankItem.style.height = "0"

        const itemAbove = item.previousElementSibling //точка перехода при вверх
        itemOpacityAnimation(itemAbove, "reduction").then( () => {
            swapItemsAnimation(item, topBlankItem, bottomBlankItem, itemAbove, swapDirection).then(() => {
                itemsContainer.removeChild(topBlankItem)
                itemsContainer.replaceChild(itemAbove, bottomBlankItem)
                itemOpacityAnimation(itemAbove, "grow")
            })
        })

    }

    else if (swapDirection === "bottom") {
        const topBlankItem = document.createElement("div")
        topBlankItem.classList.add("list-itemsContainer-item-blankItem")
        topBlankItem.style.height = "0"

        const bottomBlankItem = document.createElement("div")
        bottomBlankItem.classList.add("list-itemsContainer-item-blankItem")

        const itemBelow = item.nextElementSibling //точка перехода при вниз
        itemOpacityAnimation(itemBelow, "reduction").then( () => {
            swapItemsAnimation(item, topBlankItem, bottomBlankItem, itemBelow, swapDirection).then(() => {
                itemsContainer.removeChild(bottomBlankItem)
                itemsContainer.replaceChild(itemBelow, topBlankItem)
                itemOpacityAnimation(itemBelow, "grow")
            })
        })
    }
}

function swapItemsAnimation (item, topBlankItem, bottomBlankItem, neighbourItem, animationType) {

    if (animationType === "top") {
        return new Promise(function(resolve, reject) {
            itemsContainer.replaceChild(topBlankItem, neighbourItem)
            item.insertAdjacentElement("afterend",bottomBlankItem);

            let currentBottomBlankItemHeight = 0
            let currentTopBlankItemHeight = 40
            let heightChange = 0

            const interval = setInterval(() => {
                heightChange = heightChange + 1.5

                const newBottomBlankItemHeight = currentBottomBlankItemHeight + heightChange
                const newTopBlankItemHeight = currentTopBlankItemHeight - heightChange

                if ((newBottomBlankItemHeight >= 40) && (newTopBlankItemHeight <= 0)) {
                    topBlankItem.style.height = 0 + "px"
                    bottomBlankItem.style.height = 40 + "px"
                    clearInterval(interval)
                    resolve()
                }

                topBlankItem.style.height = newTopBlankItemHeight + "px"
                bottomBlankItem.style.height = newBottomBlankItemHeight + "px"

            }, 10)
        })
    }

    else if (animationType === "bottom") {

        return new Promise(function(resolve, reject) {
            itemsContainer.replaceChild(bottomBlankItem, neighbourItem)
            item.insertAdjacentElement("beforebegin",topBlankItem);

            let currentBottomBlankItemHeight = 40
            let currentTopBlankItemHeight = 0
            let heightChange = 0

            const interval = setInterval(() => {
                heightChange = heightChange + 1.5

                const newBottomBlankItemHeight = currentBottomBlankItemHeight - heightChange
                const newTopBlankItemHeight = currentTopBlankItemHeight + heightChange

                if (newBottomBlankItemHeight <= 0 && newTopBlankItemHeight >= 40) {
                    topBlankItem.style.height = 40 + "px"
                    bottomBlankItem.style.height = 0 + "px"
                    clearInterval(interval)
                    resolve()
                }

                topBlankItem.style.height = newTopBlankItemHeight + "px"
                bottomBlankItem.style.height = newBottomBlankItemHeight + "px"

            }, 10)
        })

    }
       
}


function addItem(counter) {
    const item = document.createElement("div")
    item.classList.add("list-itemsContainer-item")
    item.id = counter;
    data[counter] = [initialtext.value, initialnumb.value]
    let currentData = data[counter]

    const itemInnerHtml =  `<div class="list-itemsContainer-item-text">
                                ${currentData[0]}
                            </div>
                            <div class="list-itemsContainer-item-numbers">
                                ${currentData[1]}
                            </div>
                            <a href="#" style="text-decoration:none; align-items: center;" class="list-itemsContainer-item-button" move-top-btn-id="${counter}"> ↑</a>
                            <a href="#" style="text-decoration:none; align-items: center;" class="list-itemsContainer-item-button" move-bottom-btn-id="${counter}"> ↓</a>
                            <a href="#" style="text-decoration:none; align-items: center;" class="list-itemsContainer-item-button" delete-btn-id="${counter}"> x</a>`
                            
    
    item.innerHTML = item.innerHTML + itemInnerHtml;
    itemsContainer.appendChild(item)

    itemOpacityAnimation(item, "grow") //анимация появления элемента

    const moveTopBtn = document.querySelector('[move-top-btn-id="' + counter + '"]')
    const moveBottomBtn = document.querySelector('[move-bottom-btn-id="' + counter + '"]')
    const deleteBtn = document.querySelector('[delete-btn-id="' + counter + '"]')

    moveTopBtn.addEventListener("click", () => {
        if (itemsContainer.querySelectorAll(".list-itemsContainer-item").length > 1) {
            swapItems(item, "top")
        }
    })

    moveBottomBtn.addEventListener("click", () => {
        if (itemsContainer.querySelectorAll(".list-itemsContainer-item").length > 1) {
            swapItems(item, "bottom")
        }
    })

    deleteBtn.addEventListener("click", () => {

        itemOpacityAnimation(item, "reduction").then(function() { //анимация исчезновения элемента
            const blankItem = document.createElement("div")
            blankItem.classList.add("list-itemsContainer-item-blankItem")
            itemsContainer.replaceChild(blankItem, item)
    
            listHeightAnimation("reduction").then( function() { // анимация уменьшения листа
                itemsContainer.removeChild(blankItem)
                itemsListEmptynessCheck()
            })
        })
    })
}



let counter = 0;
addItemBtn.addEventListener("click", () => {

    if (counter <= 10) { //ограничение на кол-во элементов

        listHeightAnimation("grow").then( function() {
            addItem(counter)
            counter++
        })
    } 
    
})

saveBtn.addEventListener("click", () => {
    $(".jsonOutputContainer-jsonOutput").fadeOut(200)
    setTimeout(() => {
        let dataSet = { }
    
        const items = Array.from(itemsContainer.children)
        items.forEach(item => {
            const itemText = item.querySelector(".list-itemsContainer-item-text").textContent.trim()
            const itemNumbers = item.querySelector(".list-itemsContainer-item-numbers").textContent.trim()
            dataSet[itemText] = itemNumbers
        });

        const jsonDataSet = JSON.stringify(dataSet, null, 4)

        const jsonOutput = document.querySelector(".jsonOutputContainer-jsonOutput")
        jsonOutput.textContent = jsonDataSet //вывод сохраненных элементов

        $(".jsonOutputContainer-jsonOutput").fadeIn(200)
    }, 200)

})