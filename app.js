firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const cafeList = document.querySelector("#cafe-list")
const form = document.querySelector("#add-cafe-form")

//create elements and render cafe
function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement("div")

    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().name
    city.textContent = doc.data().city
    cross.textContent = "x"

    li.appendChild(name)
    li.appendChild(city)
    li.appendChild(cross)

    cafeList.appendChild(li)

    //deleting data 
    cross.addEventListener('click', e => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute("data-id")
        //db.collection("cafes").doc(id) --> gets single doc
        db.collection("cafes").doc(id).delete();
    })
}

//REALTIME LISTENER #IMP ***************************
db.collection("cafes").orderBy("city").onSnapshot(
    snapshot => {
        let changes = snapshot.docChanges()
        changes.forEach(change => {
            if (change.type === "added") {
                renderCafe(change.doc)
            } else if (change.type === "removed") {
                let li = cafeList.querySelector("[data-id = " + change.doc.id + "]");
                cafeList.removeChild(li)
            }
        })
    }
)
//*****************************************************

//get data from collection
// db.collection('cafes').get().then(
//     snapshot => {
//         snapshot.docs.forEach(
//             doc => {
//                 renderCafe(doc)
//             }
//         )
//     }
// )

//complex queries
//equal to
// db.collection("cafes").where("city", "==", "jaipur").get().then(
//     snapshot => {
//         snapshot.docs.forEach(
//             doc => {
//                 renderCafe(doc)
//             }
//         )
//     }
// )
//greater than
// db.collection("cafes").where("city", ">", "jaipur").get().then(
//     snapshot => {
//         snapshot.docs.forEach(
//             doc => {
//                 renderCafe(doc)
//             }
//         )
//     }
// )
//ordering data
// db.collection("cafes").orderBy("name").get().then(
//     snapshot => {
//         snapshot.docs.forEach(
//             doc => {
//                 renderCafe(doc)
//             }
//         )
//     }
// )
//more complex
// db.collection("cafes").where("city", "==", "jaipur").orderBy("name").get().then(
//     snapshot => {
//         snapshot.docs.forEach(
//             doc => {
//                 renderCafe(doc)
//             }
//         )
//     }
// )
//saving data to firebase
form.addEventListener('submit', e => {
    e.preventDefault();
    db.collection("cafes").add(
        {
            name: form.name.value,
            city: form.city.value
        }
    )
    form.name.value = ""
    form.city.value = ""
})

//updating data
// db.collection("cafes").doc("here comes id").update(
//     {
//         name : "mario world"
//     }
// )
// db.collection("cafes").doc("here comes id").update(
//     {
//         city : "new york"
//     }
// )
//changes only what you update

//SET method completely overrides the document
// db.collection("cafes").doc("here comes id").set(
//     {
//         name : "pappu",            
//         city : "new york"
//     }
// )