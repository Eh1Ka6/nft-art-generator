const mergeImages = require('merge-images');
const fs = require('fs');
const { readFile, writeFile, readdir } = require("fs").promises;
const { Image, Canvas } = require('canvas');
const getDirectories = source =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const getFiles = source =>  fs.readFileSync(source, 'utf8');
const ImageDataURI = require('image-data-uri');
let traits;
let basePath;
let outputPath = process.cwd() + '/Assets/Output/';
let jsonlist = [];
let margin= { x: 85, y: 161 };
let generationlist = ["down-up"]//"up-down", "down-up", "down-middle",
main();

retcount = 0
async function main() {
  basePath = process.cwd() + '/Assets/Images/Position 1';
  traits = getDirectories(basePath);
  outputPath = process.cwd() + '/Assets/Output/';
  let json
  generationlist.forEach(generation => {
     jsonlist[generation] = require(process.cwd() + '/Assets/Formatted/2/' + generation + '.json');
  });
  var pickedarray = [];
  var ar = []
  
  var temp = []
  // pour chaque layer recupere le trait
  for (let i = 0; i < 18; i++) {
     temp[i]= jsonlist["down-up"].filter(element => element.id === i);
     ar[i] =[]
     for (let j = 0; j < temp[i].length  ; j++  )
     {
       let rarity= temp[i][j].rarity
       for (let v = 0; v < rarity; v++) {
       
         ar[i].push(temp[i][j])
        //ar[i][j+v].rarity = 1
        //////console.log(ar[i][j+v])
       }

     }
     //////console.log(ar[i])
     for (let j = 0; j < ar[i].length  ;j++  )
     {
        
        ar[i][j].rarity =1
     
     }

     
  }
  for (let i = 0; i < 18; i++) {
    
    ar[i] = shuffleArray(ar[i]);
    //ar[i].forEach(x => ////console.log(x));
  }
 


  let smokedorelectrified = false
  let mask = false
  let hair = false
  let facetattoo =false
  var retcount
  for (var j = 1994; j < 2593; j++) {
     retcount = 0
    for (let i = 0; i < 18; i++) {
      let pick =  pickRandom(ar[i])

      //////console.log(ar[i][pick].traitname)
      if (ar[i][pick].layer === "special eyes") {
        if (ar[i][pick].traitname.includes("smoke") || ar[i][pick].traitname.includes("lightning")) {
          smokedorelectrified = true
        } else {
          smokedorelectrified = false
        }

      }
      if (ar[i][pick].layer.includes("hair")) {
         if (ar[i][pick].traitname != "-"){
            ////console.log(ar[i][pick].traitname)
          hair = true
        } else {
          hair = false
        }

    }
    ////console.log("retry", j, i, pick , ar[i][pick].traitname, smokedorelectrified, hair)
    if (ar[i][pick].traitname.includes("mask")) {
      ////console.log("WE HAVE AMASK")
    }
    ////console.log(ar[i])
    let nothing = findnothing(ar[i])
   
     if (smokedorelectrified  && ar[i][pick].layer.includes("hair") ) {
        if (pickedarray.length >1 ){
          pickedarray.splice(i, 1);
        }
        ////console.log(ar[i][nothing.index])
       ////console.log(ar[i])
       
        pickedarray[i]= ar[i][nothing.index];
        pickedarray[i].traitname = "-"
        if (nothing.count!=1){
        ar[i].splice(nothing.index, 1);
        }
        hair = false
      }
      else if (smokedorelectrified  && (ar[i][pick].traitname.includes("face tattoo") || ar[i][pick].traitname.includes("sacred mark")) ) {
        if (pickedarray.length >1 ){
          pickedarray.splice(i, 1);
        }
        pickedarray[i]= ar[i][nothing.index];
        pickedarray[i].traitname = "-"
        if (nothing.count!=1){
          ar[i].splice(nothing.index, 1);
          }
        hair = false
      }
      else if ((smokedorelectrified) && ar[i][pick].layer.includes("face") ) {
        if (pickedarray.length >1 ){
          pickedarray.splice(i, 1);
        }
          pickedarray[i]= ar[i][nothing.index];
          pickedarray[i].traitname = "-"
          if (nothing.count!=1){
            ar[i].splice(nothing.index, 1);
            }


      } else if ((smokedorelectrified || hair) && ar[i][pick].traitname.includes("mask") ) {
        ////console.log("RESET MASK")
        if (retcount>40)
        {
          
          pickedarray[i]= ar[i][nothing.index];
          pickedarray[i].traitname = "-"
          if (nothing.count!=1){
            ar[i].splice(nothing.index, 1);
            }
          retcount = 0
        }
        else {
        if (pickedarray.length >1 ){
          pickedarray.splice(i, 1);
        }
        retcount++
        i--;
      }
    }
      else if (ar[i][pick].rarity == 0 )   {
        // remove from array and pick again
        if (retcount>40)
        {
          pickedarray[i]= ar[i][nothing.index];
          pickedarray[i].traitname = "-"
          if (nothing.count!=1){
            ar[i].splice(nothing.index, 1);
            }
          retcount = 0
        }
        else {
          if (ar[i].length >1 ){
            ar[i].splice(pick, 1);
          }
          retcount++
          i--;
       }

      } else {
        if (ar[i][pick].traitname.includes("mask")) {
          ////console.log("WEHAVE A MASK")
        }
      pickedarray[i]= ar[i][pick];
      //ar[i][pick].rarity -= 1;
      ar[i].splice(pick, 1);
      //onsole.log(jsonlist["up-up"].filter(element => element.id === i)[pick].rarity );
      }
  }
  //////console.log(pickedarray);
  var currentemotion
  var files = [];
  var attributes = [];
  //let smokedorelectrified = false
  for (let i = 0; i < pickedarray.length; i++) {
    if (pickedarray[i].layer === "Emotions") {
      currentemotion=pickedarray[i].traitname
      ////console.log(pickedarray[i].traitname)
    }
    if (pickedarray[i].layer === "special eyes") {
     // ////console.log(currentemotion)
     // ////console.log("Loading Emotion")
   files[i] =  { src: await getFilesForTrait (pickedarray[i].layer, pickedarray[i].traitname,generationlist[0],currentemotion), x:margin.x , y:margin.y }
  } else if (pickedarray[i].layer === "background"){
    ////console.log("background")
        files[i] = { src: await getFilesForTrait (pickedarray[i].layer,  pickedarray[i].traitname, generationlist[0]), x:0 , y:0 } ;
      } else if (pickedarray[i].layer === "faction"){
        ////console.log("faction")

          }
      else {
        files[i] = { src: await getFilesForTrait (pickedarray[i].layer,  pickedarray[i].traitname, generationlist[0]), x:margin.x , y:margin.y } ;
      }
      let retrait
      if (pickedarray[i].layer.includes("left")) {
        finaltrait = pickedarray[i].traitname + " l"
      } else {
        finaltrait = pickedarray[i].traitname
      }

      attributes[i] =  {"trait_type": pickedarray[i].layer, "value": finaltrait, "rarity": codetoword(pickedarray[i].rarityname)}
  }




  //////console.log(files)

  try {
    //console.log(files)
    const b64 = await mergeImages(files, { Canvas: Canvas, Image: Image },);
    //////console.log(j)
    //////console.log(files)
    // Write picked array to file


    var metadata = {
    "description": "",
    "external_url": "https://openseacreatures.io/3",
    "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
    "name": `Cyber Rogue ${j + 1}#`,
    "attributes": JSON.stringify(attributes)
    }
    ////console.log(metadata)

  fs.writeFileSync(process.cwd() + `/Assets/Output/${j+1}.json`, JSON.stringify(metadata));
    await ImageDataURI.outputFile(b64, outputPath + `${j+1}.png`);
  } catch (err) {
      console.log(err);
    }
  }


 /* var currentfile
 */
}


