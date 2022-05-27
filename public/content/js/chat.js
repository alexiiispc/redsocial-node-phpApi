const mensaje = document.getElementById("message-area");
const btnSend = document.getElementById("send-message");
const chatBox = document.getElementById("chat-box");


localStorage.removeItem("token_to_movil")
localStorage.removeItem("token_to");


function enterkey() {
    keyenter = event.keyCode;
    if(keyenter == 13){
      btnSend.click();
      scrollToBottom()
    }
    
  }
  window.onkeydown = enterkey;

  
function scrollToBottom(){
    chatBox.scrollTop = chatBox.scrollHeight;
  }
