"use strict";var TpfHome=function(){var k,l,m,n,o,a=document.getElementById("park-list").getElementsByTagName("li"),b=a.length,c=[],d=!1,g=($('meta[name="csrf-token"]').attr("content"),!0),h=$(".loading-screen"),i=$(".loading-screen-small"),j=0,p=function(){var c;for(c=0;c<b;c++){var d=a[c].id,e=a[c].getAttribute("data-parkval");$("#"+d).css({"background-image":"url(../public/images/"+e+".jpg)"})}},q=function(){for(var c,c=0;c<b;c++)a[c].addEventListener("click",function(){v(this),E()},!1);window.addEventListener("load",function(){setTimeout(function(){window.addEventListener("popstate",function(a){u()},!1)},0)})},r=function(){var a=document.getElementById("find-all");a.addEventListener("click",function(){A(h),C(F,c)},!1)},s=function(){$("#park-find-btn").click(function(){d&&z()})},t=function(){$("#park-reset-btn").click(function(){d&&D()})},u=function(){var a=history.state;null!==a?(m=a.data,n=a.location,j=a.checkpoint,g=!0,J()):(g=!1,J())},v=function(a){var b=a.getAttribute("data-selected"),c=a.id;0==b?(R(c,".5",1,"block"),w(a,c)):(R(c,".9",0,"none"),x(c))},w=function(a,b){var c=a.getAttribute("data-nicename");$(".chosen-park-list").css({display:"block"}),$(".chosen-park-list ul").prepend("<li id='chosenlist-"+b+"' class='fade-in-and-up'><i class='fa fa-times' aria-hidden='true'></i> "+c+"</li>"),document.getElementById("chosenlist-"+b).addEventListener("click",function(){v(a),E()},!1)},x=function(a){$("#chosenlist-"+a).remove(),$(".chosen-park-list ul").has("li").length||$(".chosen-park-list").css({display:"none"})},y=function(){$(".chosen-park-list").css({display:"none"}),$(".chosen-park-list ul").empty()},z=function(){var d;for(d=0;d<b;d++)1==a[d].getAttribute("data-selected")&&c.push(a[d].getAttribute("data-parkvaloffish"));A(h),C(F,c),c=[]},A=function(a){a.removeClass("ani-fadeOutZindex").addClass("ani-fadeInZindex")},B=function(a){a.removeClass("ani-fadeInZindex").addClass("ani-fadeOutZindex")},C=function(a,b){function f(c){n=[];var d=c.coords.latitude,e=c.coords.longitude;n.push(d,e),a(b)}var e={enableHighAccuracy:!1,timeout:7500,maximumAge:0};navigator.geolocation?navigator.geolocation.getCurrentPosition(f,function(){B(h)},e):alert("Your browser cannot get your location.")},D=function(){var d;for(d=0;d<b;d++)a[d].setAttribute("data-selected",0),T(d),y(),U();c=[]},E=function(){var f,c=1,e=!1;for(f=0;f<b;f++)1==a[f].getAttribute("data-selected")&&(e=!0),c==b&&(e===!1?(d=!1,U()):(d=!0,S())),c++},F=function(a){var b={lat:n[0],lng:n[1],facilities:a.join(",")};$.ajax({url:document.location.origin+"/facilities",type:"GET",data:b,dataType:"JSON",success:function(a){console.log(a),B(h),a.length>=1?(m=a,J(),L()):alert("Your chosen facilities are not available at any parks.")},error:function(a){B(h),console.log(a)}})},G=function(a){var b,c=function(a){var b=a.lastIndexOf(" ");return a.substring(0,b)},d=a.split(" "),e=d.slice(-1).pop(),f=c(a);switch(e){case"CC":b="%20Community%20Center";break;case"CRC":b="%20Community%20Recreation%20Center";break;case"RC":b="%20Recreation%20Center";break;case"CSS":b="%20Catholic%20Secondary%20School";break;case"PS":b="%20Public%20School";break;case"CS":b="%20Community%20School";break;case"PARK":b="%20Park";break;case"ES":b="%20Park";break;case"CI":b="%20Collegiate%20Institute";break;case"SS":b="%20Secondary%20School";break;case"JHS":b="%20Junior%20High%20School";break;case"JPS":b="%20Junior%20Public%20School";break;case"TCH":b="%20Toronto%20Community%20Housing";break;default:return encodeURIComponent(a.trim())+"%20Toronto"}return encodeURIComponent(f.trim())+b+"%20Toronto"},H=function(a){A(i);var b=G(m[a].name);$(".park-images-ul ul").empty(),$.ajax({url:document.location.origin+"/bingimages",type:"GET",data:{park:b},dataType:"JSON",success:function(a){B(i),I(a),console.log(a)},error:function(a){B(i),console.log(a)}})},I=function(a){a.value.map(function(a,b){$(".park-images-ul ul").append("<a href='"+a.contentUrl.replace(/^http:\/\//i,"https://")+"' target='_blank'><li class='image-item'><img src='"+a.contentUrl.replace(/^http:\/\//i,"https://")+"'/></li></a>")})},J=function(){g?($(".li-bg").removeClass("ani-right").addClass("ani-left"),$(".title").removeClass("ani-fadeIn").addClass("ani-fadeOut"),$(".sub-title").removeClass("ani-fadeIn").addClass("ani-fadeOut"),$(".description").removeClass("ani-fadeIn").addClass("ani-fadeOut"),U(),setTimeout(function(){$("#home-page").css({display:"none"}),$("#find-parks-page").css({display:"block"}),K()},101),g=!1):($("#find-parks-page").css({display:"none"}),$("#home-page").css({display:"block"}),setTimeout(function(){$(".li-bg").removeClass("ani-left").addClass("ani-right"),$(".title").removeClass("ani-fadeOut").addClass("ani-fadeIn"),$(".sub-title").removeClass("ani-fadeOut").addClass("ani-fadeIn"),$(".description").removeClass("ani-fadeOut").addClass("ani-fadeIn"),E()},0),g=!0)},K=function(){P(),M(),O(j),H(j)},L=function(a){var b="undefined"==typeof a?0:a;history.pushState&&history.pushState({data:m,location:n,checkpoint:b},null,"nearme?q="+b)},M=function(){$(".park-distance-ul ul").empty(),m.map(function(a,b){$(".park-distance-ul ul").append("<li class='distance-item' data-selection-number='"+b+"' data-lat='"+a.latitude+"' data-lng='"+a.longitude+"' data-parkname='"+a.name+"' data-address='"+a.address+"' data-phonenumber='"+a.phone+"' data-postalcode='"+a.postal_code+"'><div class='number-overlay'>"+(b+1)+"</div><div class='number'><strong>"+(b+1)+"</strong> <i class='fa fa-angle-right fa-styling' aria-hidden='true'></i> <span style='opacity: .8;'>"+a.name+"</span></div></li>")});for(var a=document.getElementsByClassName("distance-item"),b=a.length,c=0;c<b;c++)a[c].addEventListener("click",N,!1);a[j].classList.add("park-selected"),a[j].classList.add("park-selected-official")},N=function(){j=parseInt(this.getAttribute("data-selection-number")),$(".park-distance-ul>ul>li.park-selected-official").removeClass("park-selected-official"),$(".park-distance-ul>ul>li>.number-zoom").removeClass("number-zoom"),this.classList.add("park-selected"),this.classList.add("park-selected-official"),$(".park-selected-official>.number-overlay").addClass("number-zoom"),Q(j,!0),O(j),H(j),o.getStreetView().setVisible(!1),L(j)},O=function(a){var b=m[a].phone,c="https://www.google.com/maps/dir/"+n[0]+","+n[1]+"/"+m[a].latitude+","+m[a].longitude,d="uber://?action=setPickup&pickup=my_location&dropoff[latitude]="+m[a].latitude+"&dropoff[longitude]="+m[a].longitude+"&dropoff[formatted_address]="+m[a].address,e="",f="";""!==b?(e='<a href="tel:'+m[a].phone+'">',f="</a>"):b="N/A",$("#park-info-name").empty().html(m[a].name),$("#park-info-address").empty().html('<i class="fa fa-map-marker fa-styling" aria-hidden="true"></i> '+m[a].address),$("#park-info-phonenumber").empty().html('<i class="fa fa-phone fa-styling" aria-hidden="true"></i> '+e+b+f),$("#park-info-postalcode").empty().html('<i class="fa fa-home fa-styling" aria-hidden="true"></i> '+m[a].postal_code),$("#park-info-etc #directions").attr("href",c),$("#park-info-etc #uber").attr("href",d)},P=function(){var a,b;o=new google.maps.Map(document.getElementById("google-map"),{zoom:12,center:new google.maps.LatLng(n[0],n[1]),mapTypeId:google.maps.MapTypeId.ROADMAP});var c=new google.maps.InfoWindow;for(k=new google.maps.DirectionsRenderer({preserveViewport:!0}),l=new google.maps.DirectionsService,k.setMap(o),b=0;b<m.length;b++)a=new google.maps.Marker({position:new google.maps.LatLng(m[b].latitude,m[b].longitude),map:o}),google.maps.event.addListener(a,"click",function(a,b){return function(){c.setContent(m[b].name),c.open(o,a)}}(a,b));Q(j)},Q=function(a,b){var b="undefined"!=typeof b,c=new google.maps.LatLng(n[0],n[1]),d=new google.maps.LatLng(m[a].latitude,m[a].longitude);b&&(k.preserveViewport=!1),l.route({origin:c,destination:d,travelMode:google.maps.TravelMode.DRIVING},function(a,b){b===google.maps.DirectionsStatus.OK?k.setDirections(a):console.debug("Directions request failed due to "+b)})},R=function(a,b,c,d){$("#"+a).css({opacity:b}).attr("data-selected",c),$("#"+a+" > .svg-check").css({display:d}).toggleClass("zoom-check"),"none"===d?($("#"+a).removeClass("li-click"),$("#"+a+" > p").removeClass("li-click-text")):($("#"+a).addClass("li-click"),$("#"+a+" > p").addClass("li-click-text"))},S=function(){$(".fire-btn-shadow").css({display:"block"}).removeClass("zoom-check-shadow-reverse").addClass("zoom-check-shadow"),$(".reset-btn-shadow").css({display:"block"}).removeClass("zoom-check-shadow-reverse").addClass("zoom-check-shadow"),$(".fire-btn").css({display:"block"}).removeClass("zoom-check-reverse").addClass("zoom-check"),$(".reset-btn").css({display:"block"}).removeClass("zoom-check-reverse").addClass("zoom-check")},T=function(a){$("#"+a).css({opacity:".9"}).attr("data-selected",0),$("#"+a+" > .svg-check").css({display:"none"}).removeClass("zoom-check"),$("#"+a).removeClass("li-click"),$("#"+a+" > p").removeClass("li-click-text")},U=function(){$(".fire-btn-shadow").addClass("zoom-check-shadow-reverse").removeClass("zoom-check-shadow"),$(".reset-btn-shadow").addClass("zoom-check-shadow-reverse").removeClass("zoom-check-shadow"),$(".fire-btn").addClass("zoom-check-reverse").removeClass("zoom-check"),$(".reset-btn").addClass("zoom-check-reverse").removeClass("zoom-check")};return{populateImages:p,attachFindAll:r,attachEventListeners:q,attachGoClick:s,attachResetClick:t,checkHistoryState:u}}();TpfHome.populateImages(),TpfHome.attachEventListeners(),TpfHome.attachFindAll(),TpfHome.attachGoClick(),TpfHome.attachResetClick(),TpfHome.checkHistoryState();