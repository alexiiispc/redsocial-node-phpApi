const emailLogin = document.querySelector(".txtEmailLogin");
const passwordLogin = document.querySelector(".txtPasswordLogin");
const btnLogin = document.getElementById("btnLogin");

function enterkey() {
  keyenter = event.keyCode;
  if (keyenter == 13) {
    btnLogin.click();
  }
}
window.onkeydown = enterkey;

btnLogin.addEventListener("click", () => {
  if (emailLogin.value == "" || passwordLogin.value == "") {
    document.querySelector(".alertLogin").style.display = "block";

    setTimeout(() => {
      document.querySelector(".alertLogin").style.display = "none";
    }, 3000);
  } else {
    $.ajax({
      url: API_URL + "/controller/user/user_login.php",
      method: "POST",
      data: {
        post_email: emailLogin.value,
        post_password: passwordLogin.value,
      },
      success: function (data) {
        if (data == "success") {
          sessionStorage.setItem("user_email", emailLogin.value);
          document.querySelector(".preloader").style.display = "block";
          btnLogin.style.display = "none";

          getUser(emailLogin.value);
        } else if (data == "error") {
          var alertLogin = document.querySelector(".alertLogin");
          alertLogin.style.display = "block";
          alertLogin.innerHTML = "Usuario no encontrado";
          setTimeout(() => {
            alertLogin.style.display = "none";
          }, 3000);
        }
      },
    });
  }
});

const nombreRegister = document.querySelector(".txtNombreRegister");
const apellidoRegister = document.querySelector(".txtApellidoRegister");
const emailRegister = document.querySelector(".txtEmailRegister");
const passwordRegister = document.querySelector(".txtContraRegister");

const btnRegister = document.getElementById("btnRegister");

btnRegister.addEventListener("click", () => {
  if (
    nombreRegister.value == "" ||
    apellidoRegister.value == "" ||
    emailRegister.value == "" ||
    passwordRegister.value == ""
  ) {
    document.querySelector(".alertRegister").style.display = "block";

    setTimeout(() => {
      document.querySelector(".alertRegister").style.display = "none";
    }, 1000);
  } else {
    $.ajax({
      url: API_URL + "/controller/user/user_register.php",
      method: "POST",
      data: {
        post_nombre: nombreRegister.value,
        post_apellido: apellidoRegister.value,
        post_email: emailRegister.value,
        post_password: passwordRegister.value,
      },
      success: function (data) {
        if (data == "success") {
          var alertRegister = document.querySelector(".alertRegister");
          alertRegister.style.display = "block";
          alertRegister.innerHTML = "Registro Correcto";
        } else if (data == "error") {
          var alertRegister = document.querySelector(".alertRegister");
          alertRegister.style.display = "block";
          alertRegister.innerHTML = "Usuario no encontrado";
          setTimeout(() => {
            alertRegister.style.display = "none";
          }, 3000);
        } else if (data == "existe") {
          var alertRegister = document.querySelector(".alertRegister");
          alertRegister.style.display = "block";
          alertRegister.innerHTML = "Correo registrado";
          setTimeout(() => {
            alertRegister.style.display = "none";
          }, 3000);
        }
      },
    });
  }
});

function getUser(email) {
  $.ajax({
    url: API_URL + "/controller/user/user_getdata.php",
    method: "POST",
    data: { post_email: email },
    success: function (data) {
      var user = JSON.parse(data);
      sessionStorage.setItem("user_token", user.token);
      sessionStorage.setItem("user_name", user.nombre);
      sessionStorage.setItem("user_lastname", user.apellido);
      sessionStorage.setItem("user_email", user.email);

      sessionStorage.setItem(
        "user_portada",
        "https://tuwebcreativa.com/wp-content/plugins/accelerated-mobile-pages/images/SD-default-image.png"
      );

      setTimeout(() => {
        location.href = "/";
      }, 2000);
    },
  });
}
