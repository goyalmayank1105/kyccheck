


(function(){
var video =document.getElementById("video"),
    canvas1=document.getElementById('canvas1'),
    canvas2=document.getElementById('canvas2'),
    context1=canvas1.getContext('2d'),
    context2=canvas2.getContext('2d'),
    vendorUrl = window.URL || window.webkitURL;
    
    navigator.getMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || 
    navigator.mozGetUserMedia||
    navigator.msGetUserMedia;

    navigator.getMedia({
        video:true,
        audio:false
    }, function(stream){
        video.srcObject=stream;
        video.play();
    }, function(error){
        console.log(error)

    });

    document.getElementById('capture').addEventListener('click',function(){
        context1.drawImage(video,0,0,400,300);
    });
    document.getElementById('capture1').addEventListener('click',function(){
        context2.drawImage(video,0,0,400,300);
    });
    document.getElementById('startdetect').addEventListener('click',function(){
        console.log("Going to run");
        //loader2=document.getElementById('pleaseWaitDialog'),
        //$('#pleaseWaitDialog').modal();
        //loader2.modal();
        finalcheck();
        
    });
    

})();

function finalcheck(){

  const MODEL_URL = './models'

Promise.all([
  faceapi.loadSsdMobilenetv1Model(MODEL_URL),
  faceapi.loadFaceLandmarkModel(MODEL_URL),
  faceapi.loadFaceRecognitionModel(MODEL_URL)
]).then(myrun)


   

}

async function myrun() {

var mycanvas = document.getElementById('canvas1');
var oGrayImg=document.getElementById('myImage1');
oGrayImg.src = mycanvas.toDataURL();
var mycanvas2 = document.getElementById('canvas2');
var oGrayImg2=document.getElementById('myImage2');
oGrayImg2.src = mycanvas2.toDataURL();


const input = document.getElementById('myImage1')
const input2 = document.getElementById('myImage2')


console.log("image taken")
fullFaceDescriptions = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors()
console.log(fullFaceDescriptions)

const canvas = faceapi.createCanvasFromMedia(input)
document.body.append(canvas)
const displaySize = { width: input.width, height: input.height }
fullFaceDescriptions=faceapi.resizeResults(fullFaceDescriptions,displaySize)
faceapi.matchDimensions(canvas, displaySize)
const resizedDetections = faceapi.resizeResults(fullFaceDescriptions, displaySize)
canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
// faceapi.draw.drawDetections(canvas, resizedDetections)
// faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
console.log("Face detection done...")




const labels = ['mayank']

const labeledFaceDescriptors = await Promise.all(
  labels.map(async label => {
    // fetch image data from urls and convert blob to HTMLImage element
    // const imgUrl = `${label}.jpg`

    const img =document.getElementById('myImage2')
    // const img = await faceapi.fetchImage(imgUrl)
    
    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
    const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
    
    if (!fullFaceDescription) {
      document.getElementById("detecting").style.display = "none"
      document.getElementById("cover").style.display = "none"
      location.replace("results_failure.html")
    }
    
    const faceDescriptors = [fullFaceDescription.descriptor]
    return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
  })
)


// 0.6 is a good distance threshold value to judge
// whether the descriptors match or not
const maxDescriptorDistance = 0.6
const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)

const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))

results.forEach((bestMatch, i) => {
  const box = fullFaceDescriptions[i].detection.box
  const text = bestMatch.toString()
  
  var str = text.toString();
  var name=labels[0].toString();
  console.log(str)
  console.log(name)
  var n = str.startsWith(name);
  console.log(n)


document.getElementById("detecting").style.visibility = "hidden"
document.getElementById("cover").style.visibility = "hidden"

if(n){
location.replace("result_success.html")
}
else{
  location.replace("results_failure.html")
}


  if(n){

  const drawBox = new faceapi.draw.DrawBox(box, { label: text })
//  drawBox.draw(canvas)
  // document.getElementById("loader").style.visibility = "hidden";
  }
})


}