/*VERIFICAR SESSIONES ABIERTAS*/
if(sessionStorage.getItem("user_token") != null){
    location.href = "/";
}
/* DISPLAY FORM LOGIN AND REGISTER */

const eRegistro = document.getElementById("eRegistro");
const eLogin = document.getElementById("eLogin");

eRegistro.addEventListener("click", ()=>{
    document.querySelector(".form-register").style.display = "flex";
    document.querySelector(".form-login").style.display = "none";
})

eLogin.addEventListener("click", ()=>{
    document.querySelector(".form-register").style.display = "none";
    document.querySelector(".form-login").style.display = "flex";
})

