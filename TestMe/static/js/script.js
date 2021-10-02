let video=document.getElementById("video");
let model;
var warnings =0;

const setupCamera=() => {
    navigator.mediaDevices.getUserMedia({
        video:{width:600,height:400},
        audio:false,
    }).then(stream => {
        video.srcObject= stream;
    });
};

const detectFaces=async () =>{
    const prediction=await model.detect(video,10,0.5);
    var persons=0,mobiles=0,score=0,book=0;
    
    prediction.forEach(object => {
        if(object.class == "person") {
            persons++;
        }
        if(object.class == "cell phone") {
            mobiles++;
            if(score<object.score) {
                score=object.score;
            }
        }
        if(object.class == "book") {
            book++;
        }
    });
    
    if(persons>1) {
        warnings++;
        console.log(warnings);
        
        if(warnings>3) {
            alert("Multiple violations detected, you have been disqualified and will be redirected to our home page");

            $.ajax({
                url: '/student/disqualify-student',
                type: "POST",
                data: {csrfmiddlewaretoken: '{{ csrf_token }}',},
    
                success: function () {
                    window.location="/";
                },
                error: function(error){
                alert("Ajax error" + error);
                },
            });
        }
        
        alert("Multiple individuals detected within screen,\nWarnings left " + (3-warnings));
    }

    if(persons<1) {
        warnings++;
        console.log(warnings);
        
        if(warnings>3) {
            alert("Multiple violations detected, you have been disqualified and will be redirected to our home page");

            $.ajax({
                url: '/student/disqualify-student',
                type: "POST",
                data: {csrfmiddlewaretoken: '{{ csrf_token }}',},
    
                success: function () {
                    window.location="/";
                },
                error: function(error){
                alert("Ajax error" + error);
                },
            });
        }
        
        alert("No individuals detected within screen,\nWarnings left " + (3-warnings));
    }


    if(mobiles>0 && score>0.6) {
        alert("Mobile phone detected, you have been disqualified and will be redirected to our home page");

        $.ajax({
            url: '/student/disqualify-student',
            type: "POST",
            data: {csrfmiddlewaretoken: '{{ csrf_token }}',},

            success: function () {
                window.location="/";
            },
            error: function(error){
            alert("Ajax error" + error);
            },
        });
    }

    if(book>0) {
        warnings++;
        console.log(warnings);
        
        if(warnings>3) {
            alert("Multiple violations detected, you have been disqualified and will be redirected to our home page");

            $.ajax({
                url: '/student/disqualify-student',
                type: "POST",
                data: {csrfmiddlewaretoken: '{{ csrf_token }}',},
    
                success: function () {
                    window.location="/";
                },
                error: function(error){
                alert("Ajax error" + error);
                },
            });
        }
        alert("Book detected within screen,\nWarnings left " + (3-warnings));
    }

    console.log("\n\n\nnumber of individuals ");
    console.log(persons);
    console.log("number of mobiles ");
    console.log(mobiles);
   // console.log("Number of Books");
   // console.log(book);
};

setupCamera();

video.addEventListener("loadeddata", async () =>{
    model=await cocoSsd.load();
    setInterval(detectFaces,5000);
});