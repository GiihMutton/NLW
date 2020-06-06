
function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( (res) => {return res.json() }) //forma reduzida: .then( res => res.json())
    .then( states => {

        for( const state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
        
    } )
}

populateUFs() //executando

function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text //encontrar o estado pelo número e aparecer o nome dele na backend

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value=>Selecione a Cidade</option>" //limpará o campo das cidades quando mudar o estado
    citySelect.disabled = true //vai bloquear o campo cidade pra seleção de estado acontecer antes

    fetch(url)
    .then( res => res.json())
    .then( cities => {

        for( const city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    })
}


// encontrar o seletor de estados
document
    .querySelector("select[name=uf]") //ouvidor de eventos
    .addEventListener("change", getCities)
            
//ITENS DE COLETA
//pegar todod os li's
const itemsToCollect = document.querySelectorAll(".items-grid li")
for(const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem) //vai ouvir o evento click

}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = [] //lembrando que let é uma variável, então posso alterar o valor quando necessário

function handleSelectedItem(event) {
    const itemLi = event.target

    //adicionar ou remover uma classe com js
    itemLi.classList.toggle("selected") //toggle vai add ou remover a classe conforme o que estiver ativo
    
    const itemId = itemLi.dataset.id
    //verificando se o ítem foi selecionado e se sim, guardar valor
    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId //true or false
        return itemFound
    })
    //se o item já estiver selecionado, deselecionar
    if(alreadySelected >= 0) {
        const filteredItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })
        
        selectedItems = filteredItems
    } else { //se NÃO estiver selecionado, selecionar
        selectedItems.push(itemId)
    }
    collectedItems.value = selectedItems
    //atualizar o campo hideen com os itens que forem selecionados
}