let canvas;
let types = ["typo", "calarts", "designers", "b"];
let csv = "num;name;balanceX;balanceY;axisXName;axisYName;fitness50/50;fitness25/75;fitness75/25\n";
let n = 0;

let imgs = [];
function preload() {
  img = {img: loadImage("imgs/form5/3 - designers g5/6.png"), name: "" };
  //img = loadImage("imgs/form1/1 - typo g1/2.jpg");

 /* for(let i=0; i <5; i++) {
    let form = "form"+ (i+1);

    for(let j=0; j<4; j++) {
      let folder = (j+1)+" - "+types[j] + " g"+(i+1);

      for(let w=0; w<6; w++) {
        let file = (w+1)+".png";
        let img =  loadImage("imgs/"+form+"/"+folder+"/"+file);
        imgs.push({img:img, name: "imgs/"+form+"/"+folder+"/"+file});
      }
    }
  }*/

}

function setup() {
  canvas = createCanvas(100,100);
  background(0);

  //for(let img of imgs) {
    evaluateBalance(img.img, img.name);
  //}

  console.log(csv);
}

function evaluateBalance(img, name) {
  let count = 0;
  img.resize(400, 0);
  resizeCanvas(img.width, img.height);
  img.loadPixels();

  let massCenter = createVector(img.width / 2, img.height / 2);
  let force = createVector();

  let isDark = false;
  /*let avgDarkness = 0;
  let count2 = 0;
  for (let y = 0; y < img.height; y++)
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4,
          r = img.pixels[index + 0],
          g = img.pixels[index + 1],
          b = img.pixels[index + 2],
          bw = 255 - (r + g + b) / 3;
          avgDarkness+= bw;
          count2++;
    }

  avgDarkness/=count2;
  isDark = avgDarkness > 127;*/

  for (let y = 0; y < img.height; y++)
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4,
          r = img.pixels[index + 0],
          g = img.pixels[index + 1],
          b = img.pixels[index + 2],
          bw = isDark ? 255 - (r + g + b) / 3: (r + g + b) / 3,
          dir = createVector(x - massCenter.x, y - massCenter.y),
          f = 1 - bw / 255;

      f = pow(f, 2);

      img.pixels[index + 0] = bw;
      img.pixels[index + 1] = bw;
      img.pixels[index + 2] = bw;

      dir.mult(f);
      force.add(dir);
      count += f;
    }

  force.div(count);
  massCenter.add(force);
  img.updatePixels();

  image(img, 0, 0);
  fill(255, 0, 0);
  ellipse(massCenter.x, massCenter.y, 20, 20);
  stroke(0, 255, 0);
  line(width / 2, height / 2, massCenter.x, massCenter.y);

  //SET POSSIBLE AXIS
  let axisXCenter = img.width / 2;
  let axisYCenter = img.height / 2;
  let axisXLeft = 0;
  let axisYBottom = img.height;

  //DIST TO AXIS
  let balanceXCenter = abs(massCenter.x - axisXCenter);
  let balanceYCenter = abs(massCenter.y - axisYCenter);
  let balanceXLeft = abs(massCenter.x - axisXLeft);
  let balanceYBottom = abs(massCenter.y - axisYBottom);

  //SET DEFAUL AXEX
  let axisXName = "x_center";
  let axisYName = "y_center";
  let balanceX = balanceXCenter;
  let balanceY = balanceYCenter;
  let maxDistX = axisXCenter; //metade da width
  let maxDistY = axisYCenter; //metade da height

  //SET FINAL AXES (FINIAL = CLOSER ONES)
  /*if(balanceXLeft<balanceXCenter) { //se o eixo left for mais proximo
    axisXName = "x_left";
    balanceX = balanceXLeft;
    maxDistX = img.width;
  }
  if(balanceYBottom<balanceYCenter) {//se o eixo bottom for mais proximo
    axisYName = "y_bottom";
    balanceY = balanceYBottom;
    maxDistY = img.height;
  }*/

  //NORM
  balanceX = 1 - balanceX / maxDistX;
  balanceY = 1 - balanceY / maxDistY;
  //POW
  balanceX = pow(balanceX, 2);
  balanceY = pow(balanceY, 2);

  let fitness50_50 = balanceX * 0.5 + balanceY * 0.5;
  let fitness25_75 = balanceX * 0.25 + balanceY * 0.75;
  let fitness75_25 = balanceX * 0.75 + balanceY * 0.25;

  //GENERATE CSV
  console.log(n, name,
      "bX", balanceX, "bY", balanceY,
      "axisX", axisXName, "axisY", axisYName,
      "f50/50", fitness50_50,"f25/75", fitness25_75,"f75/25", fitness75_25);

  balanceX = (balanceX+"").replace(".", ",");
  balanceY = (balanceY+"").replace(".", ",");
  fitness50_50 = (fitness50_50+"").replace(".", ",");
  fitness25_75 = (fitness25_75+"").replace(".", ",");
  fitness75_25 = (fitness75_25+"").replace(".", ",");

  csv += n+";"+name+";"+
      balanceX +";"+balanceY+";"+
      axisXName +";"+axisYName+";"+
      fitness50_50 +";"+fitness25_75+";"+fitness75_25+"\n";
  n++;
}


