    // web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyCrU6YewhX7fO4DB2Xgt9V3FDYREV86Yi8",
        authDomain: "image-uploading-c09b6.firebaseapp.com",
        projectId: "image-uploading-c09b6",
        storageBucket: "image-uploading-c09b6.appspot.com",
        messagingSenderId: "1044869190982",
        appId: "1:1044869190982:web:572d77efef48e36db5c147",
        measurementId: "G-TRXY6XJRR9"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
  
      //get elements
      let fileButton = document.getElementById('fileButton');
  
      //listen to filesection
      fileButton.addEventListener('change', (e) => {
        //get file
        let file = e.target.files[0];
  
        //create storage ref
        let storageRef = firebase.storage().ref('myImages/' + file.name);
  
        //upload file
        let task = storageRef.put(file);
        task.on('state_changed', function (snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, function (error) {
          // Handle unsuccessful uploads
          console.log(error)
        }, function () {
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            document.getElementById('imageurl').value = downloadURL;
            let img = document.getElementById('image');
            img.src = downloadURL;
            img.style='display:block';
            console.log('File available at', downloadURL);
          });
        });
      })