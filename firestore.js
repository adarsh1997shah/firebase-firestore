const cafeLists = document.getElementById( 'cafe-list' );
const form = document.getElementById( 'add-cafe-form' );



document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, { dismissible: false });
});

prompt('sadsa');

// Rendeering Cafes in frontend.
function renderCafe( doc ) {

	let cafe = doc.data();

	cafeLists.innerHTML +=
			`<li id="${doc.id}">
				<span>${cafe.name}</span>
				<span>${cafe.country}</span>
				<div class="cross waves-effect"><i class="material-icons">cancel</i></div>
				<div class="edit waves-effect modal-trigger"><i class="material-icons">edit</i></div>
			</li>`;


	// For deletimg the cafes.
	deleteCafe();
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



// Getting data from firestore (real-time).
db.collection( 'Cafes' ).orderBy( 'name' ).onSnapshot( ( snapshot ) => {

	snapshot.docChanges().forEach( ( change ) => {

		if( change.type === 'added' ) {
			renderCafe( change.doc );
		}
		if( change.type === 'removed' ){
			console.log('removed');
		}
	} );
} )


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
form.addEventListener( 'submit', ( e ) => {
	e.preventDefault();

	// Making sure form is not empty.
	if( form.name.value != '' && form.country.value != '' ) {
		db.collection( 'Cafes' ).add( {
			name: form.name.value,
			country: form.country.value,
		} );
	} else {
		alert( 'Either of the two forms is empty!' );
	}

	form.reset();
} );