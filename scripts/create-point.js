
function populateUFs() {
    const ufselect = document.querySelector("select[name=uf")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( (res) => {return res.json() }) //forma reduzida: .then( res => res.json())
    .then( states => {

        for( const state of states ) {
            ufselect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
        
    } )
}

populateUFs() //executando

function getcities(event) {
    const cityselect = document.querySelector("select[name=city]")
    const stateinput = document.querySelector("input[name=state]")

    const ufvalue = event.target.value

    const indexofselectedstate = event.target.selectedindex
    stateinput.value = event.target.options[indexofselectedstate] //encontrar o estado pelo número e aparecer o nome dele na backend

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufvalue}/municipios`

    fetch(url)
    .then( res => res.json())
    .then( cities => {

        for( const city of cities ) {
            cityselect.innerHTML += `<option value="${city.id}">${city.nome}</option>`
        }

        cityselect.disabled = false
    })
}


// encontrar o seletor de estados
document.querySelector("select[name=uf")
        .addEventListener("change", getcities)
            