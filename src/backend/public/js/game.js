class initialiseAssets extends Phaser.Scene {
    constructor() {
        super({
          key: "initialiseAssets",
          active: true,
        });
    }
    
    
    preload() {
      this.loadSprites();
      this.loadTileMap();
      this.loadImages();
    }
    
    loadSprites() {
      this.load.spritesheet("player", "assets/sprites/yoda.png", {frameWidth: 32,frameHeight: 48,});
      this.load.spritesheet("darthvader", "assets/sprites/darthvader.png", {frameWidth: 32,frameHeight: 48,});
    }

    loadTileMap(){
      this.load.tilemapTiledJSON("map", "assets/world/world.json");
    }

    loadImages(){
      //Load UI element
      this.load.image("button1", "assets/images/button1.png");
      this.load.image("button2", "assets/images/button2.png");
      //Load tilesets and objects for map
      this.load.image("tiles", "assets/world/tileset.png");
      this.load.image("watertiles", "assets/world/water.png");
      this.load.image("coin", "assets/world/coins.png");
    }

    create() {
    this.scene.start("Title");
    }
 }

 class TitleScene extends Phaser.Scene {
  constructor(){
      super('Title');
  }

  create() {
    this.titleText = this.add.text(this.scale.width/2, this.scale.height/2 * 0.7, 'Explore MMO', { fontSize: '64px', fill: '#fff' });
    this.titleText.setOrigin(0.5);
    this.titleButton = new UiButton(this, this.scale.width/2, this.scale.height/2*1.4, 'button1', 'button2', 'Start', this.startScene.bind(this, 'mapScene'));
  }
  startScene(targetScene){
    this.scene.start(targetScene);
  }
}

class UiButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, hoverKey, text, targetCallback){
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.key = key;
    this.hoverKey = hoverKey;
    this.text = text;
    this.targetCallback = targetCallback;

    this.createButton(); //Create button
    this.scene.add.existing(this); //Add this container to scene
  }

  createButton() {
      this.button = this.scene.add.image(0, 0, 'button1');
      this.button.setInteractive();

      this.button.setScale(1.4);

      this.buttonText = this.scene.add.text(0, 0, this.text, {fontSize: '26px', fill: '#fff'});
      Phaser.Display.Align.In.Center(this.buttonText, this.button);

      this.add(this.button);
      this.add(this.buttonText);

      this.button.on('pointerout', () => {
        this.button.setTexture(this.key);
      });
  
      this.button.on('pointerover', () => {
        this.button.setTexture(this.hoverKey);
  
      });
  
      this.button.on('pointerdown', () => {
        this.targetCallback();
      });
  };
};

class UiScene extends Phaser.Scene {
  constructor(){
    super ('Ui');
  };

  init(){
    this.gameScene = this.scene.get('mapScene');
  }

  create() {
    console.log("test");
    this.setupUiElements();
    this.setupEvents();
  };

  setupUiElements () {
     //create the score text game object
     this.scoreText = this.add.text(35, 8, 'Coins: 10', { fontSize: '24px', fill: '#fff' });
     this.timeText = this.add.text(35, 50, 'Time left: ', { fontSize: '24px', fill: '#fff' });
  };

  setupEvents(){
    this.gameScene.events.on('updateScore', (score) => {
      this.scoreText.setText(`Coins: ${score}`);
    })
  };
};



class mapScene extends Phaser.Scene {
      
  constructor() {
    super({
      key: "mapScene",
    });
  }

  init(){
    this.scene.launch('Ui');
    this.coinsLeft = 10;
  }
    
