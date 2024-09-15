require("dotenv").config()
const fs = require("fs/promises");
const path = require("path");

const colorTermStr = (color,text) => {
	return `\x1b${color} ${text}\x1b[0m`;
}

const Type = Object.freeze({
	ERROR : "ERROR",
	WARNING : "WARNING",
	INFO : "INFO"
})

const log = (type,message) => {
	let color = "[34m";	
	switch(type){
		case Type.ERROR:
			color = "[31m";
			break;
		case Type.WARNING:
			color = "[33m";
			break;
		default:
			color="[34m";
	}
	console.log(`${colorTermStr(color,`[${type.toString()}]`)} ${message}`);
}

const sendMessage = (channel_id,auth,s,message,clearIntervalS)=> {
    let count = 0;

    const func = ()=> {
      	log(Type.INFO,`sending message : ${message} to channel ${channel_id}`)
	    fetch(`https://discord.com/api/v9/channels/${channel_id}/messages`, {
       		"headers": {
       	    		"accept": "*/*",
       	    		"accept-language": "en-US,en;q=0.9",
       	    		"authorization": auth,
       	    		"content-type": "application/json",
       	  	},
      		"body" : JSON.stringify({
       		 		mobile_network_type : "unknown",
        			content : message,
	        		tts : false,
       		 		flags : 0
      			}),
      		"method": "POST",
    		}).catch(err=>{
			if(err instanceof Error)
				log(Type.ERROR,err.message)
			else
				log(Type.Error,err);
		})
		  .then(_=>{
    	  		log(Type.INFO,`Message ${message} Sent to channel ${channel_id}`)
      			count+=1;
      			log(Type.INFO,`Total number of Message ${message} sent to channel ${channel_id} : ` + count + "\n");
    		});
    }

    log(Type.INFO,`Sending message to channel : ${channel_id} every ${s}s`)
    log(Type.INFO,`Message loop for channel : ${channel_id} with message : "${message}" ends after ${clearIntervalS}s\n`)
	func();
    const id = setInterval(()=>{
      func();
    },s*1000)

    setTimeout(()=>{
      clearInterval(id)
	log(Type.INFO,`Message loop for channel : ${channel_id} with message : "${message}" ended\nTotal messsage sent Count : ${count}`);
    },clearIntervalS*1000)
}


fs.readFile(path.join(__dirname,"config.json")).then(config=>{
	for(const val of JSON.parse(config.toString())) {
		sendMessage(val.channel,process.env.AUTH,val.intervalTimeInSec,val.message,val.clearIntervalTimeInSec);
	}
})



// const autoMesg = ()=>{}

// const func = ()=> {
//   const ifunc = ()=>{
//       log(Type.INFO,"hello");
//   }
//   const time = ()=>((Math.random()*5)+3)*1000;
//   const intId = setInterval(()=> {
//       setTimeout(()=>{
//           ifunc()
//       },time)
//   },time)

//   setTimeout(()=>{
//     clearInterval(intId)
//   },3600000)
// }



