
var config = {
    type: Phaser.AUTO,
    borderPadding: 10,
    parent: "content",
    width: 800,
    height: 600,
    zoom: 1,
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 0,
        },
        debug: false,
      },
    },
    scene: [initialiseAssets, titleScene, gameScene, UiScene, quest1Ui, quest2Ui, quest3Ui, quest4Ui, quest5Ui, quest1Info, quest2Info, quest3Info,quest4Info, quest5Info, interactNotification, completedNotification, failedQuest, completeGame, priestScene, mountainGuide],
  };

  
  var questStatus = {1:true};
  var numberCompleted;
  var timerDelay = 0;
  var game = new Phaser.Game(config);
  
  
  
  //All code below handles the ingame chat
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");
  
  window.addEventListener("keydown", (event) => {
    if (event.which === 13) {
      sendMessage();
    }
    if (event.which === 32) {
      if (document.activeElement === input) {
        input.value = input.value + " ";
      }
    
    }

    if (event.which === 69) {
      if (document.activeElement === input) {
        input.value = input.value + "e";
      }
    
    }
  });
  
  function sendMessage() {
    let message = input.value;
    if (message) {
      input.value = "";
      $.ajax({
        type: "POST",
        url: "/submitChat",
        data: {
          message,
          refreshToken: getCookie("refreshJwt"),
        },
        success: function (data) {},
        error: function (xhr) {
          console.log(xhr);
        },
      });
    }
  }
  
  function addMessageElement(el) {
    messages.append(el);
    messages.lastChild.scrollIntoView();
  }

  function completedQuest(questNumber) {
  
    $.ajax({
      type: "POST",
      url: "/completedQuest",
      data: {
        quest: questNumber,
        refreshToken: getCookie("refreshJwt"),
      },
      success: function (data) {},
      error: function (xhr) {
        console.log(xhr);
      },
    });
  }

function test1(a, b){
    numberCompleted = b
    questStatus = a
    console.log(questStatus)
    console.log(numberCompleted)
}

  


function checkQuest() {
  console.log("hello12")
  
  $.ajax({
    
     type: "GET",
     url: "/questQuery",
     async: true,
     data: {
       refreshToken: getCookie("refreshJwt"),
     },
     success: function (data) {
       test1(data.result, data.number)
       console.log("checkQuest")

      
       
     },
     error: function (xhr) {
       console.log(xhr);
       
     },
    
   });

  

 }


  

  