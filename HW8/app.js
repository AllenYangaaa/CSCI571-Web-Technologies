// header('content-type:application:json;charset=utf8');  
// header('Access-Control-Allow-Origin:*');  
// header('Access-Control-Allow-Methods:*');  
// header('Access-Control-Allow-Headers:x-requested-with,content-type');
//<?php header('Access-Control-Allow-Origin':"*"); ?>
var http = require("http");
var https = require('https');
var url = require('url');
//var util = require('util');
var MY_API_KEY1 = "AIzaSyDSLR3tvFUCdOPwFrbOhlOfv2ZWk4IYc7E";
var MY_API_KEY2 = "AIzaSyDtK77ffpHmX74uUppSWvTp5ZTdCH31d1c";
var apiKey = "Tjw-afeZxo8RUTKQtUMqL2b9InoeG2I8uRJLv3pWhb3cnN2FLmv1sjV89yBhSfXi1Hy3hSV5s1e1UvPixdHjLWqZ_RVk2PfjGR-MGiZJMzbic12zno-zc8T_xjm7WnYx";
var finaljson = "";
var finaljson2 = "";
http.createServer(function(req, res) {
    res.writeHeader(200,{
        'content-type':'application/json',
        'Access-Control-Allow-Origin' : '*'
    });
	//res.writeHead(200, {'Content-Type': 'application/json'});
    //1
	var params = url.parse(req.url, true).query;
    var send_chosen     = params.placeChosen;
    var final_keyword   = params.placeKeyword;
    var final_location  = params.placeLocation;
    var final_category  = params.placeCategory;
    var final_distance  = params.placeDistance;
    var final_latitude  = params.placeLatitude;
    var final_longitude = params.placeLongitude;
    //2
    var final_placeNextPageToken = params.placeNextPageToken;
    //3
    var YelpName = params.searchYelpName;
    var YelpCity     = params.searchYelpCity;
    var YelpState    = params.searchYelpState;
    var YelpCountry  = params.searchYelpCountry;
    var YelpAddress1  = params.searchYelpAddress1;
    var YelpAddress2  = params.searchYelpAddress2;

    if( isNaN(final_distance) || final_distance == undefined || final_distance == 0)final_distance = 16090;
    else final_distance = final_distance * 1609;
    //console.log("final_distance = " + isNaN(final_distance) + ", then = " + final_distance);

    if(send_chosen == "option2"){
    	var URL1 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + final_location + "&key=" + MY_API_KEY1;
        console.log("URL1 = " + URL1);
        https.get(URL1, function (res) {
            var json = '';
        res.on('data', function (d) {
            json += d;
        });
        res.on('end',function(){
            json = JSON.parse(json);
            console.log(json.results[0].geometry.location.lat);
            console.log(json.results[0].geometry.location.lng);
            final_latitude = json.results[0].geometry.location.lat;
            final_longitude = json.results[0].geometry.location.lng;
            var URL2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + final_latitude + "," + final_longitude;
            URL2 += "&radius=" + final_distance;
            URL2 += "&type=" + final_category;
            URL2 += "&keyword=" + final_keyword;
            URL2 += "&key=" + MY_API_KEY2;
            //res.write("URL2 = " + URL2 + "\n");
            console.log("option2 URL = " + URL2 + "\n");
            https.get(URL2, function (response) {
                //res.header("Access-Control-Allow-Origin", "*");
                var json = '';
                response.on('data', function (d) {
                    json += d;
                });
                response.on('end',function(){
                    json = JSON.parse(json);
                    console.log("option2 json.results.length = " + json.results.length + "\n");
                    finaljson =  json;
                    //return JSON.stringify(finaljson);
                });
                }).on('error', function (e) {
                    console.error(e);
                });
            });
            }).on('error', function (e) {
                console.error(e);
            });	
        //console.log("----------------------------end------------------------------");
            //res.end(JSON.stringify(finaljson));
    } else if (send_chosen == "option1") {
        var URL2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + final_latitude + "," + final_longitude;
            URL2 += "&radius=" + final_distance;
            URL2 += "&type=" + final_category;
            URL2 += "&keyword=" + final_keyword;
            URL2 += "&key=" + MY_API_KEY2;
            //res.write("URL2 = " + URL2 + "\n");
            console.log("option1 URL = " + URL2);
            https.get(URL2, function (response) {
                //res.header("Access-Control-Allow-Origin", "*");
                var json = '';
                response.on('data', function (d) {
                    json += d;
                });
                response.on('end',function(){
                    json = JSON.parse(json);
                    console.log("option1 json.results.length = " + json.results.length + "\n");
                    finaljson = json;
                    res.end(JSON.stringify(finaljson));
                });
                }).on('error', function (e) {
                    console.error(e);
                });
            //console.log("----------------------------end------------------------------");
                
    } else if (final_placeNextPageToken != undefined){
        var URL3 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=" + final_placeNextPageToken + "&key= " + MY_API_KEY2;
        console.log("option3 URL3 = " + URL3 + "\n");
        https.get(URL3, function (response) {
            var json = '';
            response.on('data', function (d) {
                json += d;
            });
            response.on('end',function(){
                json = JSON.parse(json);
                console.log("option3 results = " + json.results.length);
                finaljson = json;
                res.end(JSON.stringify(finaljson));
            });
            }).on('error', function (e) {
                console.error(e);
            });
    }else if(YelpName != undefined){
        const yelp = require('yelp-fusion');
        const client = yelp.client(apiKey);
        // client.businessMatch('lookup', {
        //     name: 'Pannikin Coffee & Tea',
        //     address1: '510 N Coast Hwy 101',
        //     address2: 'Encinitas, CA 92024',
        //     city: 'Encinitas',
        //     state: 'CA',
        //     country: 'US'
        client.businessMatch('lookup', {
            name: YelpName,
            address1: YelpAddress1,
            city: YelpCity,
            state: YelpState,
            country: YelpCountry
        }).then(response => {
            //console.log(response.jsonBody);
            console.log("option4 best result = " + response.jsonBody.businesses[0].id + "\n");
            var tempid = response.jsonBody.businesses[0].id;

            client.reviews(tempid).then(response2 => {
                console.log("option4-2 reviews result = " + response2.jsonBody.reviews);
                finaljson = response2.jsonBody.reviews;
                res.end(JSON.stringify(finaljson));
            }).catch(e2 => {
                console.log(e2);
            });
        }).catch(e => {
            console.log(e);
        });

    }
    //res.end()
}).listen(process.env.port || 3000);