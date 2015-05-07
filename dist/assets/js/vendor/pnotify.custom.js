!function(a){"function"==typeof define&&define.amd?define("pnotify",["jquery"],a):a(jQuery)}(function(a){var b,c,d={dir1:"down",dir2:"left",push:"bottom",spacing1:25,spacing2:25,context:a("body")},e=a(window),f=function(){c=a("body"),PNotify.prototype.options.stack.context=c,e=a(window),e.bind("resize",function(){b&&clearTimeout(b),b=setTimeout(function(){PNotify.positionAll(!0)},10)})};return PNotify=function(a){this.parseOptions(a),this.init()},a.extend(PNotify.prototype,{version:"2.0.1",options:{title:!1,title_escape:!1,text:!1,text_escape:!1,styling:"bootstrap3",addclass:"",cornerclass:"",auto_display:!0,width:"300px",min_height:"16px",type:"notice",icon:!0,opacity:1,animation:"fade",animate_speed:"slow",position_animate_speed:500,shadow:!0,hide:!0,delay:8e3,mouse_reset:!0,remove:!0,insert_brs:!0,destroy:!0,stack:d},modules:{},runModules:function(a,b){var c;for(var d in this.modules)c="object"==typeof b&&d in b?b[d]:b,"function"==typeof this.modules[d][a]&&this.modules[d][a](this,"object"==typeof this.options[d]?this.options[d]:{},c)},state:"initializing",timer:null,styles:null,elem:null,container:null,title_container:null,text_container:null,animating:!1,timerHide:!1,init:function(){var b=this;return this.modules={},a.extend(!0,this.modules,PNotify.prototype.modules),"object"==typeof this.options.styling?this.styles=this.options.styling:this.styles=PNotify.styling[this.options.styling],this.elem=a("<div />",{"class":"ui-pnotify "+this.options.addclass,css:{display:"none"},mouseenter:function(a){if(b.options.mouse_reset&&"out"===b.animating){if(!b.timerHide)return;b.cancelRemove()}b.options.hide&&b.options.mouse_reset&&b.cancelRemove()},mouseleave:function(a){b.options.hide&&b.options.mouse_reset&&b.queueRemove(),PNotify.positionAll()}}),this.container=a("<div />",{"class":this.styles.container+" ui-pnotify-container "+("error"===this.options.type?this.styles.error:"info"===this.options.type?this.styles.info:"success"===this.options.type?this.styles.success:this.styles.notice)}).appendTo(this.elem),""!==this.options.cornerclass&&this.container.removeClass("ui-corner-all").addClass(this.options.cornerclass),this.options.shadow&&this.container.addClass("ui-pnotify-shadow"),this.options.icon!==!1&&a("<div />",{"class":"ui-pnotify-icon"}).append(a("<span />",{"class":this.options.icon===!0?"error"===this.options.type?this.styles.error_icon:"info"===this.options.type?this.styles.info_icon:"success"===this.options.type?this.styles.success_icon:this.styles.notice_icon:this.options.icon})).prependTo(this.container),this.title_container=a("<h4 />",{"class":"ui-pnotify-title"}).appendTo(this.container),this.options.title===!1?this.title_container.hide():this.options.title_escape?this.title_container.text(this.options.title):this.title_container.html(this.options.title),this.text_container=a("<div />",{"class":"ui-pnotify-text"}).appendTo(this.container),this.options.text===!1?this.text_container.hide():this.options.text_escape?this.text_container.text(this.options.text):this.text_container.html(this.options.insert_brs?String(this.options.text).replace(/\n/g,"<br />"):this.options.text),"string"==typeof this.options.width&&this.elem.css("width",this.options.width),"string"==typeof this.options.min_height&&this.container.css("min-height",this.options.min_height),"top"===this.options.stack.push?PNotify.notices=a.merge([this],PNotify.notices):PNotify.notices=a.merge(PNotify.notices,[this]),"top"===this.options.stack.push&&this.queuePosition(!1,1),this.options.stack.animation=!1,this.runModules("init"),this.options.auto_display&&this.open(),this},update:function(b){var c=this.options;return this.parseOptions(c,b),this.options.cornerclass!==c.cornerclass&&this.container.removeClass("ui-corner-all "+c.cornerclass).addClass(this.options.cornerclass),this.options.shadow!==c.shadow&&(this.options.shadow?this.container.addClass("ui-pnotify-shadow"):this.container.removeClass("ui-pnotify-shadow")),this.options.addclass===!1?this.elem.removeClass(c.addclass):this.options.addclass!==c.addclass&&this.elem.removeClass(c.addclass).addClass(this.options.addclass),this.options.title===!1?this.title_container.slideUp("fast"):this.options.title!==c.title&&(this.options.title_escape?this.title_container.text(this.options.title):this.title_container.html(this.options.title),c.title===!1&&this.title_container.slideDown(200)),this.options.text===!1?this.text_container.slideUp("fast"):this.options.text!==c.text&&(this.options.text_escape?this.text_container.text(this.options.text):this.text_container.html(this.options.insert_brs?String(this.options.text).replace(/\n/g,"<br />"):this.options.text),c.text===!1&&this.text_container.slideDown(200)),this.options.type!==c.type&&this.container.removeClass(this.styles.error+" "+this.styles.notice+" "+this.styles.success+" "+this.styles.info).addClass("error"===this.options.type?this.styles.error:"info"===this.options.type?this.styles.info:"success"===this.options.type?this.styles.success:this.styles.notice),(this.options.icon!==c.icon||this.options.icon===!0&&this.options.type!==c.type)&&(this.container.find("div.ui-pnotify-icon").remove(),this.options.icon!==!1&&a("<div />",{"class":"ui-pnotify-icon"}).append(a("<span />",{"class":this.options.icon===!0?"error"===this.options.type?this.styles.error_icon:"info"===this.options.type?this.styles.info_icon:"success"===this.options.type?this.styles.success_icon:this.styles.notice_icon:this.options.icon})).prependTo(this.container)),this.options.width!==c.width&&this.elem.animate({width:this.options.width}),this.options.min_height!==c.min_height&&this.container.animate({minHeight:this.options.min_height}),this.options.opacity!==c.opacity&&this.elem.fadeTo(this.options.animate_speed,this.options.opacity),this.options.hide?c.hide||this.queueRemove():this.cancelRemove(),this.queuePosition(!0),this.runModules("update",c),this},open:function(){this.state="opening",this.runModules("beforeOpen");var a=this;return this.elem.parent().length||this.elem.appendTo(this.options.stack.context?this.options.stack.context:c),"top"!==this.options.stack.push&&this.position(!0),"fade"===this.options.animation||"fade"===this.options.animation.effect_in?this.elem.show().fadeTo(0,0).hide():1!==this.options.opacity&&this.elem.show().fadeTo(0,this.options.opacity).hide(),this.animateIn(function(){a.queuePosition(!0),a.options.hide&&a.queueRemove(),a.state="open",a.runModules("afterOpen")}),this},remove:function(b){this.state="closing",this.timerHide=!!b,this.runModules("beforeClose");var c=this;return this.timer&&(window.clearTimeout(this.timer),this.timer=null),this.animateOut(function(){if(c.state="closed",c.runModules("afterClose"),c.queuePosition(!0),c.options.remove&&c.elem.detach(),c.runModules("beforeDestroy"),c.options.destroy&&null!==PNotify.notices){var b=a.inArray(c,PNotify.notices);-1!==b&&PNotify.notices.splice(b,1)}c.runModules("afterDestroy")}),this},get:function(){return this.elem},parseOptions:function(b,c){this.options=a.extend(!0,{},PNotify.prototype.options),this.options.stack=PNotify.prototype.options.stack;var d,e=[b,c];for(var f in e){if(d=e[f],"undefined"==typeof d)break;if("object"!=typeof d)this.options.text=d;else for(var g in d)this.modules[g]?a.extend(!0,this.options[g],d[g]):this.options[g]=d[g]}},animateIn:function(a){this.animating="in";var b;b="undefined"!=typeof this.options.animation.effect_in?this.options.animation.effect_in:this.options.animation,"none"===b?(this.elem.show(),a()):"show"===b?this.elem.show(this.options.animate_speed,a):"fade"===b?this.elem.show().fadeTo(this.options.animate_speed,this.options.opacity,a):"slide"===b?this.elem.slideDown(this.options.animate_speed,a):"function"==typeof b?b("in",a,this.elem):this.elem.show(b,"object"==typeof this.options.animation.options_in?this.options.animation.options_in:{},this.options.animate_speed,a),this.elem.parent().hasClass("ui-effects-wrapper")&&this.elem.parent().css({position:"fixed",overflow:"visible"}),"slide"!==b&&this.elem.css("overflow","visible"),this.container.css("overflow","hidden")},animateOut:function(a){this.animating="out";var b;b="undefined"!=typeof this.options.animation.effect_out?this.options.animation.effect_out:this.options.animation,"none"===b?(this.elem.hide(),a()):"show"===b?this.elem.hide(this.options.animate_speed,a):"fade"===b?this.elem.fadeOut(this.options.animate_speed,a):"slide"===b?this.elem.slideUp(this.options.animate_speed,a):"function"==typeof b?b("out",a,this.elem):this.elem.hide(b,"object"==typeof this.options.animation.options_out?this.options.animation.options_out:{},this.options.animate_speed,a),this.elem.parent().hasClass("ui-effects-wrapper")&&this.elem.parent().css({position:"fixed",overflow:"visible"}),"slide"!==b&&this.elem.css("overflow","visible"),this.container.css("overflow","hidden")},position:function(a){var b=this.options.stack,d=this.elem;if(d.parent().hasClass("ui-effects-wrapper")&&(d=this.elem.css({left:"0",top:"0",right:"0",bottom:"0"}).parent()),"undefined"==typeof b.context&&(b.context=c),b){"number"!=typeof b.nextpos1&&(b.nextpos1=b.firstpos1),"number"!=typeof b.nextpos2&&(b.nextpos2=b.firstpos2),"number"!=typeof b.addpos2&&(b.addpos2=0);var f="none"===d.css("display");if(!f||a){var g,h,i,j={};switch(b.dir1){case"down":i="top";break;case"up":i="bottom";break;case"left":i="right";break;case"right":i="left"}g=parseInt(d.css(i).replace(/(?:\..*|[^0-9.])/g,"")),isNaN(g)&&(g=0),"undefined"!=typeof b.firstpos1||f||(b.firstpos1=g,b.nextpos1=b.firstpos1);var k;switch(b.dir2){case"down":k="top";break;case"up":k="bottom";break;case"left":k="right";break;case"right":k="left"}if(h=parseInt(d.css(k).replace(/(?:\..*|[^0-9.])/g,"")),isNaN(h)&&(h=0),"undefined"!=typeof b.firstpos2||f||(b.firstpos2=h,b.nextpos2=b.firstpos2),("down"===b.dir1&&b.nextpos1+d.height()>(b.context.is(c)?e.height():b.context.prop("scrollHeight"))||"up"===b.dir1&&b.nextpos1+d.height()>(b.context.is(c)?e.height():b.context.prop("scrollHeight"))||"left"===b.dir1&&b.nextpos1+d.width()>(b.context.is(c)?e.width():b.context.prop("scrollWidth"))||"right"===b.dir1&&b.nextpos1+d.width()>(b.context.is(c)?e.width():b.context.prop("scrollWidth")))&&(b.nextpos1=b.firstpos1,b.nextpos2+=b.addpos2+("undefined"==typeof b.spacing2?25:b.spacing2),b.addpos2=0),b.animation&&b.nextpos2<h)switch(b.dir2){case"down":j.top=b.nextpos2+"px";break;case"up":j.bottom=b.nextpos2+"px";break;case"left":j.right=b.nextpos2+"px";break;case"right":j.left=b.nextpos2+"px"}else"number"==typeof b.nextpos2&&d.css(k,b.nextpos2+"px");switch(b.dir2){case"down":case"up":d.outerHeight(!0)>b.addpos2&&(b.addpos2=d.height());break;case"left":case"right":d.outerWidth(!0)>b.addpos2&&(b.addpos2=d.width())}if("number"==typeof b.nextpos1)if(b.animation&&(g>b.nextpos1||j.top||j.bottom||j.right||j.left))switch(b.dir1){case"down":j.top=b.nextpos1+"px";break;case"up":j.bottom=b.nextpos1+"px";break;case"left":j.right=b.nextpos1+"px";break;case"right":j.left=b.nextpos1+"px"}else d.css(i,b.nextpos1+"px");switch((j.top||j.bottom||j.right||j.left)&&d.animate(j,{duration:this.options.position_animate_speed,queue:!1}),b.dir1){case"down":case"up":b.nextpos1+=d.height()+("undefined"==typeof b.spacing1?25:b.spacing1);break;case"left":case"right":b.nextpos1+=d.width()+("undefined"==typeof b.spacing1?25:b.spacing1)}}return this}},queuePosition:function(a,c){return b&&clearTimeout(b),c||(c=10),b=setTimeout(function(){PNotify.positionAll(a)},c),this},cancelRemove:function(){return this.timer&&window.clearTimeout(this.timer),"closing"===this.state&&(this.elem.stop(!0),this.state="open",this.animating="in",this.elem.css("height","auto").animate({width:this.options.width,opacity:this.options.opacity},"fast")),this},queueRemove:function(){var a=this;return this.cancelRemove(),this.timer=window.setTimeout(function(){a.remove(!0)},isNaN(this.options.delay)?0:this.options.delay),this}}),a.extend(PNotify,{notices:[],removeAll:function(){a.each(PNotify.notices,function(){this.remove&&this.remove()})},positionAll:function(c){b&&clearTimeout(b),b=null,a.each(PNotify.notices,function(){var a=this.options.stack;a&&(a.nextpos1=a.firstpos1,a.nextpos2=a.firstpos2,a.addpos2=0,a.animation=c)}),a.each(PNotify.notices,function(){this.position()})},styling:{jqueryui:{container:"ui-widget ui-widget-content ui-corner-all",notice:"ui-state-highlight",notice_icon:"ui-icon ui-icon-info",info:"",info_icon:"ui-icon ui-icon-info",success:"ui-state-default",success_icon:"ui-icon ui-icon-circle-check",error:"ui-state-error",error_icon:"ui-icon ui-icon-alert"},bootstrap2:{container:"alert",notice:"",notice_icon:"icon-exclamation-sign",info:"alert-info",info_icon:"icon-info-sign",success:"alert-success",success_icon:"icon-ok-sign",error:"alert-error",error_icon:"icon-warning-sign"},bootstrap3:{container:"alert",notice:"alert-warning",notice_icon:"icomoon icomoon-notification2",info:"alert-info",info_icon:"icomoon icomoon-info2",success:"alert-success",success_icon:"glyphicon glyphicon-ok-sign",error:"alert-danger",error_icon:"icomoon icomoon-warning2"}}}),PNotify.styling.fontawesome=a.extend({},PNotify.styling.bootstrap3),a.extend(PNotify.styling.fontawesome,{notice_icon:"fa fa-exclamation-circle",info_icon:"fa fa-info",success_icon:"fa fa-check",error_icon:"fa fa-warning"}),document.body?f():a(f),PNotify}),function(a){"function"==typeof define&&define.amd?define("pnotify.buttons",["jquery","pnotify"],a):a(jQuery,PNotify)}(function(a,b){b.prototype.options.buttons={closer:!0,closer_hover:!0,sticker:!0,sticker_hover:!0,labels:{close:"Close",stick:"Stick"}},b.prototype.modules.buttons={myOptions:null,closer:null,sticker:null,init:function(b,c){var d=this;this.myOptions=c,b.elem.on({mouseenter:function(a){!d.myOptions.sticker||b.options.nonblock&&b.options.nonblock.nonblock||d.sticker.trigger("pnotify_icon").css("visibility","visible"),!d.myOptions.closer||b.options.nonblock&&b.options.nonblock.nonblock||d.closer.css("visibility","visible")},mouseleave:function(a){d.myOptions.sticker_hover&&d.sticker.css("visibility","hidden"),d.myOptions.closer_hover&&d.closer.css("visibility","hidden")}}),this.sticker=a("<div />",{"class":"ui-pnotify-sticker",css:{cursor:"pointer",visibility:c.sticker_hover?"hidden":"visible"},click:function(){b.options.hide=!b.options.hide,b.options.hide?b.queueRemove():b.cancelRemove(),a(this).trigger("pnotify_icon")}}).bind("pnotify_icon",function(){a(this).children().removeClass(b.styles.pin_up+" "+b.styles.pin_down).addClass(b.options.hide?b.styles.pin_up:b.styles.pin_down)}).append(a("<span />",{"class":b.styles.pin_up,title:c.labels.stick})).prependTo(b.container),(!c.sticker||b.options.nonblock&&b.options.nonblock.nonblock)&&this.sticker.css("display","none"),this.closer=a("<div />",{"class":"ui-pnotify-closer",css:{cursor:"pointer",visibility:c.closer_hover?"hidden":"visible"},click:function(){b.remove(!1),d.sticker.css("visibility","hidden"),d.closer.css("visibility","hidden")}}).append(a("<span />",{"class":b.styles.closer,title:c.labels.close})).prependTo(b.container),(!c.closer||b.options.nonblock&&b.options.nonblock.nonblock)&&this.closer.css("display","none")},update:function(a,b){this.myOptions=b,!b.closer||a.options.nonblock&&a.options.nonblock.nonblock?this.closer.css("display","none"):b.closer&&this.closer.css("display","block"),!b.sticker||a.options.nonblock&&a.options.nonblock.nonblock?this.sticker.css("display","none"):b.sticker&&this.sticker.css("display","block"),this.sticker.trigger("pnotify_icon"),b.sticker_hover?this.sticker.css("visibility","hidden"):a.options.nonblock&&a.options.nonblock.nonblock||this.sticker.css("visibility","visible"),b.closer_hover?this.closer.css("visibility","hidden"):a.options.nonblock&&a.options.nonblock.nonblock||this.closer.css("visibility","visible")}},a.extend(b.styling.jqueryui,{closer:"ui-icon ui-icon-close",pin_up:"ui-icon ui-icon-pin-w",pin_down:"ui-icon ui-icon-pin-s"}),a.extend(b.styling.bootstrap2,{closer:"icon-remove",pin_up:"icon-pause",pin_down:"icon-play"}),a.extend(b.styling.bootstrap3,{closer:"glyphicon glyphicon-remove",pin_up:"glyphicon glyphicon-pause",pin_down:"glyphicon glyphicon-play"}),a.extend(b.styling.fontawesome,{closer:"fa fa-times",pin_up:"fa fa-pause",pin_down:"fa fa-play"})}),function(a){"function"==typeof define&&define.amd?define("pnotify.confirm",["jquery","pnotify"],a):a(jQuery,PNotify)}(function(a,b){b.prototype.options.confirm={confirm:!1,prompt:!1,prompt_class:"",prompt_default:"",prompt_multi_line:!1,align:"right",buttons:[{text:"Ok",addClass:"",promptTrigger:!0,click:function(a,b){a.remove(),a.get().trigger("pnotify.confirm",[a,b])}},{text:"Cancel",addClass:"",click:function(a){a.remove(),a.get().trigger("pnotify.cancel",a)}}]},b.prototype.modules.confirm={container:null,prompt:null,init:function(b,c){this.container=a('<div style="margin-top:5px;clear:both;" />').css("text-align",c.align).appendTo(b.container),c.confirm||c.prompt?this.makeDialog(b,c):this.container.hide()},update:function(a,b){b.confirm?(this.makeDialog(a,b),this.container.show()):this.container.hide().empty()},afterOpen:function(a,b){b.prompt&&this.prompt.focus()},makeDialog:function(b,c){var d,e,f=!1,g=this;this.container.empty(),c.prompt&&(this.prompt=a("<"+(c.prompt_multi_line?'textarea rows="5"':'input type="text"')+' style="margin-bottom:5px;clear:both;" />').addClass(b.styles.input+" "+c.prompt_class).val(c.prompt_default).appendTo(this.container));for(var h in c.buttons)d=c.buttons[h],f?this.container.append(" "):f=!0,e=a('<button type="button" />').addClass(b.styles.btn+" "+d.addClass).text(d.text).appendTo(this.container).on("click",function(a){return function(){"function"==typeof a.click&&a.click(b,c.prompt?g.prompt.val():null)}}(d)),c.prompt&&!c.prompt_multi_line&&d.promptTrigger&&this.prompt.keypress(function(a){return function(b){13==b.keyCode&&a.click()}}(e)),b.styles.text&&e.wrapInner('<span class="'+b.styles.text+'"></span>'),b.styles.btnhover&&e.hover(function(a){return function(){a.addClass(b.styles.btnhover)}}(e),function(a){return function(){a.removeClass(b.styles.btnhover)}}(e)),b.styles.btnactive&&e.on("mousedown",function(a){return function(){a.addClass(b.styles.btnactive)}}(e)).on("mouseup",function(a){return function(){a.removeClass(b.styles.btnactive)}}(e)),b.styles.btnfocus&&e.on("focus",function(a){return function(){a.addClass(b.styles.btnfocus)}}(e)).on("blur",function(a){return function(){a.removeClass(b.styles.btnfocus)}}(e))}},a.extend(b.styling.jqueryui,{btn:"ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only",btnhover:"ui-state-hover",btnactive:"ui-state-active",btnfocus:"ui-state-focus",input:"",text:"ui-button-text"}),a.extend(b.styling.bootstrap2,{btn:"btn",input:""}),a.extend(b.styling.bootstrap3,{btn:"btn btn-default",input:"form-control"}),a.extend(b.styling.fontawesome,{btn:"btn btn-default",input:"form-control"})}),function(a){"function"==typeof define&&define.amd?define("pnotify.nonblock",["jquery","pnotify"],a):a(jQuery,PNotify)}(function(a,b){var c,d=/^on/,e=/^(dbl)?click$|^mouse(move|down|up|over|out|enter|leave)$|^contextmenu$/,f=/^(focus|blur|select|change|reset)$|^key(press|down|up)$/,g=/^(scroll|resize|(un)?load|abort|error)$/,h=function(b,c){var h;if(b=b.toLowerCase(),document.createEvent&&this.dispatchEvent){if(b=b.replace(d,""),b.match(e)?(a(this).offset(),h=document.createEvent("MouseEvents"),h.initMouseEvent(b,c.bubbles,c.cancelable,c.view,c.detail,c.screenX,c.screenY,c.clientX,c.clientY,c.ctrlKey,c.altKey,c.shiftKey,c.metaKey,c.button,c.relatedTarget)):b.match(f)?(h=document.createEvent("UIEvents"),h.initUIEvent(b,c.bubbles,c.cancelable,c.view,c.detail)):b.match(g)&&(h=document.createEvent("HTMLEvents"),h.initEvent(b,c.bubbles,c.cancelable)),!h)return;this.dispatchEvent(h)}else b.match(d)||(b="on"+b),h=document.createEventObject(c),this.fireEvent(b,h)},i=function(b,d,e){b.elem.css("display","none");var f=document.elementFromPoint(d.clientX,d.clientY);b.elem.css("display","block");var g=a(f),i=g.css("cursor");b.elem.css("cursor","auto"!==i?i:"default"),c&&c.get(0)==f||(c&&(h.call(c.get(0),"mouseleave",d.originalEvent),h.call(c.get(0),"mouseout",d.originalEvent)),h.call(f,"mouseenter",d.originalEvent),h.call(f,"mouseover",d.originalEvent)),h.call(f,e,d.originalEvent),c=g};b.prototype.options.nonblock={nonblock:!1,nonblock_opacity:.2},b.prototype.modules.nonblock={myOptions:null,init:function(a,b){var d=this;this.myOptions=b,a.elem.on({mouseenter:function(b){d.myOptions.nonblock&&b.stopPropagation(),d.myOptions.nonblock&&a.elem.stop().animate({opacity:d.myOptions.nonblock_opacity},"fast")},mouseleave:function(b){d.myOptions.nonblock&&b.stopPropagation(),c=null,a.elem.css("cursor","auto"),d.myOptions.nonblock&&"out"!==a.animating&&a.elem.stop().animate({opacity:a.options.opacity},"fast")},mouseover:function(a){d.myOptions.nonblock&&a.stopPropagation()},mouseout:function(a){d.myOptions.nonblock&&a.stopPropagation()},mousemove:function(b){d.myOptions.nonblock&&(b.stopPropagation(),i(a,b,"onmousemove"))},mousedown:function(b){d.myOptions.nonblock&&(b.stopPropagation(),b.preventDefault(),i(a,b,"onmousedown"))},mouseup:function(b){d.myOptions.nonblock&&(b.stopPropagation(),b.preventDefault(),i(a,b,"onmouseup"))},click:function(b){d.myOptions.nonblock&&(b.stopPropagation(),i(a,b,"onclick"))},dblclick:function(b){d.myOptions.nonblock&&(b.stopPropagation(),i(a,b,"ondblclick"))}})},update:function(a,b){this.myOptions=b}}});