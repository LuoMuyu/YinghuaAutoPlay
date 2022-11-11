// ==UserScript==
// @name         英华学堂自动续播
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  英华学堂系统在线课程自动播放
// @author       洛沐语
// @match        http*://*/user/node?*
// @icon         https://mooc.yinghuaonline.com/static/favicon/yinghua.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function findtag(tag) {
        let site = 0;
        switch(tag) {
            case "input":
                for (let i=0;i<1000;i++) {
                    if (document.getElementsByTagName("input")[i].id === 'yzCode') {
                        site = i;
                        break;
                    }
                }
                break;
            case "img":
                for (let i=0;i<1000;i++) {
                    if (document.getElementsByTagName("img")[i].id === 'codeImg') {
                        site = i;
                        break;
                    }
                }
                break;
        }
        return site+1;
    }
    function sleep(ms) {
        return new Promise(function(resolve, reject) {
            setTimeout(resolve, ms)
        })
    }
    function CodeMain(url, ext) {
        let canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image;
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = function () {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const dataURL = canvas.toDataURL("image/" + ext);
            canvas = null;
            const api = ""; // 服务器API地址 / Server API Address
            const xhr = new XMLHttpRequest();
            xhr.open("POST", api, true);
            xhr.setRequestHeader('content-type', 'application/json');
            const sendData = {
                file_base64: dataURL
            };
            xhr.send(JSON.stringify(sendData));
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    const result = JSON.parse(xhr.responseText);
                    console.log(result.pic_str);
                    document.getElementsByTagName("input")[findtag("input")].value = result.pic_str;
                    document.getElementsByClassName("layui-layer-btn0")[0].click();
                }
            };
        }
    };
    window.onload = function (){
        document.getElementsByTagName("video")[0].muted = true;
        document.getElementsByTagName("video")[0].play();
        sleep(3000).then(() => {
            CodeMain(document.getElementsByTagName("img")[findtag("img")].src, "png");
        })
        document.getElementsByTagName("video")[0].addEventListener("ended", function () {
            const id = Number(window.location.search.substr(1).match(new RegExp("(^|&)nodeId=([^&]*)(&|$)","i"))[2]);
            let nowurl = window.location.href;
            window.location.href = nowurl.replace(id, id+1);
        });
    }
})();