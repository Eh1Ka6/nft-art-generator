const fs = require('fs')
var parse = require('csv-parse')
imagePath = process.cwd() + '/Assets/Images/';
csvPath = process.cwd() + '/Assets/CSVs/';
Position = ["2"]
generationlist = ["down-down"]//"up-down", "down-up", "down-middle", 
const trait = {
    layer: 'testFirstName',
    rarity: 'testLastName'
};

function Trait(l, t, r, id,code) {
    this.layer = l;
    this.traitname = t
    this.rarity = r;
    //if 
    this.rarityname = code
    this.id = id
}


traits = []
var cr
var cl
var ct
id = 0
Position.forEach(pos => {
    generationlist.forEach(generation => {
        currentCSV = csvPath + pos + "/" + generation + ".csv"
       console.log(currentCSV);
        currentImgFolder = imagePath + Position[0] + "/"
        traits = []
        //console.log(traits);
        fs.readFile(currentCSV, function (err, fileData) {

            parse.parse(fileData, { columns: false, trim: true }, function (err, rows) {
                // record rarities 
                for (var i = 1; i < rows.length; i++) {
                    for (var j = 0; j < rows[i].length; j++) {
                     
                        if (rows[i][j] != "") {
                               
                            if (j % 3 == 0) {
                                if (i != 0) {
                                    // record the current trait 
                                    console.log(j)
                                    console.log(i)
                                    cl = rows[0][j]
                                    ct = rows[i][j]
                                    console.log(cl)
                                    console.log(ct)
                                }
                            }
                            if (j % 3 == 1) {
                                if (i != 0 && ct != "") {
                                    // record the current rarity 
                                  
                                    cr = rows[i][j]
                                    var code= rows[i][j+1]
                                    traits[id] = new Trait(cl, ct, cr, (j - 1) / 3, code)
                                    id++;
                                }

                            }

                        } else {

                            ct = ""


                        }
                    }

                }
                traits.sort((a, b) => {
                    return a.id - b.id
                });

                var file = fs.createWriteStream(process.cwd() + '/Assets/Formatted/' + pos + "/" + generation +'.json');
                //console.log("writing to file");

                file.write(JSON.stringify(traits))
                traits= []
            })
        })

})
})
