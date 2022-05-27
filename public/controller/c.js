


// chat pc
const chat_wrap = document.querySelector(".chat-wrap");
const msg_prev = document.querySelector(".prev-message");
const chat_box = document.getElementById("chat-box");

window.onload = getChatUser();


function getChatUser() {
  
  $.ajax({
    url: API_URL + "/controller/user/user_get_chat.php",
    method: "POST",
    data: {
      token_from: localStorage.getItem("token_to_movil"),
      token_to: sessionStorage.getItem("user_token"),
    },
    success: function (data) {
      
      //console.log(data);
      
      

      chat_box.innerHTML = data;
      scrollToBottom();
      setTimeout(() => {
        msg = document.querySelector(".msg-x");
        msg.style.display = "none";
      }, 2000);
      $.ajax({
        url: API_URL + "/controller/user/get_profile_chat.php",
        method: "POST",
        data: {
          token_to: localStorage.getItem("token_to_movil"),
        },
        success: function (data) {
          img_chat = document.getElementById("img-chat")
          img_chat.src = data;
          
          
        },
      });

      $.ajax({
        url: API_URL + "/controller/user/user_chat_data.php",
        method: "POST",
        data: {
          token_to: localStorage.getItem("token_to_movil"),
        },
        success: function (data) {
          user_to = JSON.parse(data);
          nombreTo = document.getElementById("nombre-to-name");
          nombreTo.innerHTML = user_to["nombre"] + " " + user_to["apellido"];
        },
      });
    },
  });
}

//socket chat


  socket.on("chat:user", (data) => {
    if (data.token_to == sessionStorage.getItem("user_token") && data.type=="text") {
      if (localStorage.getItem("token_to_movil") != null) {
        chat_box.innerHTML += `
          
          <div class="chat to-message">
          <img src="${data.imgProfile}" alt="img.png" class="img-perfil-user">
          <div class="detalles">
              <p>${data.message}</p>
          </div>
      </div>
          
          `;
        scrollToBottom();
      }else if(localStorage.getItem("token_to_movil") == null){
        document.getElementById("new-msg").innerHTML = "Nuevo mensaje de <b>" + data.name_from  +"</b>"
        $(".alert-message").css("top", "50px");
  
  
          setTimeout(() => {
              $(".alert-message").css("top", "-110%");
          }, 4000);
      }
    }
  });
  socket.on("chat:sticker", (data) => {
    if (data.token_to == sessionStorage.getItem("user_token") && data.type=="sticker") {
      if (localStorage.getItem("token_to_movil") != null) {
        chat_box.innerHTML += `
          
          <div class="chat to-message">
          <img src="${data.imgProfile}" alt="img.png" class="img-perfil-user">
          <div class="detalles">
              <p><img src="${data.sticker}" alt="img.png" class="img-sticker-chat"></p>
          </div>
      </div>
          
          `;
        scrollToBottom();
      }else if(localStorage.getItem("token_to_movil") == null){
        document.getElementById("new-msg").innerHTML = "Nuevo mensaje de <b>" + data.name_from  +"</b>"
        setTimeout(() => {
          $(".alert-message").css("top", "50px");
  
          setTimeout(() => {
            $(".alert-message").css("top", "-110%");
        }, 4000);
        }, 100);
      }
    }
  });




// send message

function sendMessage(token_from, token_to, message) {
  $.ajax({
    url: API_URL + "/controller/user/user_send_message.php",
    method: "POST",
    data: {
      token_from: token_from,
      token_to: token_to,
      message: message,
    },
    success: function (data) {
      //console.log(data);
      if (data == "complete") {
        mensaje.focus();
      } else {
        dataChat = {
          token_from: sessionStorage.getItem("user_token"),
          name_from: sessionStorage.getItem("user_name") + " " + sessionStorage.getItem("user_lastname"),
          token_to: localStorage.getItem("token_to"),
          imgProfile: sessionStorage.getItem("user_profile"),
          message: mensaje.value,
          type: "text"
        };
        socket.emit("chat:user", dataChat);
        chatBox.innerHTML += `
        <div class="chat from-message">
        <div class="detalles" >

            <p>${mensaje.value}</p>


        </div>
      </div>
        `;
        scrollToBottom();
        mensaje.value = "";
        mensaje.focus();
        scrollToBottom();
      }
    },
  });
}

btnSend.addEventListener("click", () => {
  if (mensaje.value == "") {
    mensaje.focus();
  } else {
    sendMessage(
      sessionStorage.getItem("user_token"),
      localStorage.getItem("token_to"),
      mensaje.value
    );
  }
  scrollToBottom();
});
