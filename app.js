console.log('CapsulesAPI_CRUD');

const BaseEndpoint= 'https://apple-seeds.herokuapp.com/api/users/';
const personDataArray = [];
const toolsBar = document.querySelector('.toolsBar');
const personData = document.querySelector('.personData');
const table = document.createElement('table');
const tableHeadStr = `<thead class="thead"><tr><th>id</th><th>First Name</th><th>Last Name</th><th>Capsule</th><th>Age</th><th>City</th><th>Gender</th><th>Hobby</th><th></th><th></th></tr></thead>`;
const tbody = document.createElement('tbody');
tbody.classList.add('mytable');
const mytable = document.querySelector('.mytable');
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
}

createToolBarMenu();
getPersonDataFromApi();

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
     firstName: dataItem.firstName,
     lastName: dataItem.lastName,
     capsule: dataItem.capsule,
     city: personExtraDetails.city, 
     gender: personExtraDetails.gender,
     age: personExtraDetails.age,
     hobby: personExtraDetails.hobby
   };
   personDataArray.push(dataObj);
   }
  diplayData();
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
 //dropDownChanged();
 search();

}//createToolBarMenu

function search(){
 console.log('search start');
 let str='';
 let filteredPersonArray = [];
 let searchText = document.querySelector('#searchSite');
 let searchEntityFromDropDown = dropDownChanged();
 searchText.addEventListener('keyup', (e)=>{  
  filteredPersonArray = [];
  str = searchText.value.toLowerCase();
  console.log(str);
  for(let i=0; i<personDataArray.length; i++){
   //console.log(`${personDataArray[i].lastName}`); //this should be pulled from the dropdown
   let searchEntitiy = personDataArray[i].lastName.toLowerCase();
    if(searchEntitiy.includes(str)){
    filteredPersonArray.push(personDataArray[i]);
   }
  }
  console.log('filteredPersonArray: ',filteredPersonArray);
 });
 console.log('filteredPersonArray: ',filteredPersonArray);
 return filteredPersonArray;
}//search

function dropDownChanged(){
 let dropDownList= document.querySelector('.dropDownList'); 
 dropDownList.addEventListener('change', ()=>{
  console.log('dropDownList.value:2 ',dropDownList.value);
  //return dropDownList.value;
 });  
 if(dropDownList.value){
  console.log('dropDownList.value3: ',dropDownList.value);
  return dropDownList.value;
 }
}//dropDownChanged

function diplayData(){
 hideAnimation();
 try{
  personData.insertAdjacentElement('afterbegin', table);
  table.insertAdjacentHTML('afterbegin', tableHeadStr);
  let tableHead = document.querySelector('.thead');
  tableHead.insertAdjacentElement('afterend', tbody);
 
  for(let i=0; i<personDataArray.length; i++){
   //tbody.insertAdjacentHTML('beforeend',displayARow(i));
   tbody.insertAdjacentHTML('beforeend',`<tr>
   <td>${personDataArray[i].id}</td>
   <td data-type="fname">${personDataArray[i].firstName}</td>
   <td data-type="lname">${personDataArray[i].lastName}</td>
   <td data-type="capsule">${personDataArray[i].capsule}</td>
   <td data-type="age">${personDataArray[i].age}</td>
   <td data-type="city">${personDataArray[i].city}</td>
   <td data-type="gender">${personDataArray[i].gender}</td>
   <td data-type="hobby">${personDataArray[i].hobby}</td>
   <td data-type="editBtn"><button class="editBtn btn">Edit</button></td>
   <td data-type="deleteBtn"><button class="deleteBtn btn">Delete</button></td>
  </tr>`);
  }//for
  const allEditBtns = document.querySelectorAll('.editBtn');  
  const allDeleteBtns = document.querySelectorAll('.deleteBtn');
  //console.log('allEditBtns: ',allEditBtns);
  editDeleteBtnsAddEventListeners(allEditBtns, allDeleteBtns);
 }catch(error){console.log(`${error}, could not display table`);} 
}//diplayData

function editDeleteBtnsAddEventListeners(allEditBtns, allDeleteBtns){
 allEditBtns.forEach((editBtnElem,index) => {
  //console.log(editBtnElem);
  //editBtnElem.addEventListener('click',()=> editRow(index));
  editBtnElem.addEventListener('click',()=> editRow(index));  
 });

 allDeleteBtns.forEach((DeleteBtnElem,index) => {
  //console.log(DeleteBtnElem);
  DeleteBtnElem.addEventListener('click',()=> deletRow(index));
 });
}//editDeleteBtnsAddEventListeners

function editRow(index){ 
 console.log('index: ', index);
 let rowToEdit = tbody.rows[index];
 tempRow = rowToEdit;
 //console.log(tbody.rows[index]);
 console.log('rowToEdit: ',rowToEdit);
 //tbody.rows[index].contentEditable= "true";
 //rowToEdit.contentEditable= "true";
 rowToEdit.classList.add('noBorderForRow');
 let rowElems = rowToEdit.cells;
 for(let i=1; i<rowElems.length-2; i++){
  rowElems[i].contentEditable= "true";
  rowElems[i].classList.add('cellBorder');
  //console.log(rowElems[i]);
 }
 
 //console.log(tbody);
}//editRow

function deletRow(index){
 console.log('index: ', index);
 let rowToDelete = tbody.rows[index];
 rowToDelete.remove();
}//deletRow

function hideAnimation(){
 let animation = document.querySelector('.lds-spinner');
 animation.style.display= 'none';
}//hideAnimation

/* function search(dropdownMenu){
 //console.log('dropdownMenu: ',dropdownMenu);
}//search */