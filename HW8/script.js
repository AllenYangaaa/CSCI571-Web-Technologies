    // .show-hide-1,.show-hide-2{
    //     transition: all 1s linear;
    // }
    // .show-hide-1.ng-show {      
    //     transform: translateX(300%);
    // }
    // .show-hide-2.ng-show {
    //     transform: translateX(-300%);
    // }
    // .show-hide-1.ng-hide {
    //     transform: translateX(-300%);
    // }
    // .show-hide-2.ng-hide {
    //     transform: translateX(300%);
    // }

//$(function() {
	//alert("begin!");
	//$("#locationid").attr('disabled',false);
//}
//var MY_SERVER_URL = "http://localhost:8888/user?";
var MY_SERVER_URL = "http://hw8wangby2-env.us-west-1.elasticbeanstalk.com/user?";
var awsUrl;

$( document ).ready(function() {
	//if($("#optionsRadios2").attr("checked")){
	//	$("#locationid").attr("disabled",false);
	//}
	$("#optionsRadios1").click(function(){
		$("#locationid").attr("disabled",true);
		settrue3 = true;
		if($("#keywordid").val() == ""){
    		settrue2 = false;
    		$("#SearchButton").attr('disabled',true);
    	}else{
    		settrue2 = true;
    		$("#SearchButton").attr('disabled',false);
    	}
		$("#errmessage2").html("");
		$("#locationid").css({'border-color':'#80BDFF'});
    });

    $("#optionsRadios2").click(function(){
    	$("#locationid").attr("disabled",false);
    	if($("#locationid").val() == ""){
    		settrue3 = false;
    		$("#SearchButton").attr('disabled',true);
    	}else if ($("#keywordid").val() == ""){
    		settrue2 = false;
    		$("#SearchButton").attr('disabled',true);
    	}else {
    		settrue2 = true;
    		$("#SearchButton").attr('disabled',false);
    	}
    });

	$("#keywordid").on('input',function() {
		//alert()
		if($("#keywordid").val() != "" && $.trim($("#keywordid").val()) != ""){
			$("#errmessage1").html("");
			$("#keywordid").css({'border-color':'#80BDFF'});
			settrue2 = true;
			if(settrue1 && settrue3){
				$("#SearchButton").attr('disabled',false);
			}
		}else{
			$("#errmessage1").html("Please enter a keyword.");
			$("#keywordid").css({'border-color':'red'});
			settrue2 = false;
			$("#SearchButton").attr('disabled',true);
		}
	});
	
	$("#keywordid").on('blur',function() {
		//alert($("#keywordid").css('border-color'));

        if($("#keywordid").val() != "" && $.trim($("#keywordid").val()) != ""){
            $("#errmessage1").html("");
            $("#keywordid").css({'border-color':'#80BDFF'});
            settrue2 = true;
            //alert(settrue1+","+settrue2+","+settrue3);
            if(settrue1 && settrue3){
                $("#SearchButton").attr('disabled',false);
            }
        }else{
            $("#errmessage1").html("Please enter a keyword.");
            $("#keywordid").css({'border-color':'red'});
            settrue2 = false;
            $("#SearchButton").attr('disabled',true);
        }
	});

	$("#locationid").on('input',function() {
		if($("#locationid").val() != ""){
			$("#errmessage2").html("");
			$("#locationid").css({'border-color':'#80BDFF'});
			settrue3 = true;
			if(settrue1 && settrue2){
				$("#SearchButton").attr('disabled',false);
			}
		}else{
			$("#errmessage2").html("Please enter a location.");
			$("#locationid").css({'border-color':'red'});
			settrue3 = false;
			$("#SearchButton").attr('disabled',true);
		}
	});
	
	$("#locationid").on('blur',function() {
		if($("#locationid").val() == ""){
			$("#errmessage2").html("Please enter a location.");
			$("#locationid").css({'border-color':'red'});
			settrue3 = false;
			$("#SearchButton").attr('disabled',true);
		}else{
			$("#errmessage2").html("");
			$("#locationid").css({'border-color':'#80BDFF'});
			settrue3 = true;
			if(settrue1 && settrue2){
				$("#SearchButton").attr('disabled',false);
			}
		}
	});
});

