import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";

export const uploadProfileImage = createAsyncThunk(
  "user/uploadProfileImage",
  async ({ storage, db, user, image, uid }, { rejectWithValue }) => {
    console.log("img", image);
    console.log("user", user);
    try {
      const storageRef = ref(storage, `images/${uid}/profile/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      // Promise wrapper for upload task
      const downloadURL = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Upload failed:", error); // 추가된 에러 로깅
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });

      // Update the user's Firestore document
      await updateDoc(doc(db, "users", uid), {
        profile: downloadURL,
      });

      // Update the user's authentication profile
      await updateProfile(user.auth.currentUser, {
        photoURL: downloadURL,
      });

      return downloadURL; // Return the download URL
    } catch (error) {
      console.error("Error in uploadProfileImage:", error); // 에러 로그
      return rejectWithValue(error);
    }
  }
);