async function getFilesForTrait(layer,trait,generation,emotion) {
  emotion = emotion || "";
  pos = generation.split("-")
  if (layer === "Emotions") {
    return basePath + '/' + "Emotions" + '/' + trait + '/' + trait + ".png"
  }
  if (layer === "special eyes") {

    return basePath + '/' + "Emotions" + '/' + emotion + '/eyes/' + trait + ".png"
  } else if (layer === "background") {
    var rd = randomNumber(1,11).toString()
    if (rd < 10) {
    return basePath + '/' + layer + '/DYSTOPIA 0' + rd  + ".png"
    } else {
      return basePath + '/' + layer + '/DYSTOPIA ' + rd  + ".png"
    }
  } else if (layer === "left weapon" ) {
    return basePath + '/' + "left arm/" + pos[0] + '/' + "arm/" + trait + ".png"
  }else if ( layer === "bangle left") {
    return basePath + '/' + "left arm/" + pos[0] + '/' + "wrists/" + trait + ".png"
  }

  else if (layer === "right weapon" ) {
    ////console.log(pos[1])
    return basePath + '/' + "right arm/" + pos[1] + '/' + "arm/" + trait + ".png"
  }else if (layer === "up bangle right") {
    return basePath + '/' + "right arm/" + pos[1] + '/' + "wrists/" + trait + ".png"
  }
  else {

  return basePath + '/' + layer + '/' + trait + ".png"
  }
}

//GENERATES RANDOM NUMBER BETWEEN A MAX AND A MIN VALUE
function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//GENERATES RANDOM NUMBER BETWEEN A MAX AND A MIN VALUE
function codetoword(code) {
  switch(code)
{
    case "L":
    //Statement or expression;
      code = "Legendary"
    break;
    case "UR":
    //Statement or expression;
      code = "Ultra Rare"
    break;
    case "R":
    //Statement or expression;
      code = "Rare"
    break;
    case "UC":
    //Statement or expression;
      code = "Uncommon"
    break;
    case "C":
    //Statement or expression;
     code = "Common"
    break;
}
  return code
}
//PICKS A RANDOM INDEX INSIDE AN ARRAY RETURNS IT AND THEN REMOVES IT
function pickRandomAndRemove(array) {
  const toPick = randomNumber(0, array.length - 1);
  const pick = array[toPick];
  array.splice(toPick, 1);
  return pick;
}

//PICKS A RANDOM INDEX INSIDE AND ARRAY RETURNS IT
function pickRandom(array) {
  ////console.log(array.length);
  return randomNumber(0, array.length - 1)
}

function shuffleArray(array) {
  let curId = array.length;
  // There remain elements to shuffle
  while (0 !== curId) {
    // Pick a remaining element
    let randId = Math.floor(Math.random() * curId);
    curId -= 1;
    // Swap it with the current element.
    let tmp = array[curId];
    array[curId] = array[randId];
    array[randId] = tmp;
  }
  return array;
}

function findnothing(array) {

  let index=0 
  let count=0
  for (let i=0; i<array.length ; i++) {
    if (array[i].traitname == "-") {
      index = i 
      count++
      ////console.log(i)
      if (count>1) {
        return {index,count}
      }
    }
  }
  
  
  return {index:index,count:count};
}