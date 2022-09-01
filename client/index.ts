function main (){
    const buttonEl = document.querySelector(".button")
    const rootEl = document.querySelector(".root")

    buttonEl.addEventListener('click', ()=>{
        rootEl.innerHTML= "Funcionando"
    })
}
main()