      create() {
        
        this.socket = io();
        this.otherPlayers = this.physics.add.group();
  
        //Intialises map to user
        this.map = this.make.tilemap({
          key: "map",
        });

        

        alert("Quest: work with your companion and find the 10 sets of coins scattered aro  nd the map!")
        var watertiles = this.map.addTilesetImage("water", "watertiles");
        var tiles = this.map.addTilesetImage("tileset", "tiles");
        
    
        var ground = this.map.createStaticLayer("ground", tiles, 0, 0);
        var ground2 = this.map.createStaticLayer("ground2", tiles, 0, 0);
        var water = this.map.createStaticLayer("water", watertiles, 0, 0);
        var ladders = this.map.createStaticLayer("ladders", tiles, 0, 0);
        var building = this.map.createStaticLayer("building", tiles, 0, 0);
        var buildingaddon = this.map.createStaticLayer("buildingaddon", tiles, 0, 0);
        var trees = this.map.createStaticLayer("trees", tiles, 0, 0);
        var coinsLayer = this.map.getObjectLayer('coinsLayer')['objects'];

        var coins = this.physics.add.staticGroup()
        //this is how we actually render our coin object with coin asset we loaded into our game in the preload function
      coinsLayer.forEach(object => {
        let obj = coins.create(object.x, object.y, "coin"); 
        obj.setOrigin(0);
        obj.body.width = object.width; 
        obj.body.height = object.height; 
      });
      
        water.setCollisionByExclusion([-1]);
        trees.setCollisionByExclusion([-1]);
        building.setCollisionByExclusion([-1]);
      
    
        //Teleport from Entrance #1 to Cave #1
        building.setTileLocationCallback(104, 37, 1, 1, () => {
          this.container.setPosition(6176, 1760);
        });
    
        //Teleport from Cave #1 to Entrance #1
        building.setTileLocationCallback(183, 28, 1, 1, () => {
          this.container.setPosition(4336, 1024);
        });
    
        //Teleport from cave #1 to exit #1
        building.setTileLocationCallback(136, 30, 1, 1, () => {
          this.container.setPosition(5840, 960);
        });
    
        //Teleport from exit #1 to cave #1
        building.setTileLocationCallback(192, 56, 3, 3, () => {
          this.container.setPosition(3328, 1284);
        });
    
        //Teleport into church
        building.setTileLocationCallback(127, 88, 1, 1, () => {
          this.container.setPosition(6688, 4736);
        });
    
        //Teleport out of church
        building.setTileLocationCallback(209, 149, 1, 1, () => {
          this.container.setPosition(4064, 2880);
        });
    
        //Teleport into church basement
        building.setTileLocationCallback(215, 133, 1, 1, () => {
          this.container.setPosition(6624, 3440);
        });
    
        //Teleport out of church basement
        building.setTileLocationCallback(205, 107, 1, 2, () => {
          this.container.setPosition(6848, 4256);
        });
    
        //Teleport into blacksmith
        building.setTileLocationCallback(82, 88, 1, 1, () => {
          this.container.setPosition(5936, 4736);
        });
    
        //Teleport out of blacksmith
        building.setTileLocationCallback(185, 149, 1, 1, () => {
          this.container.setPosition(2640, 2880);
        });

        //Teleport into pub
        building.setTileLocationCallback(67, 88, 1, 1, () => {
          this.container.setPosition(5936, 3904);
        });
    
        //Teleport out of pub
        building.setTileLocationCallback(185, 123, 1, 1, () => {
          this.container.setPosition(2160, 2880);
        });

         //Teleport into pub basement
         building.setTileLocationCallback(189, 114, 1, 1, () => {
          this.container.setPosition(5856, 2976);
        });
    
        //Teleport out of pub basement
        building.setTileLocationCallback(181, 93, 1, 2, () => {
          this.container.setPosition(6016, 3648);
        });
    
        //Handles boundaries of the map
        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;
    
        //Handles player animations when moving
        this.handleAnimations();
    
        //Handles user input from keyboard
        this.cursors = this.input.keyboard.createCursorKeys();

        

        
    
        // listen for web socket events
        this.socket.on(
          "currentPlayers",
          function (players) {
            Object.keys(players).forEach(
              function (id) {
                if (players[id].playerId === this.socket.id) {
                  

                  this.player = this.add.sprite(0, 0, "player", 0);
                 
                  this.container = this.add.container(players[id].x, players[id].y);
                  this.container.setSize(16, 16);
                  this.physics.world.enable(this.container);
                  this.container.add(this.player);
                  this.updateCamera();
                  this.container.body.setCollideWorldBounds(true);
                  this.physics.add.collider(this.container, [
                    trees,
                    water,
                    building,
                  ]);
                  this.physics.add.overlap(this.container, coins, this.collectCoin, null, this);

          
                  
                } else {
                  this.addOtherPlayers(players[id]);
                }
              }.bind(this)
            );
          }.bind(this)
        );
    
        this.socket.on(
          "newPlayer",
          function (info) {
            this.addOtherPlayers(info);
          }.bind(this)
        );
    
        this.socket.on(
          "disconnect",
          function (id) {
            this.otherPlayers.getChildren().forEach(
              function (player) {
                if (player.id === id) {
                  player.destroy();
                }
              }.bind(this)
            );
          }.bind(this)
        );
    
        this.socket.on(
          "playerMoved",
          function (playerInfo) {
            this.otherPlayers.getChildren().forEach(
              function (player) {
                if (playerInfo.playerId === player.playerId) {
                  player.flipX = playerInfo.flipX;
                  player.setPosition(playerInfo.x, playerInfo.y);
                }
              }.bind(this)
            );
          }.bind(this)
        );
    
        this.socket.on("new user message", (data) => {

          var text = this.add.text(0, 0, data.username, { backgroundColor: '	rgb(0, 0, 0)'});text.alpha = 0.5;text.setOrigin(0.5, 2.9);text.setScale(0.7);
          this.container.add(text);
          
          const usernameSpan = document.createElement("span");
          const usernameText = document.createTextNode(data.username);
          usernameSpan.className = "username";
          usernameSpan.appendChild(usernameText);
    
          const messageBodySpan = document.createElement("span");
          const messageBodyText = document.createTextNode(data.message);
          messageBodySpan.className = "messageBody";
          messageBodySpan.appendChild(messageBodyText);
    
          const messageList = document.createElement("li");
          messageList.setAttribute("username", data.username);
    
          messageList.append(usernameSpan);
    
          messageList.append(messageBodySpan);
    
          addMessageElement(messageList);
        });
      }
    
