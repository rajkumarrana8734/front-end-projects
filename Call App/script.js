// create a new cards  and save to data in localstorage
//button handling 
//filter handling
//show the data in the localstorage



    const mainContainer = document.getElementById('mainContainer');
    const form = document.getElementById('newCallModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');


const noteForm = document.querySelector("#noteForm");
const textInputs = document.querySelectorAll('#noteForm input[type="text"]');
const imageUrlInput = textInputs[0];
const fullNameInput = textInputs[1];
const homeTownInput = textInputs[2];
const purposeInput = textInputs[3];
const categoryRadios = document.querySelectorAll('#noteForm input[name="category"]');
const submitBtn = document.querySelector("#noteForm .btn-submit");

function savelocal(arr){
      if(localStorage.getItem("task") === null){
        let oldtask = [];
        oldtask.push(arr);
        localStorage.setItem("task",JSON.stringify(oldtask));
      }
      else{
        let oldtask = localStorage.getItem("task")
       oldtask =  JSON.parse(oldtask);
       oldtask.push(arr);
       localStorage.setItem("task",JSON.stringify(oldtask));
      }
}

openModalBtn.addEventListener("click",function(){
     form.style.display="initial";
     mainContainer.style.display="none";

});

closeModalBtn.addEventListener("click",function(){
     form.style.display="none";
     mainContainer.style.display="flex";

});

form.addEventListener("submit",function(det){
    det.preventDefault();

    const imageurl = imageUrlInput.value.trim();
    const fullname = fullNameInput .value.trim();
    const  homecity = homeTownInput.value.trim();
    const purpose = purposeInput.value.trim();
    const selectedCategory = document.querySelector('input[name="category"]:checked')?.value;

    // Validation logic
  if (imageurl === "") {
    alert("Please enter an Image URL.");
    return;
  }

  if (fullname === "") {
    alert("Please enter your Full Name.");
    return;
  }

  if (homecity === "") {
    alert("Please enter your Home Town.");
    return;
  }

  if (purpose === "") {
    alert("Please enter a Purpose.");
    return;
  }

  if (!selectedCategory) {
    alert("Please select a Category.");
    return;
  }
  savelocal({
    fullname,
    homecity,
    purpose,
    imageurl,
    selectedCategory,

    


  });

    noteForm.reset();
    form.style.display="none";
    mainContainer.style.display="flex";
    
});

function addcard(){
    
}