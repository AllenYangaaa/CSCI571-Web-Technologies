
<?php
    //$hereOrOther="<script>document.write(hereOrOther1);</script>";
    //echo "hereOrOther = ",$hereOrOther;
    $MY_API_KEY1 = "AIzaSyDSLR3tvFUCdOPwFrbOhlOfv2ZWk4IYc7E";
                  //AIzaSyDSLR3tvFUCdOPwFrbOhlOfv2ZWk4IYc7E
    $MY_API_KEY2 = "AIzaSyDtK77ffpHmX74uUppSWvTp5ZTdCH31d1c";
                  //AIzaSyDtK77ffpHmX74uUppSWvTp5ZTdCH31d1c
    //$MY_API_KEY3 = "";
    if(isset($_POST["send_chosen"])){

        //echo "YES!";
        $_radius   = $_POST["send_radius"];
        //echo "<br />radius = ",$_radius;

        $_type     = $_POST["send_category"];
        //echo "<br />type = ",$_type;

        $_keyword  = $_POST["send_keyword"];   
        //echo "<br />final keyword = ",$_keyword;  

        $final_radius = urlencode($_radius);
        if ($_radius == "")  $final_radius = 10 * 1609;
        else $final_radius = $final_radius * 1609; //meters -> miles

        $final_type = urlencode($_type);
        $final_keyword = urlencode($_keyword);

        $final_latitude  = $_POST["send_latitude"];
        //echo "<br />final latitude = ",$final_latitude; 

        $final_longitude = $_POST["send_longitude"];
        //echo "<br />final longitude = ",$final_longitude;

        $send_chosen = $_POST["send_chosen"];
        //echo "<br />send_chosen = ",$send_chosen; //c0:local;c1:otherplace

        $final_location = $_POST["send_location"];    
        $final_location = urlencode($final_location);
        //echo "<br />final_location = ",$final_location;
        
        // USE GOOGLE MAP API to get the latitude and longitude;c1
        if($send_chosen == "c1"){
            //echo "<br/>c1...<br />";

            $URL1 = "https://maps.googleapis.com/maps/api/geocode/json?address=$final_location&key=$MY_API_KEY1";
            $jsonStrContent1 = file_get_contents($URL1);
            $obj1 = json_decode($jsonStrContent1,false);
            $temp_results = $obj1->results;
            $final_latitude  = $temp_results[0]->geometry->location->lat;
            //echo "<br />final latitude = ",$final_latitude; 
            $final_longitude = $temp_results[0]->geometry->location->lng;
            //echo "<br />final longitude = ",$final_longitude;
            //print "<br />selected your own typing place:<br />";
            //print $_latitude;
            //print $_longitude;
            // JUST LOCAL API LOCATION.c0
            //print "<br />selected here :<br />";
            //print $_latitude;
            //print $_longitude;
        }
        //echo "<br />final latitude = ",$final_latitude; 
        //echo "<br />final longitude = ",$final_longitude;
        
        // USE Places API Web Service
        $URL2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$final_latitude,$final_longitude&radius=$final_radius&type=$final_type&keyword=$final_keyword&key=$MY_API_KEY2";
        $jsonStrContent2 = file_get_contents($URL2);
        $jsonStrContent2 = json_decode($jsonStrContent2 ,true);
        $jsonStrContent2['final_longitude'] = $final_longitude;
        $jsonStrContent2['final_latitude'] = $final_latitude;
        echo json_encode($jsonStrContent2);
        return;

    }else if(isset($_POST["place_id"])){
        $_place_id   = $_POST["place_id"];
        $final_place_id = urlencode($_place_id);
        $URL3 = "https://maps.googleapis.com/maps/api/place/details/json?placeid=$final_place_id&key=$MY_API_KEY2";
        $jsonStrContent3 = file_get_contents($URL3);
        $obj3 = json_decode($jsonStrContent3,true);
        //$obj_photos = $obj3["result"]["photos"];

        for($i = 0;$i < 5  && $i < sizeof($obj3["result"]["photos"]); $i++){
            $_maxwidth = $obj3["result"]["photos"][$i]["width"];
            $_photoreference = $obj3["result"]["photos"][$i]["photo_reference"];

            $URL_PHOTO = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=$_maxwidth&photoreference=$_photoreference&key=$MY_API_KEY2";
            $PHOTO_CONTENT = file_get_contents($URL_PHOTO);

            $MY_URL = "/home/scf-12/boyuanwa/apache2/htdocs/pictures_of_hw6/{$_photoreference}.jpeg";
            file_put_contents($MY_URL, $PHOTO_CONTENT);
            //echo $URL_PHOTO;
        }
        echo $jsonStrContent3;
        return;
    }

