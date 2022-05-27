
const btn_post = document.getElementById("btn-public");
const post_content = document.getElementById("post_content");

window.onload = getPostAll();
/*function enterkey() {
  keyenter = event.keyCode;
  if (keyenter == 13) {
    btn_post.click();
  }
}
window.onkeydown = enterkey;*/

btn_post.addEventListener("click", () => {
  if (post_content.value == "") {
    post_content.focus();
  } else {
    $.ajax({
      url: API_URL + "/controller/user/user_post.php",
      method: "POST",
      data: new FormData(post_data),
      contentType: false,
      cache: false,
      processData: false,
      success: function (data) {
        if (data == "success") {
          console.log(data);
          post_content.value = "";
          // MOSTRAR POST A LOS USUARIOS CONECTADOS
          setTimeout(() => {
            data = {
              success: "true",
            };
            socket.emit("post:users", { data });
          }, 1000);
          setTimeout(() => {
            $(".alert-success").css("right", "0");

            setTimeout(() => {
              $(".alert-success").css("right", "-160px");
            }, 3000);
          }, 800);
          closeArchivo();
        } else if (data == "error") {
          console.log(data);
        }
      },
    });
  }
});

function getPostAll() {
  $.ajax({
    url: API_URL + "/controller/user/get_post.php",
    method: "POST",
    data: { token_user: sessionStorage.getItem("user_token") },
    success: function (data) {
      var postAll = document.getElementById("postAll");
      postAll.innerHTML = data;
    },
  });
}

// select image

const btn_select_image = document.getElementById("btn-select-image");
const btn_select_video = document.getElementById("btn-select-video");
const post_data_image = document.getElementById("post_data_image");
const post_data_video = document.getElementById("post_data_video");

const post_data = document.getElementById("post_data");
const name_archivo = document.getElementById("name-archivo");
const btn_closearchivo = document.getElementById("btn-close-archive");

function closeArchivo() {
  textprev = post_content.value;

  name_archivo.style.display = "none";

  var resetfrm = document.getElementById("reset_form");
  resetfrm.click();
  btn_select_image.style.display = "flex";
  btn_select_video.style.display = "flex";
  name_archivo.innerHTML = "";
  post_content.value = textprev;
  token_user_post.value = sessionStorage.getItem("user_token");
}

btn_select_image.addEventListener("click", () => {
  btn_select_video.style.display = "none";
  post_data_image.click();
});

function getImageData() {
  name_archivo.innerHTML = "";
  name_archivo.style.display = "flex";
  name_archivo.innerHTML +=
    '<p id="name-archivo">' +
    document.getElementById("post_data_image").files[0].name +
    "</p>";
  name_archivo.innerHTML +=
    '<button id="btn-close-archive" onclick="closeArchivo()"><i class="bi bi-x-lg"></i></button>';
}

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

// respuesta de servidor de post

socket.on("post:users", (data) => {
  getPostAll();
});

