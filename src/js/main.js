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
            url: 'https://interactive.guim.co.uk/docsdata-test/1MPqC3c6l8wEYWZMBNOx2vKLUz09WAQk5Ml2P03zdMr0.json',
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
    }

    return {
        init: init
    };
});