?>

<!DOCTYPE html>
<html>
<head>
<title>HOMEWORK 6 PHP</title>
<style type="text/css">
    #map1 {
        height: 400px;
        width: 400px;
        background-color: grey;
    }
    #map2 {
        background-color: grey;
    }
    div.main_block{
        text-align: center;
        background-color: #F8F8F8;
        border-width: 2px;
        width: 700px;
        border: solid;
        border-color: #D0D0D0;
        margin: auto;
    }
    table.main_table{
        margin-left: 1%;
        border-width: 1px;
        text-align: left;
    }
    #title{
        font-size: 20pt;
        font-style: italic;
        font-family: Libre Baskerville;
    }
    hr.hr1{
        border:none;
        color:#D0D0D0;
        border-top:2px solid #D0D0D0;
        width:96%;
    }
    tr.last{
        height:20px;
    }
    #final_content1{
        border-width: 1px;
        margin-left: 10%;
        margin-right: 10%;
        text-align: center;
    }
    #final_content2,#final_content3,#final_content4,#final_content5,#final_content6{
        border-width: 1px;
        margin-left: 20%;
        margin-right: 20%;
        text-align: center;
    }
    #final_content7{
        border-width: 1px;
        margin-left: 23%;
        margin-right: 23%;
        text-align: center;
    }
