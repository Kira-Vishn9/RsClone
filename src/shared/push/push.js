// import { initializeApp } from "firebase/app";
// import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyAbrSlPJqm6a0sdSm-f4Ds7MWrIpoyIF-s",
//     authDomain: "clone-instagram-7c300.firebaseapp.com",
//     projectId: "clone-instagram-7c300",
//     storageBucket: "clone-instagram-7c300.appspot.com",
//     messagingSenderId: "572673925162",
//     appId: "1:572673925162:web:423fb6786549b83fe9a353",
//   };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const storage = getStorage(app);

// const newPost = (src) =>{return `
// <div class="upload-content__header">Create a post</div>
// <div class="upload-content__main">
//   <img class = 'img-post' src="${src}" 
//   style="
//     margin-bottom: 20px;
//     width: 90%;
//  alt="">
//   <input tupe='text' style="
//   height: 200px;
//   background: black;
//   width: 90%;
//   color: #fff;
//   border: 0px solid black;
//   border-radius: 10px;
//   "
//   >
//   <input type="file" id="file">
//   <button class="submit upload-content__main-btn">Submit</button>
// </div>`}

// export  function push(selector, options = {}) {
//     const bth =  document.querySelector('.upload-content__main-btn');
//     const input = document.querySelector(selector);
    
//     bth?.addEventListener('click', () => {
//         if(input){
//         input.click()}
//     })
    
//     const changeHandler = (event) => {
//         let files = [];
//         const uploadContent = document.querySelector('.upload-content');
//         // const bthSubmit = document.querySelector('.submit');
//         console.log(event.target.files)
//         if (!event.target.files.length) {
//             return
//           }
//         files = Array.from(event.target.files)
//         files.forEach(file => {
//           if (!file.type.match('image')) {
//             return
//           }
    
//           const reader = new FileReader()
    
//           reader.onload = ev => {
//             const src = ev.target.result;
//             uploadContent.innerHTML = '';
//             uploadContent.insertAdjacentHTML('afterbegin', newPost(src)) 
//             document.querySelector('.submit').addEventListener('click', () => {
//                 files.forEach((file, index) => {
//                     const storageRef = ref(storage, `/kira/${file.name}`)
//                           uploadBytes(storageRef, file).then((snapshot) => {
//                             console.log('Uploaded a blob or file!');
//                           });
//                         })
//               })
//           }
//           reader.readAsDataURL(file)
//         })
//       };
//       input.addEventListener('input', changeHandler);  
// }





























// // // // Initialize Cloud Storage and get a reference to the service
// // //  const storage = getStorage(app);
// // //  const starsRef = ref(storage, '/avatars/avatarka.png')
// // //  export default function asda () {
// // //  getDownloadURL(starsRef)
// // //   .then((url) => {
    
// // //     document.querySelector('.newsline__main-img')?.setAttribute('src', url)

// // //     // Insert url into an <img> tag to "download"
// // //   })
// // //   .catch((error) => {
// // //     // A full list of error codes is available at
// // //     // https://firebase.google.com/docs/storage/web/handle-errors
// // //     switch (error.code) {
// // //       case 'storage/object-not-found':
// // //         // File doesn't exist
// // //         break;
// // //       case 'storage/unauthorized':
// // //         // User doesn't have permission to access the object
// // //         break;
// // //       case 'storage/canceled':
// // //         // User canceled the upload
// // //         break;

// // //       // ...

// // //       case 'storage/unknown':
// // //         // Unknown error occurred, inspect the server response
// // //         break;
// // //     }
// // //   });
// // // }
 

  

