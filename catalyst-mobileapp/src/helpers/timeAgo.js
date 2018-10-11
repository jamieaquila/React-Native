export default function timeAgo(timeStamp) {
    var timeStamp = new Date(timeStamp);
    var now = new Date(),
        secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
    if(secondsPast < 60){ // minute in seconds
        return parseInt(secondsPast) + 's';
    }
    if(secondsPast < 3600){ // hour in seconds
        return parseInt(secondsPast/60) + 'm';
    }
    if(secondsPast <= 86400){ // day in seconds
        return parseInt(secondsPast/3600) + 'h';
    }
    if(secondsPast <= 604800){ // week in seconds
        return parseInt(secondsPast/86400) + 'd';
    }
    if(secondsPast > 604800){
        var day = timeStamp.getDate();
        var month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
        var year = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();

        return day + " " + month + year;
    }
}
