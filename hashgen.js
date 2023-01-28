const crypt = require("crypto-js");


function roundToNearestSeconds(date) {
    const minutes = .5
    const ms = 1000 * 60 * minutes;
    let times = new Date(Math.ceil(date.getTime() / ms) * ms);
    return times;
  }
function checking(){
        var key = "monkey";
        let date = new Date();
        let date2 = roundToNearestSeconds(date).toTimeString().slice(0,9);
        var compare = key+=date2;
        console.log(compare);
        var hashes = crypt.SHA256(compare).toString(crypt.Hex);
        console.log(hashes);

        var counter = 0;
        var digits= "";
        while(counter < 6)
        {   
            for(var x = 0; x < hashes.length; x++){
                var can = Number(hashes[x]);
                if(0 <= can <= 9 && !isNaN(can)){
                        console.log(can);
                        digits +=String(hashes[x]);
                        counter += 1;
                }
                if(counter == 6){
                    break;
                }
            }
        return digits;
}
}

console.log(checking())


