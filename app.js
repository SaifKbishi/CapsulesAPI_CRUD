const BaseEndpoint= 'https://apple-seeds.herokuapp.com/api/users/';
localStorage.setItem("data", JSON.stringify([]));
const personDataArray = [];
const toolsBar = document.querySelector('.toolsBar');
const personData = document.querySelector('.personData');
const table = document.createElement('table');
const tableHeadStr = `<thead class="thead"><tr><th>id</th><th>First Name</th><th>Last Name</th><th>Capsule</th><th>Age</th><th>City</th><th>Gender</th><th>Hobby</th><th></th><th></th></tr></thead>`;
const tbody = document.createElement('tbody');
tbody.classList.add('mytable');
const mytable = document.querySelector('.mytable');
const updateFname = document.querySelector("[data-type='fname']");
const updateLname = document.querySelector("[data-type='lname']");
const updateCapsule = document.querySelector("[data-type='capsule']");
const updateAge = document.querySelector("[data-type='age']");
const updateCity = document.querySelector("[data-type='city']");
const updateGender = document.querySelector("[data-type='gender']");
const updateHobby = document.querySelector("[data-type='hobby']");
let searchEntityFromDropDown;
let rowState={
 rowIndex: 0,
 tempRow:'',
 inEditMode: false,
}
let searchState='';

function createDropDownOption(elemType, textcontent, value){
 let newElement = document.createElement(elemType);
 newElement.textContent = textcontent;
 newElement.value = value;
 return newElement;
}//createDropDownOption

createToolBarMenu();
getPersonDataFromApi();
createTableHeader();

//generic function for fetching URL
async function fetchAnyURL(url){
 try{
  const requestData = await fetch(`${url}`);
  const entityData = await requestData.json();
  if (!requestData.ok) {  return handleError(entityData.message); }
  return entityData;
 }
 catch(error){console.log(`${error}, error fetching data from ${url}`);}
}//fetchAnyURL

async function getPersonExtraDetails(id){
 try{
  const personExtraDetails = await fetchAnyURL(`${BaseEndpoint}${id}`);
  return personExtraDetails;  
 }
 catch(error){console.log(`${error} ,Could not fetch person with id=${id} extra data from ${BaseEndpoint}`);}
}//getPersonDetails

async function getPersonDataFromApi(){
 try{
  const personBasicData = await fetchAnyURL(BaseEndpoint);  
   for (const dataItem of personBasicData){
   let personExtraDetails = await  getPersonExtraDetails(dataItem.id);
    let dataObj ={
     id: dataItem.id,
     firstname: dataItem.firstName,
     lastname: dataItem.lastName,
     capsule: dataItem.capsule,
     city: personExtraDetails.city, 
     gender: personExtraDetails.gender,
     age: personExtraDetails.age,
     hobby: personExtraDetails.hobby
   };
   personDataArray.push(dataObj);
   }
  //diplayData();
  diplayData(personDataArray);
 } 
 catch(error){console.log(`${error}, Could not fetch person data from ${BaseEndpoint}`);}
}//getPersonDataFromApi

function createToolBarMenu(){
 const searchLabel = document.createElement('lable');
 searchLabel.textContent = 'Search: ';
 const searchField = document.createElement('input');
 searchField.type = 'search';
 searchField.id = 'searchSite';
 const dropdownMenu = document.createElement('select');
 dropdownMenu.classList.add('dropDownList');
 dropdownMenu.onchange = 'dropDownChanged()';
 //const elemName = createDropDownOption(elemType, textcontent, value, id, class);
 const optionFN = createDropDownOption('option', 'First Name', 'firstname');
 const optionLN = createDropDownOption('option', 'Last Name', 'lastname');
 const optionAge = createDropDownOption('option', 'Age', 'age');
 const optionCapsule = createDropDownOption('option', 'Capsule', 'capsule');
 const optionGender = createDropDownOption('option', 'Gender', 'gender');
 const optionHobby = createDropDownOption('option', 'Hobby', 'hobby');
 const optionCity = createDropDownOption('option', 'City', 'city');

 toolsBar.insertAdjacentElement('afterbegin',searchLabel);
 searchLabel.insertAdjacentElement('afterend',searchField);
 searchField.insertAdjacentElement('afterend',dropdownMenu);

 dropdownMenu.insertAdjacentElement('beforeend',optionFN);
 dropdownMenu.insertAdjacentElement('beforeend',optionLN);
 dropdownMenu.insertAdjacentElement('beforeend',optionAge);
 dropdownMenu.insertAdjacentElement('beforeend',optionCapsule);
 dropdownMenu.insertAdjacentElement('beforeend',optionGender);
 dropdownMenu.insertAdjacentElement('beforeend',optionHobby);
 dropdownMenu.insertAdjacentElement('beforeend',optionCity);
 search();
}//createToolBarMenu