</style>
<script type="text/javascript">
    var mainURL = "http://cs-server.usc.edu:19753/HW6.php";

    var local_latitude_no;
    var local_longitude_no;

    function getOffsetTop(obj){
        var tmp = obj.offsetTop;
        var val = obj.offsetParent;
        while(val != null){
            tmp += val.offsetTop;
            val = val.offsetParent;
        }
        return tmp;
    }
    function getOffsetLeft(obj){
        var tmp = obj.offsetLeft;
        var val = obj.offsetParent;
        while(val != null){
            tmp += val.offsetLeft;
            val = val.offsetParent;
        }
        return tmp;
    }

    function init(){
        var urlForLocalAddress = "http://ip-api.com/json";
        var xmlhttp = null;
        if(window.XMLHttpRequest){
            xmlhttp = new XMLHttpRequest(); 
        }else {
            xmlhttp = new ActiveXObject("Microsoft.xmlhttp");
        }//var xmlhttp=new XMLHttpRequest(); 

        if(!xmlhttp){
            alert("NOT SUPPORTED ERROR!");
            return;
        }

        xmlhttp.open("post",urlForLocalAddress,false);
        xmlhttp.send();

        var json_decode = "ERROR!";
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var jsonDoc = xmlhttp.responseText;
            json_decode = JSON.parse(jsonDoc);
            //document.getElementById("final_content1").innerHTML = json_decode;
        } else{
            alert("Internet Connection Error!");
            return;
        }
        if (json_decode.lat != null && json_decode.lon != null){
            local_latitude_no = json_decode.lat;
            local_longitude_no = json_decode.lon;
            document.getElementById("submit_id").disabled="";//make search button able!
        } else {
            alert("Wrong API FOR 'http://ip-api.com/json!'");
            return;
        }
    }

    function on_submit(){
        return false;
    }

    var send_location = "";
    var send_latitude = "";
    var send_longitude = "";
    var send_radius =  "" ;
    var send_category = "";
    var send_keyword = "";
    var send_chosen = "";
    var _GooglePlaceData1 = "";
    var _GooglePlaceData2 = "";

    function Main() {


        var sendData = "";
        send_location = document.getElementById("otherplace").value;
        //send_latitude = document.getElementById("local_latitude").value;
        send_latitude = local_latitude_no;
        //send_longitude = document.getElementById("local_longitude").value; 
        send_longitude = local_longitude_no;
        send_radius =  document.getElementById("distance").value; 
        send_category = document.getElementById("category").value; 
        send_keyword = document.getElementById("keyword").value;
        if(send_keyword == "")
            return;
        if(send_chosen = document.getElementById("location1").checked){
            send_chosen = document.getElementById("location1").value;
        }else {
            send_chosen = document.getElementById("location2").value;
            if(send_location == "")
                return;
        }
        //document.main_form_name.submit();

        var myxmlhttp1;
        if(window.XMLHttpRequest){
            myxmlhttp1 = new XMLHttpRequest();
        }
        else if (window.ActiveXObject){
            myxmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (myxmlhttp1 == null){
            alert("Your browser does not support XMLHTTP.");
            return false;
        }
        myxmlhttp1.open("post", mainURL, true);//true;
        myxmlhttp1.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        myxmlhttp1.send(
            "send_chosen=" + send_chosen +
            "&send_location=" + send_location +
            "&send_latitude=" + send_latitude +
            "&send_longitude=" + send_longitude +
            "&send_radius=" + send_radius +
            "&send_category=" + send_category +
            "&send_keyword=" + send_keyword
        );
        // $.ajax({
        //     type:"POST",
        //     url:mainURL,
        //     dataType:"json",
        //     async : true,
        //     data:{searching:-1,
        //         send_chosen:sending_chosen,
        //         send_latitude:sending_latitude,
        //         send_longitude:sending_longitude,
        //         send_radius:sending_radius,
        //         send_category:sending_category,
        //         send_keyword:sending_keyword,
        //         send_location:sending_location
        //     },
        //     success:function(msg){
        //         alert("send successfully!");
        //     },
        //     error:function(msg){
        //         alert("send failure!");
        //     }
        // });
        myxmlhttp1.onreadystatechange = function() {

            if (myxmlhttp1.readyState == 4 && myxmlhttp1.status == 200){ 
                _GooglePlaceData1 = myxmlhttp1.responseText; 
                mainMakeTable(_GooglePlaceData1); 
                //document.getElementById("final_content8").innerHTML = "<b>_GooglePlaceData1:</b><br>" + _GooglePlaceData1;
            }
            else {
                //document.getElementById("final_content1").innerHTML = "<b>FIRST FALSE!</b>";
            }
        }

    }

    function clearInput(){
        document.getElementById("keyword").value = "";
        document.getElementById("otherplace").value = "";
        document.getElementById("distance").value = "";
        document.getElementById("location1").checked = "true";
        document.getElementById("otherplace").value = "";
                
        var type_chosen = document.getElementById("category");
        type_chosen[0].selected = "true"; //choose default;
        
        document.getElementById("final_content1").innerHTML = "";
        document.getElementById("final_content2").innerHTML = "";
        document.getElementById("final_content3").innerHTML = "";
        document.getElementById("final_content4").innerHTML = "";
        document.getElementById("final_content5").innerHTML = "";
        document.getElementById("final_content6").innerHTML = "";
        document.getElementById("final_content7").innerHTML = "";
    }
    function LeftSideMain(obj){
        var _index = obj.parentNode.parentNode.rowIndex;
        var place_name = obj.innerHTML;
        //alert(_index);
        var _GooglePlaceJsonData = JSON.parse(_GooglePlaceData1);
        var final_place_id = _GooglePlaceJsonData.results[_index - 1].place_id;
        var myxmlhttp2;
        if(window.XMLHttpRequest){
            myxmlhttp2 = new XMLHttpRequest();
        }
        else if (window.ActiveXObject){
            myxmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (myxmlhttp2 == null){
            alert("Your browser does not support XMLHTTP.");
            return false;
        }

        myxmlhttp2.open("post", mainURL, true);//true;
        myxmlhttp2.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        myxmlhttp2.send("place_id=" + final_place_id);
        myxmlhttp2.onreadystatechange = function() {
            if (myxmlhttp2.readyState == 4 && myxmlhttp2.status == 200){ 
                _GooglePlaceData2 = myxmlhttp2.responseText;
                //document.getElementById("final_content1").innerHTML = "";
                //document.getElementById("final_content2").innerHTML = "<b>_GooglePlaceData2:</b><br>" + _GooglePlaceData2;
                LeftSideHelper(_GooglePlaceData2,place_name);
            }else{
                //document.getElementById("final_content1").innerHTML = "<b>SECOND FALSE!</b>";
            }
        }
    }
    function LeftSideHelper(jsonDoc,place_name){
        if(jsonDoc == null || jsonDoc == "")
            return;
        var temp_data2 = JSON.parse(jsonDoc);
        var data = temp_data2.result;
        document.getElementById("final_content1").innerHTML = "<br><b>" + place_name + "</b>";

        document.getElementById("final_content2").innerHTML = "<br><br><font>click to show reviews</font>";
        document.getElementById("final_content3").innerHTML ="<img src='http://cs-server.usc.edu:45678/hw/hw6/images/arrow_down.png' width=30px onclick='showReviews()'/>";
        LeftSideHelperReviews(jsonDoc,place_name);

        document.getElementById("final_content5").innerHTML = "<br><font>click to show photos</font>";
        document.getElementById("final_content6").innerHTML ="<img src='http://cs-server.usc.edu:45678/hw/hw6/images/arrow_down.png' width=30px onclick='showPictures()'/>";
        LeftSideHelperPictures(jsonDoc,place_name);
        document.getElementById("map1").style.display = 'none';
        document.getElementById("map2").style.display = 'none';
        //document.getElementById("final_content8").innerHTML = _GooglePlaceData2;
    }



    function LeftSideHelperReviews(jsonDoc,place_name){
        var temp_data3 = JSON.parse(jsonDoc);
        var data = temp_data3.result;
        htmlContent = "<table border='1' cellspacing='0' bordercolor='#D0D0D0' width = '80%' style = 'margin-left:auto;margin-right: auto;text-align:center;'>";

        if (!data.reviews || data.reviews.length == 0){   
            htmlContent += "<tr><th style='text-align:center;'><font style='text-align:center;font-size: 20px;'>No Reviews Found</font></th></table>";
        }else{
            for (var i = 0; i < data.reviews.length && i < 5; i++){
                htmlContent += "<tr><th style='text-align:center;'><img src='"+data.reviews[i].profile_photo_url+"' width='30px'/>";
                htmlContent += data.reviews[i].author_name+"</th></tr>";
                htmlContent += "<tr><td style='text-align:left;'>"+data.reviews[i].text+"</td></tr>";
            }
            htmlContent +="</table>";
        }
        document.getElementById("final_content4").innerHTML = htmlContent;
    }

    function LeftSideHelperPictures(jsonDoc,place_name){
        var temp_data4 = JSON.parse(jsonDoc);
        var data = temp_data4.result;
        htmlContent = "<table border='1' cellspacing='0' bordercolor='#D0D0D0' width = '80%' style = 'margin-left:auto;margin-right: auto;text-align:center;'>";

        if (!data.photos || data.photos.length == 0){   
            htmlContent += "<tr><th style='text-align:center;'><font style='text-align:center;font-size: 20px;'>No Photos Found</font></th></table>";
        }else{
            for (var i = 0; i < data.photos.length && i < 5; i++){
                htmlContent += "<tr><th style='text-align:center;'><br /><img src='http://cs-server.usc.edu:19753/pictures_of_hw6/"+data.photos[i].photo_reference+".jpeg' width = '95%' onclick='window.open(this.src);'/><br /></th></tr>";
            }
            htmlContent +="</table>";
        }
        document.getElementById("final_content7").innerHTML = htmlContent;
        previous_index = -1;

    }

    function showReviews(){
        document.getElementById("final_content3").innerHTML ="<img src='http://cs-server.usc.edu:45678/hw/hw6/images/arrow_up.png' width=30px onclick='hideReviews()'/>";
        document.getElementById("final_content4").style.display = '';
        document.getElementById("final_content6").innerHTML ="<img src='http://cs-server.usc.edu:45678/hw/hw6/images/arrow_down.png' width=30px onclick='showPictures()'/>";
        document.getElementById("final_content7").style.display = 'none';
    }

    function hideReviews(){
        document.getElementById("final_content3").innerHTML ="<img src='http://cs-server.usc.edu:45678/hw/hw6/images/arrow_down.png' width=30px onclick='showReviews()'/>";
        document.getElementById("final_content4").style.display = 'none';
    }

    function showPictures(){
        document.getElementById("final_content3").innerHTML ="<img src='http://cs-server.usc.edu:45678/hw/hw6/images/arrow_down.png' width=30px onclick='showReviews()'/>";
        document.getElementById("final_content4").style.display = 'none';
        document.getElementById("final_content6").innerHTML ="<img src='http://cs-server.usc.edu:45678/hw/hw6/images/arrow_up.png' width=30px onclick='hidePictures()'/>";
        document.getElementById("final_content7").style.display = '';
    }

    function hidePictures(){
        document.getElementById("final_content6").innerHTML ="<img src='http://cs-server.usc.edu:45678/hw/hw6/images/arrow_down.png' width=30px onclick='showPictures()'/>";
        document.getElementById("final_content7").style.display = 'none';
    }

    var to_latitude;//global values
    var to_longitude; 
    var previous_index;

    function showMap(obj){
        var _index = obj.parentNode.parentNode.rowIndex;
        if(document.getElementById("map1").style.display == '' && previous_index == _index){
            document.getElementById("map1").style.display = 'none';
            document.getElementById("map2").style.display = 'none';
            return;
        }
        //destination
        previous_index = _index;
        to_latitude = JSON.parse(_GooglePlaceData1).results[_index].geometry.location.lat;
        to_longitude = JSON.parse(_GooglePlaceData1).results[_index].geometry.location.lng;
        //curent
        local_latitude_no   = JSON.parse(_GooglePlaceData1).final_latitude;
        local_longitude_no = JSON.parse(_GooglePlaceData1).final_longitude;

        var position_top = getOffsetTop(obj) + 20;
        var position_left = getOffsetLeft(obj);
        document.getElementById("map1").style.position = 'absolute';
        document.getElementById("map1").style.display = 'block';
        document.getElementById("map1").style.top = position_top.toString() + "px";
        document.getElementById("map1").style.left = position_left.toString() + "px";
        document.getElementById("map1").style.display = '';
        document.getElementById("map2").style.display = '';
        document.getElementById("map2").style.position = 'absolute';
        document.getElementById("map2").style.display = 'block';
        document.getElementById("map2").style.top = position_top.toString() + "px";
        document.getElementById("map2").style.left = position_left.toString() + "px";
        //var clickHandler = function(){
        //    alert('您点击了地图');
        //}
        //document.getElementById("map1").addEventListener("click", function(e) {
        //    //alert('CLICK!!!');
        //    document.getElementById("map1").style.display = 'none';
        //    document.getElementById("map2").style.display = 'none';
        //});
        
        togo = {lat: to_latitude, lng: to_longitude};

        var map = new google.maps.Map(document.getElementById("map1"), {
           zoom: 14,
           center: togo
        });
        var marker = new google.maps.Marker({
           position: togo,
           map: map
        });

    }

    function goThere(model){
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var map = new google.maps.Map(document.getElementById("map1"), {
            zoom: 14,
            center: togo
        });
        directionsDisplay.setMap(map);
        var selectedMode = model.toString();
        var x1 = new google.maps.LatLng(local_latitude_no,local_longitude_no);
        var x2 = new google.maps.LatLng(to_latitude,to_longitude);
        var request = {
            origin: x1,
            destination: x2,
            travelMode: google.maps.TravelMode[selectedMode]
        };
        directionsService.route(request, function(response, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
            }else{
                alert("error in map.");
            }
        });

    }

    function mainMakeTable(jsonDoc){
        if(jsonDoc == null || jsonDoc == "")
            return;
        var temp_data1 = JSON.parse(jsonDoc);
        var data = temp_data1.results;
        if (data.length == 0){
            document.getElementById("final_content1").innerHTML="<br /><div style = 'background-color:#E0E0E0'><b>No Records has been found</b></div>";
            return;
        }
        var htmlContent = "<br / >";
        htmlContent += "<table id='result_table' border='1' width = '100%' cellspacing='0' bordercolor='#D0D0D0' style='text-align:left;'>";
        htmlContent += "<tr><th>Category</th><th>Name</th><th>Address</th></tr>";
        for (var i = 0; i < data.length; i++){
            htmlContent += "<tr>";
            htmlContent += "<td width = '10%'><img src='" + data[i].icon + "'height = '50'></td>"; 
            htmlContent += "<td width = '45%'><a style='color:black;text-decoration:none;' onclick = 'LeftSideMain(this)' href='javascript:void(0);' >"+ data[i].name +"</a></td>"; 
            htmlContent += "<td width = '45%'><a style='color:black;text-decoration:none;' onclick = 'showMap(this)' href='javascript:void(0);' >"+ data[i].vicinity + "</a></td>"; 
            htmlContent += "</tr>";
        }
        htmlContent += "</table>";
        document.getElementById("final_content1").innerHTML = htmlContent;
        document.getElementById("final_content2").innerHTML = "";
        document.getElementById("final_content3").innerHTML = "";
        document.getElementById("final_content4").innerHTML = "";
        document.getElementById("final_content5").innerHTML = "";
        document.getElementById("final_content6").innerHTML = "";
        document.getElementById("final_content7").innerHTML = "";
        document.getElementById("final_content8").innerHTML = "";
        document.getElementById("map1").style.display = 'none';
        document.getElementById("map2").style.display = 'none';


    }
    function helper1(){
        document.getElementById("otherplace").disabled = "true";
        document.getElementById("otherplace").required = "false";
    }
    function helper2(){
        document.getElementById("otherplace").disabled = "";
    }

    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDtK77ffpHmX74uUppSWvTp5ZTdCH31d1c&callback=initMap">
    </script>
    </head>
<body onload="init()">
    <iframe name="votar" style="display:none;"></iframe>
    <div class="main_block">
    <form id="main_form" name = "main_form_name" method="post" onsubmit="return on_submit()" action="">
        <table class="main_table">
            <tr>
                <div>
                    <font id="title">Travel and Entertainment Search</font>
                </div>
            </tr>
            
            <div><hr class="hr1"/></div>
            
            <tr>
                <td>
                    <font><b>Keyword</b></font>
                </td>
                <td>
                    <input type="text" id="keyword" name="keyword_name" value="<?php echo $_keyword; ?>" required/>
                </td>
            </tr>
            <tr>
                <td>
                    <font><b>Category</b></font>
                </td>
                <td>
                    <select id="category" name="category_name">
                        <option selected value="default"      >default</option>
                        <option value="cafe"         >cafe</option>
                        <option value="bakery"       >bakery</option>
                        <option value="restaurant"   >restaurant</option>
                        <option value="beautysalon"  >beauty salon</option>
                        <option value="casino"       >casino</option>
                        <option value="movietheater" >movie theater</option>
                        <option value="lodging"      >lodging</option>
                        <option value="airport"      >air port</option>
                        <option value="trainstation" >train station</option>
                        <option value="subwaystation">subway station</option>
                        <option value="busstation"   >bus station</option>
                    </select>                   
                </td>
            </tr>
            
            <tr>
                <td>
                    <font><b>Distance (miles)</b></font>
                    <br /><br />
                </td>
                <td>
                    <input type="text" id="distance" name="distance_name" placeholder="10" value="<?php echo $_radius; ?>"/>
                    <br /><br />
                </td>
                <td>
                    <b>From</b>
                        <label>
                            <input name="location" type="radio" value="c0" id="location1" checked onchange= "helper1();"/>Here </label> <br />
                        <label style="margin-left:45px">
                            <input name="location" type="radio" value="c1" id="location2" onchange = "helper2();"/>
                            <input name="otherplace_name" required="true" type="text" id="otherplace" placeholder="location" value= "<?php echo $_location; ?>" disabled="disabled"/>
                        </label> 
                    
                </td>
            </tr>
            <tr></tr>
            <tr></tr>
            <tr>
                <td></td>
                <td>
                    <input id="submit_id" type="submit" name="submit_name" value="Search" onclick = "Main()" disabled="disabled" />
                    <input type="button" value="Clear" onclick="clearInput()"/>
                </td>
            </tr>
            <tr class="last"></tr>
        
        </table>
        </div>
        <div id="map1" style="display: none;"></div>
        <table id="map2" style="display: none;background-color:#F8F8F8;" >
            <tr ><th ><a class="getthere" id="walk" href='javascript:void(0);' style="color:black;text-decoration:none;" onclick = "goThere('WALKING')"   >Walk there </a></th></tr>
            <tr ><th ><a class="getthere" id="bike" href='javascript:void(0);' style="color:black;text-decoration:none;"  onclick = "goThere('BICYCLING')" >Bike there </a></th></tr>
            <tr ><th ><a class="getthere" id="drive" href='javascript:void(0);' style="color:black;text-decoration:none;" onclick = "goThere('DRIVING')"   >Drive there</a></th></tr>
        </table>

        <div id = "final_content1"></div>
        <div id = "final_content2"></div>
        <div id = "final_content3"></div>
        <div id = "final_content4" style="display: none;"></div>
        <div id = "final_content5"></div>
        <div id = "final_content6"></div>
        <div id = "final_content7" style="display: none;"></div>
        <div id = "final_content8"></div>

    </form>

    <!-- <?php
    // if(isset($_POST['submit_name'])){
    //     echo "final lat = ",$_latitude;
    //     echo "<br />final lng = ",$_longitude; 
    //     echo "<br />location = ",$_location;
    //     echo "<br />keyword = ",$final_keyword;
    //     echo "<br />URL2 = ",$URL2;  
    //     echo "<br />radius = ",$final_radius;
    //     echo "<br />type = ",$final_type;
    // }else {    
    //     echo "ERROR!";
    // }
    ?> -->
        
</body>
</html>