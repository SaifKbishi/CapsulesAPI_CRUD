console.log('CapsulesAPI_CRUD');

const BaseEndpoint= 'https://apple-seeds.herokuapp.com/api/users/';
const personDataArray = [];
//const personExtraDetailsArray = [];
const toolsBar = document.querySelector('.toolsBar');
const personData = document.querySelector('.personData');
const table = document.createElement('table');
const tableHeadStr = `<thead class="thead"><tr><th>id</th><th>First Name</th><th>Last Name</th><th>Capsule</th><th>Age</th><th>City</th><th>Gender</th>
<th>Hobby</th><th></th><th></th></tr></thead>`;
const tbody = document.createElement('tbody');

createToolBarMenu();
//getPersonDataFromApi();

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
   //console.log(dataObj);
   personDataArray.push(dataObj);
   }  
   //console.log(personDataArray);
  diplayData();
 } 
 catch(error){console.log(`${error}, Could not fetch person data from ${BaseEndpoint}`);}
}//getPersonDataFromApi

async function getPersonExtraDetails(id){
 try{
  const personExtraDetails = await fetchAnyURL(`${BaseEndpoint}${id}`);
  return personExtraDetails;  
 }
 catch(error){console.log(`${error} ,Could not fetch person with id=${id} extra data from ${BaseEndpoint}`);}
}//getPersonDetails

function diplayData(){
 try{
  personData.insertAdjacentElement('afterbegin', table);
  table.insertAdjacentHTML('afterbegin', tableHeadStr);
  //tableHeadStr.classList.add('sadsad')
  let tableHead = document.querySelector('.thead');
  console.log('thead', tableHead);
  tableHead.insertAdjacentElement('afterend', tbody);
 
  for(let i=0; i<personDataArray.length; i++){
   //tbody.insertAdjacentHTML('beforeend',displayARow(i));
   tbody.insertAdjacentHTML('beforeend',`<tr>
   <td>${personDataArray[i].id}</td>
   <td>${personDataArray[i].firstName}</td>
   <td>${personDataArray[i].lastName}</td>
   <td>${personDataArray[i].capsule}</td>
   <td>${personDataArray[i].age}</td>
   <td>${personDataArray[i].city}</td>
   <td>${personDataArray[i].gender}</td>
   <td>${personDataArray[i].hobby}</td>
   <td><button class="editBtn">Edit</button></td>
   <td><button class="deleteBtn">Delete</button></td>
  </tr>`);
  }
 }catch(error){console.log(`${error}, could not display table`);}
 
}//diplayData

function createToolBarMenu(){
 const searchLabel = document.createElement('lable');
 searchLabel.textContent = 'Search: ';
 const searchField = document.createElement('input');
 searchField.type='search';
 searchField.id='searchSite';
 const dropdownMenu = document.createElement('select');
 const optionFN = document.createElement('option');
 optionFN.textContent ='First Name';
 const optionLN = document.createElement('option');
 optionLN.textContent='Last Name';
 /* const optionFN = document.createElement('option');
 const optionFN = document.createElement('option');
 const optionFN = document.createElement('option');
*/

 toolsBar.insertAdjacentElement('afterbegin',searchLabel);
 searchLabel.insertAdjacentElement('afterend',searchField);
 searchField.insertAdjacentElement('afterend',dropdownMenu);
 dropdownMenu.insertAdjacentElement('beforeend',optionFN);
 dropdownMenu.insertAdjacentElement('beforeend',optionLN);
 

}


/* function displayARow(index){
 try{
  let i =index;
  let aPersonRecord = `<tr>
  <td>${personDataArray[i].id}</td>
  <td>${personDataArray[i].firstName}</td>
  <td>${personDataArray[i].lastName}</td>
  <td>${personDataArray[i].capsule}</td>
  <td>${personDataArray[i].age}</td>
  <td>${personDataArray[i].city}</td>
  <td>${personDataArray[i].gender}</td>
  <td>${personDataArray[i].hobby}</td>
  <td>EDIT button</td>
  <td>delete button</td>
 </tr>`;
 }catch(error){`${error} not able to to display a row with index: ${index}`}
 
//return aPersonRecord;
} */