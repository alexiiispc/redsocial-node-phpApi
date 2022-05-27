const active_overlay_s = document.querySelector(".btn-stycker");
const overlay_sticker = document.querySelector(".overlay-stickers");
const file_sticker = document.getElementById("file-sticker");
const save_sticker = document.getElementById("save-sticker");
const img_sticker = document.getElementById("select-img-create");

// peticion de mis styckers


active_overlay_s.addEventListener("click", () => {
  overlay_sticker.style.display = "flex";
  token_user = sessionStorage.getItem("user_token")
  setTimeout(()=>{
    
    getMyStycker(token_user)
  }, 300)
  
});


// click en file sticker
function selectStickerBtn() {
  file_sticker.click();
}

// mostrar preview imagen 
function selectSticker(event) {
  img_sticker.src = URL.createObjectURL(event.target.files[0]);
  img_sticker.onload = function () {
    URL.revokeObjectURL(img_sticker.src);
    save_sticker.style.display = "block";
  };
}

// cerrar overlay 
document
  .getElementById("close-overlay-sticker")
  .addEventListener("click", () => {
    $(".overlay-stickers").css("display", "none");
    img_sticker.src = "../content/images/plus.jpg";
   
   
    setTimeout(() => {
      save_sticker.style.display = "none";
    }, 500);
  });


// peticion stycker
function getMyStycker(token_user) {
  $.ajax({
    url: API_URL + "/controller/user/get_stickers_user.php",
    method: "POST",
    data: { token_user: token_user },
    success: function (data) {
      if (data != "empty") {
        var stycker_box = document.querySelector(".styckers");
        stycker_box.innerHTML ="";
        stycker_box.innerHTML += data;
        img_sticker.src = "../content/images/plus.jpg";
   
   
    setTimeout(() => {
      save_sticker.style.display = "none";
    }, 100);
      }
    },
  });
}

// peticion guaradr sticker 

const frmSticker = document.getElementById("frmSticker");

save_sticker.addEventListener("click", () => {
  $.ajax({
    url:
      API_URL +
      "/controller/user/user_sticker.php?token_user=" +
      sessionStorage.getItem("user_token"),
    method: "POST",
    data: new FormData(frmSticker),
    contentType: false,
    cache: false,
    processData: false,
    success: function (data) {
      if (data == "success") {
        getMyStycker(sessionStorage.getItem("user_token"));
      } else {
        console.log(data);
      }
    },
  });
});

// envio de mensaje chat 
function sendSticker(image) {
  chat_box.innerHTML += `
        
  <div class="chat from-message">
        <div class="detalles" >

        <p>
        <img src="${image.src}" alt="img.png" class="img-sticker-chat">
        </p>

        </div>
      </div>
        
 
        
        
        `;
  dataChat = {
    token_from: sessionStorage.getItem("user_token"),
    name_from: sessionStorage.getItem("user_name") + " " + sessionStorage.getItem("user_lastname"),
    token_to: localStorage.getItem("token_to"),
    imgProfile: sessionStorage.getItem("user_profile"),
    sticker: image.src,
    type: "sticker",
  };
  socket.emit("chat:sticker", dataChat);
  stickerSend = "<img src='" + image.src + "' class='img-sticker-chat' />"
  sendMessageSticker(sessionStorage.getItem("user_token"), localStorage.getItem("token_to"), stickerSend)
  $(".overlay-stickers").css("display", "none");
  scrollToBottom();
}

function sendMessageSticker(token_from, token_to, sticker) {
  $.ajax({
    url: API_URL + "/controller/user/user_send_message.php",
    method: "POST",
    data: {
      token_from: token_from,
      token_to: token_to,
      message: sticker,
    },
    success: function (data) {
      //console.log(data);
      if (data == "complete") {
        mensaje.focus();
        scrollToBottom();
      } else {
        
       
        
        scrollToBottom();
        
      }
    },
  });
}
// respuesta sticker
socket.on("chat:user", (data) => {
  if (data.token_to == sessionStorage.getItem("user_token") && data.type=="sticker") {
    if (localStorage.getItem("token_to") != null) {
      chat_box.innerHTML += `
        
        
        
        <div class="chat to-message">
        <img src="${data.imgProfile}" alt="img.png" class="img-perfil-user">
        <div class="detalles">

        <p>
          <img src="${data.sticker}" alt="img.png" class="img-sticker-chat">
          </p>
        </div>
    </div>
        
        
        `;
      scrollToBottom();
    }
  }
});