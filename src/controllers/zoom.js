import Store from '../store';
import locale from '../locale/locale';
import { replaceHtml } from '../utils/util';
import {changeSheetContainerSize} from './resize';
import { jfrefreshgrid_rhcw } from '../global/refresh';


export function zoomChange(ratio){
    if(Store.flowdata==null || Store.flowdata.length==0){
        return;
    }

    Store.zoomRatio = ratio;

    jfrefreshgrid_rhcw(Store.flowdata.length, Store.flowdata[0].length);

    changeSheetContainerSize();
}


export function zoomInitial(){

    $("#luckysheet-zoom-minus").click(function(){
        let currentRatio;
        if(Store.zoomRatio==null){
            currentRatio = Store.zoomRatio = 1;
        }
        else{
            currentRatio = Math.ceil(Store.zoomRatio*10)/10;
        }

        currentRatio = currentRatio-0.1;

        if(currentRatio<=0.1){
            currentRatio = 0.1;
        }

        Store.zoomRatio = currentRatio;
        zoomChange(currentRatio);
        zoomNumberDomBind(currentRatio);
    });

    $("#luckysheet-zoom-plus").click(function(){
        let currentRatio;
        if(Store.zoomRatio==null){
            currentRatio = Store.zoomRatio = 1;
        }
        else{
            currentRatio = Math.floor(Store.zoomRatio*10)/10;
        }

        currentRatio = currentRatio+0.1;

        if(currentRatio>=4){
            currentRatio = 4;
        }

        Store.zoomRatio = currentRatio;
        zoomChange(currentRatio);
        zoomNumberDomBind(currentRatio);
    });

    $("#luckysheet-zoom-slider").click(function(e){
        let xoffset = $(this).offset().left, pageX = e.pageX;

        let currentRatio = positionToRatio(pageX-xoffset);
        Store.zoomRatio = currentRatio;
        zoomChange(currentRatio);
        zoomNumberDomBind(currentRatio);
    });

    $("#luckysheet-zoom-cursor").mousedown(function(e){
        let curentX = e.pageX,cursorLeft = parseFloat($("#luckysheet-zoom-cursor").css("left"));
        $(document).off("mousemove.zoomCursor").on("mousemove.zoomCursor",function(event){
            let moveX = event.pageX;
            let offsetX = moveX - curentX;
            // console.log(moveX, curentX, offsetX);
            // curentX = moveX;
            // let left = parseFloat($("#luckysheet-zoom-cursor").css("left"));
            let pos = cursorLeft + offsetX; 
            let currentRatio = positionToRatio(pos);

            if(currentRatio>4){
                currentRatio =4;
                pos = 100;
            }

            if(currentRatio<0.1){
                currentRatio =0.1;
                pos = 0;
            }

            Store.zoomRatio = currentRatio;
            zoomChange(currentRatio);
            let r = Math.round(currentRatio*100) + "%";
            $("#luckysheet-zoom-ratioText").html(r);
            $("#luckysheet-zoom-cursor").css("left", pos-4);
        });

        $(document).off("mouseup.zoomCursor").on("mouseup.zoomCursor",function(event){
            $(document).off(".zoomCursor");
        });

        e.stopPropagation();
    }).click(function(e){
        e.stopPropagation();
    });

    $("#luckysheet-zoom-ratioText").click(function(){
        Store.zoomRatio = 1;
        zoomChange(1);
        zoomNumberDomBind(1);
    });

    zoomNumberDomBind(Store.zoomRatio);
}


function zoomSlierDown(){

}

function positionToRatio(pos){
    let ratio = 1;
    if(pos<50){
        ratio = Math.round((pos*1.8/100 + 0.1)*100)/100;
    }
    else if(pos>50){
        ratio = Math.round(((pos-50)*6/100 + 1)*100)/100;
    }

    return ratio;
}

function zoomSlierDomBind(ratio){
    let domPos = 50;
    if(ratio<1){
        domPos = Math.round((ratio - 0.1)*100 / 0.18)/10;
    }
    else if(ratio>1){
        domPos = Math.round((ratio - 1)*100 / 0.6)/10+50;
    }
    $("#luckysheet-zoom-cursor").css("left", domPos-4);
}

export function zoomNumberDomBind(ratio){
    let r = Math.round(ratio*100) + "%";
    $("#luckysheet-zoom-ratioText").html(r);
    zoomSlierDomBind(ratio);
}

