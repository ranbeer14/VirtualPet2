var dogImg, happyDogImg, dog, database, foodS, foodStock;
var titleImg, playImg, tutorialImg;
var title, play, tutorial;
var gameState = "game";
var feedPet, addFood;
var fedTime;
var lastFed;
var foodObj;
var hr;

function preload() {
  dogImg = loadImage("Images/Dog.png");
  happyDogImg = loadImage("Images/HappyDog.png");
  titleImg = loadImage("Images/Title.jpg");
  playImg = loadImage("Images/Play.jpg");
  tutorialImg = loadImage("Images/Tutorial.jpg");
}

function setup() {
  createCanvas(1000, 500);
  //Creating all the Sprites
  dog = createSprite(550, 250, 20, 20);
  dog.addImage(dogImg);
  dog.scale = 0.4;

  title = createSprite(245, 100, 250, 50);
  title.addImage(titleImg);
  title.scale = 0.5;

  play = createSprite(244, 350, 20, 20);
  play.addImage(playImg);
  play.scale = 0.5;


  tutorial = createSprite(250, 400, 20, 20);
  tutorial.addImage(tutorialImg);
  tutorial.scale = 0.2;



  //Database related
  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food();


  feedPet = createButton("Feed the Dog");
  feedPet.position(450, 30);
  feedPet.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(575, 30);
  addFood.mousePressed(addFoods);
}


function draw() {
  background(46, 139, 87);

  if (gameState == "game") {
    foodObj.display();
    dog.display();
    cursor(ARROW);
    fedTime = database.ref("Feed Time");
    fedTime.on("value", function (data) {
      lastFed = data.val();
    });

    fill("skyblue");
    stroke(0);
    strokeWeight(5);
    textStyle(BOLD);
    textSize(25);
    textFont("georgia");

    if (lastFed >= 12) {
      text("Last Fed :" + lastFed % 12, " PM", 750, 50);z
    } else if (lastFed == 0) {
      text("Last Fed : 12 AM", 750, 50);
    } else {
      text("Last Fed : " + lastFed + " AM", 750, 50);
    }

    textSize(30);
    fill("yellow");
    stroke(0);
    strokeWeight(6);
    textFont("Georgia");
    textStyle(BOLD);

    if (foodS != 0) {
      text("Food Packages Left :  " + foodS, 5, 50);
    } else {
      text("No Food Left - Your pet may die", 5, 50)
    }
    if (foodS == 0) {
      dog.rotation = 90;
      dog.addImage(happyDogImg);
    }

  }
}


function readStock(data) {
  foodS = data.val();
}

function writeStock(x) {

  if (x <= 0) {
    x = 0
  } else {
    x = x - 1;
  }

  database.ref('/').update({
    Food: x
  });
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  });
}

function feedDog() {
  foodS = foodS - 1;
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock(FeedTime) - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour(),
    Food : foodS
  });
}