      handleAnimations() {
        this.anims.create({
          key: "left",
          frameRate: 8,
          frames: this.anims.generateFrameNumbers("player", { start: 4, end: 7 }),
        });
    
        this.anims.create({
          key: "right",
          frameRate: 8,
          frames: this.anims.generateFrameNumbers("player", { start: 8, end: 11 }),
        });
    
        this.anims.create({
          key: "up",
          frameRate: 8,
          frames: this.anims.generateFrameNumbers("player", { start: 12, end: 15 }),
        });
    
        this.anims.create({
          key: "down",
          frameRate: 8,
          frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
        });
      }
      
      collectCoin(player, coin) {
        this.coinsLeft -= 1;
        this.events.emit('updateScore', this.coinsLeft)
        coin.destroy(coin.x, coin.y); // remove the tile/coin
       
      }
     
      addOtherPlayers(playerInfo) {
        this.otherPlayer = this.add.sprite(0, 0,"darthvader",0);
       
        var text = this.add.text(0, 0, 'testuser', { backgroundColor: '	rgb(0, 0, 0)'});text.alpha = 0.5;
        text.setOrigin(0.5, 2.9);
        text.setScale(0.7);
        const container = this.add.container(playerInfo.x, playerInfo.y);
        container.setSize(16, 16);
        container.add(this.otherPlayer);
        container.add(text);
        
       container.playerId = playerInfo.playerId;
        this.otherPlayers.add(container);

      }

  
      updateCamera() {
        this.cameras.main.setBounds(
          0,
          0,
          this.map.widthInPixels,
          this.map.heightInPixels
        );
        this.cameras.main.startFollow(this.container);
        this.cameras.main.roundPixels = true;
      }
    
      getValidLocation() {
        var validLocation = false;
        var x, y;
        while (!validLocation) {
          x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
          y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
    
          var occupied = false;
          this.spawns.getChildren().forEach((child) => {
            if (child.getBounds().contains(x, y)) {
              occupied = true;
            }
          });
          if (!occupied) validLocation = true;
        }
        return { x, y };
      }
    
      update() {
        if (this.container) {
          this.container.body.setVelocity(0);

              
          //Handles verticle player movement
          if (this.cursors.up.isDown) {
            this.container.body.setVelocityY(-200);
          } else if (this.cursors.down.isDown) {
            this.container.body.setVelocityY(200);
          }
    
          //Handles horizontal player movement
          if (this.cursors.left.isDown) {
            this.container.body.setVelocityX(-200);
          } else if (this.cursors.right.isDown) {
            this.container.body.setVelocityX(200);
          }
    
          // Update the animation last and give left/right animations precedence over up/down animations
          if (this.cursors.left.isDown) {
            this.player.anims.play("left", true);
          } else if (this.cursors.right.isDown) {
            this.player.anims.play("right", true);
          } else if (this.cursors.up.isDown) {
            this.player.anims.play("up", true);
          } else if (this.cursors.down.isDown) {
            this.player.anims.play("down", true);
          } else {
            this.player.anims.stop();
          }
    
          //Handles moving player to the rest of players
    
          var y = this.container.y;
          var x = this.container.x;
          var flip = this.player.flipX;
          if (
            this.container.oldPosition &&
            (x !== this.container.oldPosition.x ||
              y !== this.container.oldPosition.y ||
              flip !== this.container.oldPosition.flipX)
          ) {
            this.socket.emit("playerMovement", { x, y, flip });
          }
    
          this.container.oldPosition = {
            x: this.container.x,
            y: this.container.y,
            flipX: this.player.flipX,
          };
        }
      }
    }
    

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
   
  scene: [initialiseAssets, TitleScene, mapScene, UiScene],
};

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