(function () {
  var app = angular.module('myapp', ['ngAnimate']);

   app.controller('mainController', ['$scope', '$http',  function ($scope, $http) {
    $scope.data = [undefined,undefined,undefined];
   	$scope.nextPage = [undefined,undefined,undefined];
    $scope.detailingData = undefined;
   	$scope.PROCESSING = false;

    $scope.showResults = false;
    $scope.showFavorites = false;
    $scope.showDetails = false;
    $scope.showingData = []; // results data

    $scope.FAILING = false;
    $scope.NORECORDS = false;

    $scope.SHOW1 = false;
    $scope.SHOW2 = false;
    $scope.SHOW3 = false;
    $scope.SHOW4 = false;
    $scope.showGoogleReviews = false;
    $scope.showYelpReviews = false;

    $scope.show_item_place = undefined;
    $scope.showStreetView = false;
    $scope.startplace = "Your location";
    $scope.disableForGetDirection = false;

    $scope.scopeGoogleReviews = [];
    $scope.scopeYelpReviews = [];
    $scope.originGoogleReviews = [];
    $scope.originYelpReviews = [];


    $scope.GoogleOrYelp = "Google Reviews";
    $scope.favoriteData = []; // favorites data


    $scope.detailsBtnEnabled0 = true;
    $scope.detailsBtnEnabled1 = true;
    $scope.previousDetail = undefined;

    $scope.mainSearch = function(placekeyword,placedistance,placechosen,placelocation){
    	$scope.PROCESSING = true;
        
        $scope.NORECORDS = false;
        $scope.FAILING = false;
        $("#showLeftBtnid").attr("class","btn btn-primary");
        $("#showRighBtntid").attr("class","btn btn-default");
        $scope.showDetails = false;
        $scope.showFavorites = false;
        $scope.showResults = false;

        $scope.SHOW1 = false;
        $scope.SHOW2 = false;
        $scope.SHOW3 = false;
        $scope.SHOW4 = false;

        $scope.detailsBtnEnabled0 = true;
        $scope.detailsBtnEnabled1 = true;
        $scope.previousDetail = undefined;

    	$scope.latitude  = localLat;
    	$scope.longitude = localLon;

        var placecategory = document.getElementById("category").value;
        awsUrl = MY_SERVER_URL;
    	//awsUrl = "http://localhost/main.php?"
        //awsUrl = "http://localhost:8888/user?"
    	//awsUrl = "http://wangby511.us-west-1.elasticbeanstalk.com/main.php?";
    	awsUrl += "placeChosen="     + placechosen;
    	awsUrl += "&placeKeyword="   + placekeyword;
    	awsUrl += "&placeLocation="  + placelocation;
    	awsUrl += "&placeCategory="  + placecategory;
    	awsUrl += "&placeDistance="  + placedistance;
    	awsUrl += "&placeLatitude="  + $scope.latitude;
    	awsUrl += "&placeLongitude=" + $scope.longitude;
    	

    	$http({
            method: 'GET',
            url: awsUrl
            //headers : {'Access-Control-Allow-Origin':'*'}

        }).then(function successCallback(response) {
            //alert("Get back from : " + awsUrl);
            $scope.PROCESSING = false;
            $scope.showFavorites = false;
            $scope.data[0] = response.data.results;
            if(response.data.results == "" || response.data.results == undefined){
                $scope.NORECORDS = true;
            }else{
                $scope.showResults = true;
            }
            $scope.data[1] = undefined;
            $scope.data[2] = undefined;

            $scope.nextPage[0] = response.data.next_page_token;
            $scope.nextPage[1] = undefined;
            $scope.nextPage[2] = undefined;

            $scope.showingData = response.data.results;
            favoriteList = JSON.parse(localStorage.getItem("LocalStorageFavoriteList"));

            //var alertstring = "";
            for(var i = 0;i < $scope.showingData.length; i++){
                $scope.showingData[i].highlightstyle = "";
                if($scope.checkFavorite($scope.showingData[i].place_id)){
                    $scope.showingData[i].isFavor = true;
                    $scope.showingData[i].favorbtnstyle = "glyphicon-star";
                    //alertstring = alertstring + i + "," + $scope.showingData[i].isFavor + "\n";
                }else {
                    $scope.showingData[i].isFavor = false;
                    $scope.showingData[i].favorbtnstyle = "glyphicon-star-empty";
                    //alertstring = alertstring + i + "," + $scope.showingData[i].isFavor + "\n";
                }
            }
            //alert(alertstring);
            $scope.pageNumber = 0;
            $scope.showPreviousButton = false;
            if($scope.nextPage[0] != undefined){
          	  $scope.showNextButton = true;
            }else{
          	  $scope.showNextButton = false;
            }
            //alert($scope.showingData[0].name);
        },function errorCallback(response) {
            $scope.PROCESSING = false;
            $scope.FAILING = true;
        });
    }

    $scope.TOprev = function(){

    	$scope.pageNumber = $scope.pageNumber - 1;
    	$scope.showNextButton = true;
    	$scope.showingData = $scope.data[$scope.pageNumber];
    	if($scope.pageNumber == 1){
    		$scope.showPreviousButton = true;
    	}else if($scope.pageNumber == 0){
        	$scope.showPreviousButton = false;
        }
    }

    $scope.TOnext = function(){
        $scope.PROCESSING = true;
    	$scope.pageNumber = $scope.pageNumber + 1;
    	if($scope.data[$scope.pageNumber] == undefined){
    		awsUrl = MY_SERVER_URL;
    		awsUrl += "placeNextPageToken=" + $scope.nextPage[$scope.pageNumber - 1];
    		$http({
    			method: 'GET',
                url: awsUrl
            }).then(function successCallback(response) {

            	$scope.data[$scope.pageNumber] = response.data.results;
            	$scope.nextPage[$scope.pageNumber] = response.data.next_page_token;
            	$scope.PROCESSING = false;
                $scope.FAILING = false;
            	$scope.showingData = response.data.results;

                //var alertstring = "";
                for(var i = 0;i < $scope.showingData.length; i++){
                    $scope.showingData[i].highlightstyle = "";
                    if($scope.checkFavorite($scope.showingData[i].place_id)){
                        $scope.showingData[i].isFavor = true;
                        $scope.showingData[i].favorbtnstyle = "glyphicon-star";
                        //alertstring = alertstring + i + "," + $scope.showingData[i].isFavor + "\n";
                    }else {
                        $scope.showingData[i].isFavor = false;
                        $scope.showingData[i].favorbtnstyle = "glyphicon-star-empty";
                        //alertstring = alertstring + i + "," + $scope.showingData[i].isFavor + "\n";
                    }
                }
                //alert(alertstring);
                //$scope.showResults = true;
                $scope.showPreviousButton = true;
                if($scope.nextPage[$scope.pageNumber] == undefined){
                	$scope.showNextButton = false;
                }else{
                	$scope.showNextButton = true;
                }
            },function errorCallback(response) {
            	//alert("ERROR In Getting Next Page!");
                $scope.PROCESSING = false;
                $scope.FAILING = true;
            });
        } else {
        	$scope.PROCESSING = false;
        	$scope.showingData = $scope.data[$scope.pageNumber];
        	//$scope.showResults = true;
            $scope.showPreviousButton = true;
            if($scope.nextPage[$scope.pageNumber] == undefined){
            	$scope.showNextButton = false;
            }else{
            	$scope.showNextButton = true;
            }
            //alert("TOnext , already get data , pageNumber = "+$scope.pageNumber);
        }

    }

    $scope.clear = function(){
    	$scope.showResults = false;
    	$scope.showFavorites = false;
    	$scope.showDetails = false;
        $scope.placekeyword = "";
        $scope.placelocation = "";
        $scope.placedistance = "";
        $("#optionsRadios1").click();
        $("#showLeftBtnid").attr("class","btn btn-primary");
        $("#showRighBtntid").attr("class","btn btn-default");
        $("#SearchButton").attr('disabled',true);
        $scope.NORECORDS = false;
        $scope.FAILING = false;
    }

    $scope.showback = function(){
        $scope.showDetails = false;
        if($scope.previous == 0){
            $scope.showLeft();
        }else{
            $scope.showRight();
        }

    }

    $scope.showLeft = function(){
        $("#showLeftBtnid").attr("class","btn btn-primary");
        $("#showRighBtntid").attr("class","btn btn-default");
        $scope.showDetails = false;
        $scope.showFavorites = false;
        
        var tempshowingData = $scope.showingData;
        if(tempshowingData.length == 0){
            $scope.NORECORDS = true;
        }else{
            $scope.NORECORDS = false;
            $scope.showResults = true;
        } 
    }

    $scope.showRight = function(){
        $("#showRighBtntid").attr("class","btn btn-primary");
        $("#showLeftBtnid").attr("class","btn btn-default"); 
        $scope.showResults = false;
        $scope.showDetails = false;
        //favoriteList = localStorage.getItem("LocalStorageFavoriteList");
        //alert("favoriteList = " + favoriteList + ",length = " + favoriteList.length);
        if(favoriteList.length == 0){
            $scope.NORECORDS = true;
        }else{
            $scope.NORECORDS = false;
            $scope.showFavorites = true;
            $scope.favoriteData = favoriteList;

        }
    }

    $scope.goToDetailsAgain = function(x){
        $scope.TOshowDetails($scope.previousDetail,x);
    }

    $scope.changeHighLightStyle = function(item){
        
        // for(var i = 0;i < $scope.showingData.length; i++){
        //     if($scope.showingData[i].place_id == item.place_id){
        //         $scope.showingData[i].highlightstyle = "highlightstyle";
        //     }else if ($scope.previousDetail != undefined && $scope.showingData[i].place_id == $scope.previousDetail.place_id){
        //         $scope.showingData[i].highlightstyle = "";
        //     }
        // }
        $scope.detailsBtnEnabled0 = false;
        for(var i = 0; i < $scope.data.length; i++){
            var pData = $scope.data[i];
            if( pData == undefined )continue;
            for(var j = 0; j < pData.length; j++){
                if(pData[j].place_id == item.place_id){
                    pData[j].highlightstyle = "highlightstyle";
                }else if ($scope.previousDetail != undefined && pData[j].place_id == $scope.previousDetail.place_id){
                    pData[j].highlightstyle = "";
                }  
            }
        }

        $scope.detailsBtnEnabled1 = true;
        for(var i = 0;i < $scope.favoriteData.length; i++){
            if($scope.favoriteData[i].place_id == item.place_id){
                $scope.favoriteData[i].highlightstyle = "highlightstyle";
                $scope.detailsBtnEnabled1 = false;
            }else if ($scope.previousDetail != undefined && $scope.favoriteData[i].place_id == $scope.previousDetail.place_id){
                $scope.favoriteData[i].highlightstyle = "";
            }
        }
    }

    $scope.TOshowDetails = function(item,from){

        $scope.showResults = false;
        $scope.showFavorites = false;
        $scope.showDetails = true;

        if(from == 0){
            $scope.previous = 0;
        }else if(from == 1){
            $scope.previous = 1;
        }

        $scope.changeHighLightStyle(item);

        $scope.detailingData = item;
        $scope.previousDetail = $scope.detailingData;

        if($scope.checkFavorite(item.place_id)){
            $scope.detailingData.isFavor = true;
            $scope.detailingData.favorbtnstyle = "glyphicon-star";
        }else {
            $scope.detailingData.isFavor = false;
            $scope.detailingData.favorbtnstyle = "glyphicon-star-empty";
        }

        $scope.SHOW1 = false;
        $scope.SHOW2 = false;
        $scope.SHOW3 = false;
        $scope.SHOW4 = false;

        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: localLat, lng: localLon},
            zoom: 13
        });

        var infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        
        service.getDetails({
            placeId: item.place_id
        }, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                $scope.FAILING = false;
                //document.getElementById('final_result').innerHTML = place;
                $scope.show_item_place = place;
                destination = place.geometry.location;
                //Yelpname = place.name;
                $scope.createMainTable();
                //
                $scope.createPhotos();
                //
                $scope.showStreetView = false;
                $scope.createMap();
                //
                addressComponents = place.address_components;
                googleReviews = place.reviews;
                $scope.initReviews();
                //
                document.getElementById('Info').click();
                $scope.SHOW1 = true;
                $scope.SHOW2 = false;
                $scope.SHOW3 = false;
                $scope.SHOW4 = false;
                //alert(place.formatted_address);
            }else{
                $scope.FAILING = true;
                //alert("Error In Getting Details!");
            }
        });   
    }

    $scope.AddOrRemoveFavoriteList = function(item){
        
        if(item.isFavor == false){
            item.isFavor = true;
            item.favorbtnstyle = "glyphicon-star";

            favoriteList = JSON.parse(localStorage.getItem("LocalStorageFavoriteList"));
            favoriteList.push({icon:item.icon, name:item.name, vicinity:item.vicinity, place_id:item.place_id, isFavor:true}); 
            $scope.favoriteData = favoriteList;
            localStorage.setItem("LocalStorageFavoriteList",JSON.stringify(favoriteList));

            for(var i = 0;i < $scope.favoriteData.length; i++){
                if($scope.favoriteData[i].place_id == $scope.previousDetail.place_id){
                    $scope.favoriteData[i].highlightstyle = "highlightstyle";
                }
            }
        }else{
            $scope.DeleteFavorite(item);
        }
    }

    $scope.checkFavorite = function(placeID){
        //favoriteList = JSON.parse(localStorage.getItem("LocalStorageFavoriteList"));
        for(var i = 0;i < favoriteList.length; i++){

            if(favoriteList[i]['place_id'] == placeID)return true;
        }
        return false;
    }

    // $scope.check2Favorite = function(item){
    //     alert(item.isFavor + ", btnstyle = " + item.favorbtnstyle);
    // }

    // $scope.checkngclick= function(item){
    //     alert("yes!");
    // }

    $scope.DeleteFavorite = function(item){

        favoriteList = JSON.parse(localStorage.getItem("LocalStorageFavoriteList"));
        item.isFavor = false;
        item.favorbtnstyle = "glyphicon-star-empty";
        //item.highlightstyle = "";
        var newfavoriteList = new Array();
        for(var i = 0;i < favoriteList.length; i++){
            if(favoriteList[i]['place_id'] == item.place_id)continue;
            newfavoriteList.push(favoriteList[i]);
        }
        favoriteList = newfavoriteList;
        $scope.favoriteData = favoriteList;
        localStorage.setItem("LocalStorageFavoriteList",JSON.stringify(favoriteList));

        //deal with the results data
        var allData = $scope.data;
        for(var i = 0; i < allData.length; i++){
            var pData = allData[i];
            if( pData == undefined )continue;
            for(var j = 0; j < pData.length; j++){
                if(pData[j].place_id == item.place_id){
                    pData[j].isFavor = false;
                    pData[j].favorbtnstyle = "glyphicon-star-empty";
                }
            }
        }
        //alert("RemoveFavoriteList : " + item.place_id + ", length = " + favoriteList.length);
        

    }

    $scope.initReviews = function(){
        $scope.GoogleOrYelp = "Google Reviews";
        $scope.SortMethod = "Default Order";
        $scope.createGoogleReviews();
        $scope.createYelpReviews();
        $scope.showGoogleReviews = true;
        $scope.showYelpReviews = false;
    }

    $scope.changeReviews = function(x){
        $scope.reivew_NORECORDS = false;
        if(x == 1){
            $scope.GoogleOrYelp = "Google Reviews";
            $scope.showGoogleReviews = true;
            $scope.showYelpReviews = false;
            if(googleReviews == undefined || googleReviews.length == 0){
                $scope.reivew_NORECORDS = true;
            }
        }else if(x == 2){
            $scope.GoogleOrYelp = "Yelp Reviews";
            $scope.showGoogleReviews = false;
            $scope.showYelpReviews = true;
            if(yelpReviews == undefined || yelpReviews.length == 0){
                $scope.reivew_NORECORDS = true;
            }
        }
    }

    $scope.createGoogleReviews = function(){
        $scope.scopeGoogleReviews  = [];
        $scope.originGoogleReviews = [];
        if(googleReviews == undefined || googleReviews.length == 0){
            $scope.reivew_NORECORDS = true;
        }else{
            $scope.reivew_NORECORDS = false;
            for(var i = 0 ;i < googleReviews.length; i++){
                $scope.originGoogleReviews.push({
                    author:googleReviews[i].author_url,
                    profile_photo:googleReviews[i].profile_photo_url,
                    name:googleReviews[i].author_name,
                    rating:googleReviews[i].rating,
                    widthOfStars:googleReviews[i].rating * 15,
                    text:googleReviews[i].text,
                    time:moment.unix(googleReviews[i].time).format('YYYY-MM-DD HH:mm:ss')
                });
                $scope.scopeGoogleReviews.push({
                    author:googleReviews[i].author_url,
                    profile_photo:googleReviews[i].profile_photo_url,
                    name:googleReviews[i].author_name,
                    rating:googleReviews[i].rating,
                    widthOfStars:googleReviews[i].rating * 15,
                    text:googleReviews[i].text,
                    time:moment.unix(googleReviews[i].time).format('YYYY-MM-DD HH:mm:ss')
                });
            }
        }
    }

    $scope.createYelpReviews = function(){
        $scope.scopeYelpReviews = [];
        $scope.originYelpReviews = [];
        searchYelpName =  $scope.show_item_place.name;
        var searchYelpCity = "Los Angeles";
        var searchYelpState = "CA";
        var searchYelpCountry = "US";
        var searchYelpAddress1 = "";
        var temp = $scope.show_item_place.address_components;
        for (var i = 0; i < temp.length; i++) {
            var type = temp[i].types[0];
            if(type == "administrative_area_level_1" && temp[i].short_name != undefined){
                searchYelpState = temp[i].short_name;
            }else if (type == "locality" && temp[i].short_name != undefined){
                searchYelpCity = temp[i].short_name;
            }else if (type == "street_address" && temp[i].short_name != undefined){
                searchYelpAddress1 = temp[i].short_name;
            }
        }
        //var YelpURL = "http://cs-server.usc.edu:19753/HW8/main.php?"
        var YelpURL = MY_SERVER_URL;
        YelpURL += "searchYelpName=" + searchYelpName;
        YelpURL += "&searchYelpCity=" + searchYelpCity;
        YelpURL += "&searchYelpState=" + searchYelpState;
        YelpURL += "&searchYelpCountry=" + searchYelpCountry;
        if(searchYelpAddress1 != "" && searchYelpAddress1 != undefined)
            YelpURL += "&searchYelpAddress1=" + searchYelpAddress1;
        //alert("YelpURL = " + YelpURL);
        $http({
            method: 'GET',
            url: YelpURL   
        }).then(function successCallback(response) {
            var yelpdata = response.data;
            if (yelpdata.length != 0){
                yelpReviews = yelpdata;
                for(var i = 0 ;i < yelpReviews.length; i++){
                    //alert(yelpReviews[i].url);
                $scope.originYelpReviews.push({
                    author_url:  yelpReviews[i].url,
                    image_url:   yelpReviews[i].user.image_url,
                    user_name:   yelpReviews[i].user.name,
                    rating:      yelpReviews[i].rating,
                    widthOfStars:yelpReviews[i].rating * 15,
                    text:        yelpReviews[i].text,
                    time:        yelpReviews[i].time_created
                });
                $scope.scopeYelpReviews.push({
                    author_url:  yelpReviews[i].url,
                    image_url:   yelpReviews[i].user.image_url,
                    user_name:   yelpReviews[i].user.name,
                    rating:      yelpReviews[i].rating,
                    widthOfStars:yelpReviews[i].rating * 15,
                    text:        yelpReviews[i].text,
                    time:        yelpReviews[i].time_created
                });
            }
            }  
        }, function errorCallback(response) {
            alert("Error For Getting Yelp Reviews!");
        });

    }

    $scope.createMap = function(){
        document.getElementById('bottom-panel').innerHTML = "";
        document.getElementById('travelmode').options[0].selected = "true";

        if($scope.placechosen == "option2"){
            //alert("yes!for o2");
            $scope.startplace = $("#locationid").val();
        }
        
        $scope.endplace = $scope.detailingData.name + "," + $scope.show_item_place.formatted_address;
        map = new google.maps.Map(document.getElementById('map'), {
            center: destination,
            zoom: 13
        });      
        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: true,
            map: map,
            panel: document.getElementById('bottom-panel')
        });
        var marker = new google.maps.Marker({
            map: map,
            position: destination
        });
    }

    $scope.createStreetView = function(){
        var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('map'), {
                position: destination,
                pov: {
                    heading: 34,
                    pitch: 10
                }
            });
        map.setStreetView(panorama);
    }

    $scope.changeView = function(){
        if($scope.showStreetView == false){
            $scope.showStreetView = true;
            $("#viewmapbtn2").attr("src","http://cs-server.usc.edu:45678/hw/hw8/images/Map.png");
            $scope.createStreetView();

        }else{
            $scope.showStreetView = false;
            $("#viewmapbtn2").attr("src","http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png");
            $scope.createMap();
        }
    }
    $scope.checkInputBtninMap = function(){

        if($scope.startplace == ""){
            $scope.disableForGetDirection = true;
            //alert("checkInputBtninMap() ->" + $scope.startplace + "<-");
        }else {
            $scope.disableForGetDirection = false;
        }
    }

    $scope.goThere = function(){
        document.getElementById('bottom-panel').innerHTML = "";
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': $scope.startplace}, function(results, status) {
            if (status === 'OK') {
                startlocation = results[0].geometry.location;
                if($scope.startplace == "Your location"){
                    startlocation = {lat: localLat, lng: localLon};
                }
                directionsDisplay.setMap(map);
                $scope.calculateAndDisplayRoute(directionsService, directionsDisplay);
            } else if($scope.startplace == "Your location"){
                startlocation = {lat: localLat, lng: localLon};
                directionsDisplay.setMap(map);
                $scope.calculateAndDisplayRoute(directionsService, directionsDisplay);
            } else{
                alert('Geocode not found for the input: ' + $scope.startplace);
            }
        });
        
    }

    $scope.calculateAndDisplayRoute = function(directionsService, directionsDisplay) {
        var travelmode = document.getElementById("travelmode").value;
        directionsService.route({
            origin: startlocation,
            destination: destination,
            travelMode: travelmode,
            provideRouteAlternatives:true
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                alert('Directions Request Failed Due to ' + status);
            }
        });
    }

    $scope.createPhotos = function(){
        photos = $scope.show_item_place.photos;
        //alert("photos = " + photos);
        if(photos == undefined || photos.length == 0){
            $scope.NORECORDS = true;
        }else{
            $scope.NORECORDS = false;
            $scope.new_photo_urls = [[],[],[],[]];
            for(var i = 0;i < photos.length;i++){
                $scope.new_photo_urls[i % 4].push(photos[i].getUrl({'maxWidth': 2000}));
            }
        }
    }

    $scope.toOrder = function(type){
        if($scope.GoogleOrYelp == "Google Reviews"){
            $scope.toOrderHelper(type,1);
        }else{
            $scope.toOrderHelper(type,2);
        }
    }

    $scope.toOrderHelper = function(type,y){
        var data;
        if(y == 1){
            data = $scope.scopeGoogleReviews;
        }else if (y == 2){
            data = $scope.scopeYelpReviews;
        }

        if (type == 1){
            $scope.SortMethod = "Default Order";
            if(y == 1){
                data = $scope.originGoogleReviews;
            }else if (y == 2){
                data = $scope.originYelpReviews;
            }
        }
        else if (type == 2){
            $scope.SortMethod = "Highest Rating";
            for (var i = 0; i < data.length; i++){
                var index = i;
                for (var j = i + 1; j < data.length; j++){
                    if (data[j].rating > data[i].rating){
                        index = j;
                    }
                }
                var temp = data[index];
                data[index] = data[i];
                data[i] = temp;
            }
        }else if (type == 3){
            $scope.SortMethod = "Lowest Rating";
            for (var i = 0; i < data.length; i++){
                var index = i;
                for (var j = i + 1; j < data.length; j++){
                    if (data[j].rating < data[i].rating){
                        index = j;
                    }
                }
                var temp = data[index];
                data[index] = data[i];
                data[i] = temp;
            }
        }else if (type == 4){
            $scope.SortMethod = "Most Recent";
            for (var i = 0; i < data.length; i++){
                var index = i;
                for (var j = i + 1; j < data.length; j++){
                    if (moment(data[j].time).valueOf() > moment(data[i].time).valueOf()){
                        index = j;
                    }
                }
                var temp = data[index];
                data[index] = data[i];
                data[i] = temp;
            }
        }else if (type == 5){
            $scope.SortMethod = "Least Recent";
            for (var i = 0; i < data.length; i++){
                var index = i;
                for (var j = i + 1; j < data.length; j++){
                    if (moment(data[j].time).valueOf() < moment(data[i].time).valueOf()){
                        index = j;
                    }
                }
                var temp = data[index];
                data[index] = data[i];
                data[i] = temp;
            }
        }
        if(y == 1){
            for(var i = 0;i < data.length;i++){
                $scope.scopeGoogleReviews[i] = data[i];
            }
        }else if (y == 2){
            for(var i = 0;i < data.length;i++){
                $scope.scopeYelpReviews[i] = data[i];
            }
        }
    }

    $scope.showInfo = function(){
        $scope.NORECORDS = false;
        document.getElementById("Info_li").setAttribute("class","active nav-item");
        document.getElementById("Photos_li").setAttribute("class","nav-item");
        document.getElementById("Map_li").setAttribute("class","nav-item");
        document.getElementById("Reviews_li").setAttribute("class","nav-item");
        
        $scope.SHOW1 = true;
        $scope.SHOW2 = false;
        $scope.SHOW3 = false;
        $scope.SHOW4 = false;
    }

    $scope.showPhotos = function(){
        $scope.NORECORDS = false;
        var tempphotos = $scope.show_item_place.photos;
        if(tempphotos == undefined || tempphotos.length == 0){
            $scope.NORECORDS = true;
        }
        document.getElementById("Info_li").setAttribute("class","nav-item");
        document.getElementById("Photos_li").setAttribute("class","active nav-item");
        document.getElementById("Map_li").setAttribute("class","nav-item");
        document.getElementById("Reviews_li").setAttribute("class","nav-item");
        $scope.SHOW1 = false;
        $scope.SHOW2 = true;
        $scope.SHOW3 = false;
        $scope.SHOW4 = false;
    }

    $scope.showMap = function(){
        $scope.NORECORDS = false;
        document.getElementById("Info_li").setAttribute("class","nav-item");
        document.getElementById("Photos_li").setAttribute("class","nav-item");
        document.getElementById("Map_li").setAttribute("class","active nav-item");
        document.getElementById("Reviews_li").setAttribute("class","nav-item");
        $scope.SHOW1 = false;
        $scope.SHOW2 = false;
        $scope.SHOW3 = true;
        $scope.SHOW4 = false;
    }

    $scope.showReviews = function(){
        document.getElementById("Info_li").setAttribute("class","nav-item");
        document.getElementById("Photos_li").setAttribute("class","nav-item");
        document.getElementById("Map_li").setAttribute("class","nav-item");
        document.getElementById("Reviews_li").setAttribute("class","active nav-item");
        $scope.SHOW1 = false;
        $scope.SHOW2 = false;
        $scope.SHOW3 = false;
        $scope.SHOW4 = true;
        if($scope.reivew_NORECORDS == true)$scope.NORECORDS = true;
        else $scope.NORECORDS = false;
    }

    $scope.createMainTable = function(){
        //alert("createMainTable!");
        var obj = $scope.show_item_place;
        //1.
        if (obj.formatted_address == undefined){
            $scope.hide_address = true;
        }else{
            //alert($scope.show_item_place.formatted_address);
            $scope.hide_address = false;    
            $scope.this_item_address = obj.formatted_address;
        }
        
        //2.
        if (obj.international_phone_number == undefined){
            $scope.show_phone = true;
        }else{
            $scope.show_phone = false;
            $scope.this_item_phone = obj.international_phone_number;
        }

        //3.
        if (obj.price_level == undefined){
            $scope.show_pricelevel = true;
        }else{
            $scope.show_pricelevel = false;
            $scope.this_item_pricelevel = "";
            for(var i = 0;i < obj.price_level;i++)
                $scope.this_item_pricelevel += "$";
        }

        //4.
        if (obj.rating == undefined){
            $scope.show_rating = true;
        }else{
            $scope.show_rating = false;
            $scope.this_item_rating = obj.rating;
            $scope.this_item_rating_width = obj.rating * 15;
        }

        //5.google page
        if (obj.url == undefined){
            $scope.show_url = true;
        }else{
            $scope.show_url = false;
            $scope.this_item_url = obj.url;
        }

        //6.website
        if (obj.website == undefined){
            $scope.show_website = true;
        }else{
            $scope.show_website = false;
            $scope.this_item_website = obj.website;
        }

        //7.opening_hours
        if (obj.opening_hours == undefined){
            $scope.show_opening_hours = true;
        }else{
            $scope.show_opening_hours = false;
            $scope.this_item_opening_hours = obj.opening_hours;

            var day = moment().days();
            var opentime = obj.opening_hours.weekday_text;
            //alert("day = " + day + "," + opentime[(day + 6 ) % 7]);

            var todayindex = ( day + 6 ) % 7;

            $scope.today         = opentime[todayindex].split(": ")[0];
            $scope.todayOpenTime = opentime[todayindex].split(": ")[1];

            if (obj.opening_hours.open_now) 
                $scope.openOrNot = "Open now " + $scope.todayOpenTime;
            else
                $scope.openOrNot = "Closed";

            $scope.showTimeInModal = [];
            for (var i = 1; i < 7; i++){
                var j = (i + todayindex) % 7;
                $scope.showTimeInModal.push({name:opentime[j].split(": ")[0], time:opentime[j].split(": ")[1]});
            }
        }
    }

    $scope.TWITTER = function(){
        var twitterword = "Check out " + $scope.show_item_place.name + " located at "+ $scope.show_item_place.formatted_address + ". Website: " + $scope.show_item_place.website;
        var twitterurl = 'https://twitter.com/intent/tweet?text='+ twitterword +'&hashtags=TravelAndEntertainmentSearch';
        //alert("MYURL = " + twitterurl);
        window.open(twitterurl, "Share a link on Twitter",'height=500,width=500,top=50,left=50,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes');
    }




    }]);

})();