const btnPerfil = document.querySelector(".boton-avatar");
const file_perfil = document.querySelector("#file-perfil");
const file_portada = document.querySelector("#file-portada");
const imgPerfil = document.getElementById("imgperfil");
const btnSaved = document.getElementById("btnSaved");
const btnPortada = document.getElementById("boton-portada");
const btnSavedPortada = document.getElementById("btnSavedPortada");
const user_name = document.getElementById("user-name");

const imgPortada = document.getElementById("img-portada");

const logout = document.querySelector(".btn-logout");


window.onload = getMyPost(sessionStorage.getItem("user_token"))

// IMAGENES PERFIL Y PORTADA
window.onload = getImageUser(sessionStorage.getItem("user_token"));
function getImageUser(token) {
  user_name.innerHTML =
    sessionStorage.getItem("user_name") +
    " " +
    sessionStorage.getItem("user_lastname");
  $.ajax({
    url: API_URL + "/controller/user/user_image_profile.php",
    method: "POST",
    data: { type: "profile", post_token: token },
    success: function (data) {
      sessionStorage.setItem("user_profile", data);
    },
  });
  setTimeout(() => {
    $.ajax({
      url: API_URL + "/controller/user/user_image_profile.php",
      method: "POST",
      data: { type: "portada", post_token: token },
      success: function (data) {
        sessionStorage.setItem("user_portada", data);
      },
    });
  }, 50);
}
setTimeout(() => {
  // ASIGNAR IMAGENES HOME

  imgPortada.src = sessionStorage.getItem("user_portada");
  imgPerfil.src = sessionStorage.getItem("user_profile");
}, 100);

btnPerfil.addEventListener("click", () => {
  file_perfil.click();
});
btnPortada.addEventListener("click", () => {
  file_portada.click();
});

function preview(event) {
  imgPerfil.src = URL.createObjectURL(event.target.files[0]);
  imgPerfil.onload = function () {
    URL.revokeObjectURL(imgPerfil.src);
    btnSaved.style.display = "block";
  };
}
function previewPortada(event) {
  imgPortada.src = URL.createObjectURL(event.target.files[0]);
  imgPortada.onload = function () {
    URL.revokeObjectURL(imgPortada.src);
    btnSavedPortada.style.display = "block";
  };
}
// GUARDAR FOTO PORTADA

btnSavedPortada.addEventListener("click", () => {
  const formularioportada = document.getElementById("form-img-portada");

  $.ajax({
    type: "POST",
    url:
      API_URL +
      "/controller/user/user_portada.php?token=" +
      sessionStorage.getItem("user_token"),
    data: new FormData(formularioportada),
    contentType: false,
    cache: false,
    processData: false,
    success: function (data) {
      console.log(data);
      if (data == "success") {
        btnSavedPortada.style.display = "none";
      } else if (data == "error") {
        alert("error");
        console.log(data);
      }
    },
  });
});

// GUARDAR FOTO DE PERFIL

btnSaved.addEventListener("click", () => {
  const formulario = document.getElementById("form-img");

  $.ajax({
    type: "POST",
    url:
      API_URL +
      "/controller/user/user_profile.php?token=" +
      sessionStorage.getItem("user_token"),
    data: new FormData(formulario),
    contentType: false,
    cache: false,
    processData: false,
    success: function (data) {
      console.log(data);
      if (data == "success") {
        btnSaved.style.display = "none";
      } else if (data == "error") {
        alert("error");
        console.log(data);
      }
    },
  });
});

function getMyPost(token_user) {
  $.ajax({
    url: API_URL + "/controller/user/get_user_post.php",
    method: "POST",
    data: { token_user: token_user },
    success: function (data) {
      var postAll = document.getElementById("postAll");
      postAll.innerHTML = data;
    },
  });
}

logout.addEventListener("click", () => {
  sessionStorage.removeItem("user_token");
  sessionStorage.removeItem("user_name");
  sessionStorage.removeItem("user_lastname");
  sessionStorage.removeItem("user_email");
  location.href = "/auth";
});

// like

function likePost(token_post) {
  btnlike = "#btn-like-post" + token_post;
  if ($(btnlike + " i").attr("class") == "bi bi-hand-thumbs-up-fill") {
    $.ajax({
      url: API_URL + "/controller/user/user_like_post.php",
      method: "POST",
      data: {
        token_user: sessionStorage.getItem("user_token"),
        token_post: token_post,
        type: "dislike",
      },
      success: function (data) {
        if (data >= 0) {
          $(btnlike + " i").removeClass("bi bi-hand-thumbs-up-fill");
          $(btnlike + " i").addClass("bi bi-hand-thumbs-up");
          var likes = document.getElementById("likes-post" + token_post);
          likes.innerHTML = data;
          like = {
            success: true
          }
          socket.emit("user:like", {like})
        } else if (data == "error") {
          console.log(data);
        }
      },
    });
  } else {
    $.ajax({
      url: API_URL + "/controller/user/user_like_post.php",
      method: "POST",
      data: {
        token_user: sessionStorage.getItem("user_token"),
        token_post: token_post,
        type: "like",
      },
      success: function (data) {
        if (data >= 0) {
          $(btnlike + " i").removeClass("bi bi-hand-thumbs-up");
          $(btnlike + " i").addClass("bi bi-hand-thumbs-up-fill");
          var likes = document.getElementById("likes-post" + token_post);
          likes.innerHTML = data;
        } else if (data == "error") {
          console.log(data);
        }
      },
    });
  }
}

