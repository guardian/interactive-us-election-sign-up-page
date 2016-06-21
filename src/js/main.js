define([
    'ractive',
    'jquery',
    'text!./templates/appTemplate.html'
], function(
    Ractive,
    $,
    appTemplate
) {
   'use strict';
    var data;

    function init(el, context, config, mediator) {
        var headCount = -1;
        if ($("#article")) {
            var target = $('#article, .article--standard, .article--immersive');
        } else {
            var target = $(".article--standard");
            alert("Error loading");
        }
        $.ajax({
            url: 'https://interactive.guim.co.uk/docsdata-test/1vCFZJAm3AiB1BvNrfhF-ev9aBNfPPPbZXMZD8JZ4zgY.json',
            success: function(response){
                for(var key in response.sheets){
                    var newSheet = response.sheets[key].map(function(row){
                        if(row.text){
                            row.text = row.text.split('\n').filter(function(p){return p});
                        }
                        return row;
                    });
                    response.sheets[key] = newSheet;
                }
                data = response.sheets;
                renderPage(target);
                console.log(data, 'this sis');
            },
            error:function(err){
                // console.log('data not loading',err);
            }
        })
    }

    function renderPage(el){
        var addEvent = function(object, type, callback) {
            if (object == null || typeof(object) == 'undefined') return;
            if (object.addEventListener) {
                object.addEventListener(type, callback, false);
            } else if (object.attachEvent) {
                object.attachEvent("on" + type, callback);
            } else {
                object["on"+type] = callback;
            }
        };
        var triggerEvent = function (target, type) {
            var doc = document,
                event;

            if (doc.createEvent) {
                event = new Event(type);
                target.dispatchEvent(event);
            } else {
                event = doc.createEventObject();
                target.fireEvent('on' + type, event);
            }
        };

        var app = new Ractive({
            el:el,
            template:appTemplate,
            data:data
        })

        triggerEvent(window, 'interactive-loaded');

        var video = document.getElementsByClassName('membership-video');
        var button = document.getElementsByClassName('video-button');
        var headline = document.getElementsByClassName('membership-interactive__headline');
        var headlineBackground = document.getElementsByClassName('membership-interactive__background');
        var videoButton = document.getElementsByClassName('video-button');
        var timer = document.getElementsByClassName('video-time');
        var videoTime = document.getElementsByClassName('time-update');
        console.log('this is video', video);
        console.log('button', button);
        var videoLength = 0;
        video[0].oncanplaythrough = function(){
          videoLength = video[0].duration;
        }
        button[0].addEventListener('click', function(){
          console.log('video clicked');
            if(video[0].paused){
              video[0].play();
              headline[0].setAttribute('data-playing', 'true');
              headlineBackground[0].setAttribute('data-playing', 'true');
              videoButton[0].setAttribute('data-playing', 'true');
              videoTime[0].setAttribute('data-playing', 'true');
              timer[0].setAttribute('data-playing', 'true');
              videoButton[0].innerHTML = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="40px" height="33.75px" viewBox="0 0 40 33.75" enable-background="new 0 0 40 33.75" xml:space="preserve"><g><path fill="#FFFFFF" d="M15.337,33.159H5.959V2.684l2.345-2.345h7.032V33.159z M24.714,0.339h9.377v30.478l-2.343,2.343h-7.034V0.339z"/></g></svg>'
            }else{
              video[0].pause();
              headline[0].removeAttribute('data-playing', 'true');
              headlineBackground[0].removeAttribute('data-playing', 'true');
              videoButton[0].removeAttribute('data-playing', 'true');
              videoTime[0].removeAttribute('data-playing', 'true');
              timer[0].removeAttribute('data-playing', 'true');
              videoButton[0].innerHTML = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="40px" height="33.75px" viewBox="0 0 40 33.75" enable-background="new 0 0 40 33.75" xml:space="preserve"><g><path fill="#FFFFFF" d="M39.577,17.625L1.863,33.098l-1.39-0.968V1.427l1.39-1.088l37.714,15.593V17.625z"/></g></svg>'
            }
        })
        video[0].ontimeupdate = function(){
          var minutes = Math.floor(video[0].currentTime / 60);
          var seconds = Math.floor(video[0].currentTime - minutes * 60);
          if(seconds < 10){
            seconds = '0' + seconds;
          }
          var time = minutes + ':' + seconds;
          videoTime[0].innerHTML = time;
          console.log('currentTime', Math.floor(video[0].currentTime));
          console.log('minutes', Math.floor(video[0].currentTime / 60));
          console.log('seconds', video[0].currentTime - minutes * 60)
          var timer = video[0].currentTime / videoLength * 100;
          console.log('%', Math.floor(timer));
          document.getElementById("progress").setAttribute("stroke-dasharray", Math.floor(timer) + "," + "1000");
      }
    }

    return {
        init: init
    };
});
