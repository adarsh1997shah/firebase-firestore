const cafeLists = document.getElementById( 'cafe-list' );
const formAddCafe = document.getElementById( 'add-cafe-form' );
const formEditCafe = document.getElementById( 'edit-cafe-form' );
const modal = document.getElementById( 'modal' );
const cancel = document.getElementById( 'edit-cancel' );
const loader = document.querySelector( '.loader' );



// Rendeering Cafes in frontend.
function renderCafe( doc ) {

	let cafe = doc.data();

	cafeLists.innerHTML +=
			`<li id="${doc.id}">
				<span>${cafe.name}</span>
				<span>${cafe.country}</span>
				<div class="cross waves-effect"><i class="material-icons">cancel</i></div>
				<div class="edit waves-effect"><i class="material-icons">edit</i></div>
			</li>`;


	// For deletimg the cafes.
	deleteCafe();

	// For editing cafes.
	editCafe();
}


// Re-rendering data after edting.
function renderEditCafe( doc ) {
	let child = document.getElementById( doc.id ).children;

	child[0].textContent = doc.data().name;
	child[1].textContent = doc.data().country;
}


// Deleting cafe from frontend.
function deleteCafe() {
	let crosses = document.querySelectorAll( '.cross' );
	
	crosses.forEach( cross => cross.addEventListener( 'click', ( e ) => {

		let li = e.target.parentElement.parentElement;
		let id = li.getAttribute( 'id' );

		db.collection( 'Cafes' ).doc( id ).delete();
		li.remove();
	} ) );
}


// Editing cafe from frontend.
function editCafe() {
	let edits = document.querySelectorAll( '.edit' );
	
	edits.forEach( edit => edit.addEventListener( 'click', ( e ) => {

		loader.style.display = 'block';

		let li = e.target.parentElement.parentElement;
		let id = li.getAttribute( 'id' );

		db.collection( 'Cafes' ).doc( id ).get().then( doc => {

			loader.style.display = 'none';

			let cafe = doc.data();

			formEditCafe.cafeid.value = id;
			formEditCafe.name.value = cafe.name;
			formEditCafe.country.value = cafe.country;


			modal.classList.remove( 'inactive' );
			modal.classList.add( 'active' );
			modal.parentElement.classList.add( 'open' );
			document.body.classList.add( 'overflow' );
		} );
	} ) );
}



// Closing cafe details after editing.
function editClose() {
	modal.classList.remove( 'active' );
	modal.classList.add( 'inactive' );
	modal.parentElement.classList.remove( 'open' );
	document.body.classList.remove( 'overflow' );
}


// Getting data from firestore (real-time).
let unsubscribe = db.collection( 'Cafes' ).orderBy( 'name' ).onSnapshot( ( snapshot ) => {

	snapshot.docChanges().forEach( ( change ) => {

		if( change.type === 'added' ) {
			renderCafe( change.doc );
		}
		if( change.type === 'removed' ){
			console.log('removed');
		}
		if( change.type === 'modified' ) {
			renderEditCafe( change.doc );
		}
	} );
}, ( error ) => {
	console.log( 'adasdad', error );
} );


// Getting data from firestore (static).
// db.collection( 'Cafes' ).orderBy( 'name' ).get().then( (result ) => {
// 	result.docs.forEach( ( doc ) => {
// 		renderCafe( doc );
// 	} );
// 	deleteCafe();

// }).catch((err) => {
// 	console.log( err );
// });


// Querying firestore with where clause.
// db.collection( 'Cafes' ).where( 'country', '==', 'country-1' ).get().then( (result ) => {
// 	result.docs.forEach( ( doc ) => {
// 		renderCafe( doc );
// 	} );
// 	deleteCafe();

// }).catch((err) => {
// 	console.log( err );
// });


// Adding data to firestore.
formAddCafe.addEventListener( 'submit', ( e ) => {
	e.preventDefault();

	// Making sure form is not empty.
	if( formAddCafe.name.value != '' && formAddCafe.country.value != '' ) {
		db.collection( 'Cafes' ).add( {
			name: formAddCafe.name.value,
			country: formAddCafe.country.value,
		} );
	} else {
		alert( 'Either of the two forms is empty!' );
	}

	formAddCafe.reset();
} );


// Editing data to firestore.
formEditCafe.addEventListener( 'submit', ( e ) => {
	e.preventDefault();

	// Making sure form is not empty.
	if( formEditCafe.name.value != '' && formEditCafe.country.value != '' ) {
		db.collection( 'Cafes' ).doc( formEditCafe.cafeid.value ).update( {
			name: formEditCafe.name.value,
			country: formEditCafe.country.value,
		} );
	} else {
		alert( 'Either of the two forms is empty!' );
	}

	modal.classList.remove( 'active' );
	modal.classList.add( 'inactive' );
	modal.parentElement.classList.remove( 'open' );
	document.body.classList.remove( 'overflow' );

	formEditCafe.reset();
} );

cancel.addEventListener( 'click', editClose );