let filteredPersonArray = [];
function search(){
 let str='';
 let searchText = document.querySelector('#searchSite');  
 searchText.addEventListener('keyup', (e)=>{
  searchEntityFromDropDown = dropDownChanged();
  filteredPersonArray = [];
  str = searchText.value.toLowerCase();
  let searchEntitiy;
  for(let i=0; i<personDataArray.length; i++){
   switch(searchEntityFromDropDown){
    case 'firstname': searchEntitiy = personDataArray[i].firstname.toLowerCase();break;
    case 'hobby': searchEntitiy = personDataArray[i].hobby.toLowerCase();break;
    case 'lastname': searchEntitiy = personDataArray[i].lastname.toLowerCase();break;
    case 'age': searchEntitiy = personDataArray[i].age.toString();break;
    case 'capsule': searchEntitiy = personDataArray[i].capsule.toString();break;
    case 'gender': searchEntitiy = personDataArray[i].gender.toLowerCase();break;
    case 'city': searchEntitiy = personDataArray[i].city.toLowerCase();break;
   }
    if(searchEntitiy.includes(str)){filteredPersonArray.push(personDataArray[i]); }
  }
  console.log('filteredPersonArray:1 ',filteredPersonArray);
  diplayData(filteredPersonArray);
 }); 
}//search

function dropDownChanged(){
 let dropDownList= document.querySelector('.dropDownList'); 
 dropDownList.addEventListener('change', ()=>{
  console.log('dropDownList.value:2 ',dropDownList.value);
 // return dropDownList.value;
 });  
 if(dropDownList.value){
  return dropDownList.value;
 }
}//dropDownChanged

function diplayData(array = personDataArray){    
 hideAnimation(); 
 try{
  tbody.innerHTML = '';
  //JSON.parse(localStorage.getItem("data")).forEach((person, index) => {
  for(let i=0; i<array.length; i++){
   tbody.insertAdjacentHTML('beforeend',`<tr>
   <td>${array[i].id}</td>
   <td data-type="fname">${array[i].firstname}</td>
   <td data-type="lname">${array[i].lastname}</td>
   <td data-type="capsule">${array[i].capsule}</td>
   <td data-type="age">${array[i].age}</td>
   <td data-type="city">${array[i].city}</td>
   <td data-type="gender">${array[i].gender}</td>
   <td data-type="hobby">${array[i].hobby}</td>
   <td data-type="editBtn"><button class="editBtn btn">Edit</button>      <button class="cancelBtn btn hidden" >Cancel</button></td>
   <td data-type="deleteBtn"><button class="deleteBtn btn">Delete</button><button class="confirmBtn btn hidden">Confirm</button></td>
  </tr>`);
  }//for
 //});
  const allEditBtns = document.querySelectorAll('.editBtn');  
  const allCancelBtns = document.querySelectorAll('.cancelBtn');
  const allDeleteBtns = document.querySelectorAll('.deleteBtn');
  const allConfirmBtns = document.querySelectorAll('.confirmBtn');
  editDeleteBtnsAddEventListeners(allEditBtns, allCancelBtns, allDeleteBtns, allConfirmBtns);
 }catch(error){console.log(`${error}, could not display table`);} 
}//diplayData

