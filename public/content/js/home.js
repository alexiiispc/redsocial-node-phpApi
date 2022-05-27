// VERIFICAR SESSIÓN ACTIVA
if (sessionStorage.getItem("user_token") == null) {
  location.href = "/auth";
}

const imgPortadaHome = document.getElementById("img-portada-home");
const imgPerfilHome = document.getElementById("img-perfil-home");
const imgPerfilPublic = document.getElementById("img-perfil-public");

localStorage.removeItem("token_to_movil")
localStorage.removeItem("token_to");
// IMAGENES PERFIL Y PORTADA
window.onload = getImageUser(sessionStorage.getItem("user_token"));
function getImageUser(token) {
  $.ajax({
    url: API_URL + "/controller/user/user_image_profile.php",
    method: "POST",
    data: { type: "profile", post_token: token },
    success: function (data) {
      sessionStorage.setItem("user_profile", data);
    },
  });
  setTimeout(()=>{
    $.ajax({
      url: API_URL + "/controller/user/user_image_profile.php",
      method: "POST",
      data: { type: "portada", post_token: token },
      success: function (data) {
        sessionStorage.setItem("user_portada", data);
      },
    });
  }, 50)
}
setTimeout(() => {
  // ASIGNAR IMAGENES HOME

  imgPortadaHome.src = sessionStorage.getItem("user_portada");
  imgPerfilHome.src = sessionStorage.getItem("user_profile");
  imgPerfilPublic.src = sessionStorage.getItem("user_profile");
}, 500);

// ASIGNAR NOMBRE + USUARIO
const nombreUser = document.querySelector(".name-cuenta-left");
const usernameUser = document.querySelector(".username-cuenta-left");
const token_user_post = document.getElementById("token_user_post");

nombreUser.innerHTML =
  sessionStorage.getItem("user_name") +
  " " +
  sessionStorage.getItem("user_lastname");
usernameUser.innerHTML = "@" + sessionStorage.getItem("user_token");
token_user_post.value = sessionStorage.getItem("user_token");