function editDeleteBtnsAddEventListeners(allEditBtns, allCancelBtns, allDeleteBtns, allConfirmBtns){
 allEditBtns.forEach((editBtnElem,index) => {
  editBtnElem.addEventListener('click',()=> editRow(index));  
  //editBtnElem.addEventListener('click',()=> editCancelRow(index));
 });
 allCancelBtns.forEach((cacnelBtnElem,index) => {
  cacnelBtnElem.addEventListener('click',()=> cancelEditRow(index));  
  //editBtnElem.addEventListener('click',()=> editCancelRow(index));
 });

 allDeleteBtns.forEach((DeleteBtnElem,index) => {
  DeleteBtnElem.addEventListener('click',()=> deletRow(index));
 });
 allConfirmBtns.forEach((confirmBtnElem,index) => {
  confirmBtnElem.addEventListener('click',()=> confirmEditRow(index));
 });
}//editDeleteBtnsAddEventListeners

function editRow(index){ 
 console.log('edit button clicked');
 let rowToEdit = tbody.rows[index];
 let rowElems = rowToEdit.cells;
 if(rowState.inEditMode === false){  
  tbody.rows[index].cells[8].firstElementChild.classList.add('hidden');
  tbody.rows[index].cells[8].lastElementChild.classList.remove('hidden');
  tbody.rows[index].cells[9].firstElementChild.classList.add('hidden');
  tbody.rows[index].cells[9].lastElementChild.classList.remove('hidden');
  rowState.inEditMode = true;  
  rowState.tempRow = rowToEdit;//save the row data 
  //rowState.tempRow = rowElems;//save the row data 
  rowToEdit.classList.add('noBorderForRow');  
  for(let i=1; i<rowElems.length-2; i++){
   rowElems[i].contentEditable= "true";
   rowElems[i].classList.add('cellBorder');
  }
 }else{
  console.log('you are editing another row');
  return;
 }
}//editRow

function cancelEditRow(index){
/*  tbody.rows[index].cells[8].firstElementChild.classList.remove('hidden');
 tbody.rows[index].cells[8].lastElementChild.classList.add('hidden');
 tbody.rows[index].cells[9].firstElementChild.classList.remove('hidden');
 tbody.rows[index].cells[9].lastElementChild.classList.add('hidden'); */
 restoreButtons(index);
 console.log('cancel button clicked');
 tbody.rows[index]=rowState.tempRow;
 let editedRow = rowState.tempRow;
 console.log('editedRow', editedRow);
 rowState.inEditMode = false;
 let currentRow = tbody.rows[index];
 let rowElems = currentRow.cells; 
 console.log('rowElems',rowElems);
 let edit_cancelBTNtemp = rowElems[8].firstElementChild;
  let delete_confirmBTNtemp = rowElems[9].firstElementChild;  
  edit_cancelBTNtemp.innerText = 'Edit';
  delete_confirmBTNtemp.innerText = 'Delete';  
  for(let i=1; i<rowElems.length-2; i++){  //enable editing all text fields
   rowElems[i].contentEditable= "false";
   rowElems[i].classList.remove('cellBorder');
  }
}//cancelEditRow

const deletRow =(index)=>{tbody.rows[index].remove();}

function confirmEditRow(index){
 
}//confirmEditRow
function restoreButtons(index){
 tbody.rows[index].cells[8].firstElementChild.classList.remove('hidden');
 tbody.rows[index].cells[8].lastElementChild.classList.add('hidden');
 tbody.rows[index].cells[9].firstElementChild.classList.remove('hidden');
 tbody.rows[index].cells[9].lastElementChild.classList.add('hidden');
}
const hideAnimation = ()=>{document.querySelector('.lds-spinner').style.display= 'none';}//hideAnimation 

function createTableHeader(){
 personData.insertAdjacentElement('afterbegin', table);
 table.insertAdjacentHTML('afterbegin', tableHeadStr);
 let tableHead = document.querySelector('.thead');
 tableHead.insertAdjacentElement('afterend', tbody);
}//createTableHeader

