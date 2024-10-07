import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//REDUX
import { useDispatch, useSelector } from "react-redux";
import { setImage } from "../redux/reducers/taskReducer";
import { getHeaderState } from "../redux/reducers/headerReducer";

//COMPONENT
import { DetailHeader } from "./components/DetailHeader";
import { useAuth } from "../provider/AuthProvider";

export const AccountPage = () => {
  const dispatch = useDispatch();
  const { headerTitle, headerType } = useSelector((state) => state.header);
  const imageRef = useRef(null);
  const [prevImages, setPrevImages] = useState("");
  const [displayName, setDisplayName] = useState("닉네임을 설정하세요");
  const { user } = useAuth();

  function onFileChange(e) {
    const files = e.target.files;
    const theFile = files[0];

    // FileReader 생성
    const reader = new FileReader();
    // file 업로드가 완료되면 실행
    reader.onloadend = (e) => {
      // 업로드한 이미지 URL 저장
      const result = e.currentTarget.result;
      setPrevImages(result);
    };
    // 파일 정보를 읽기
    reader.readAsDataURL(theFile);
    dispatch(setImage(theFile));
  }

  // function handleSubmit() {
  //   const storageRef = ref(storage, `images/${uid}/profile/${image.name}`);
  //   const uploadTask = uploadBytesResumable(storageRef, image);
  //   new Promise((resolve, reject) => {
  //     uploadTask.on(
  //       "state_success",
  //       null,
  //       (error) => {
  //         console.error(error);
  //         reject(error);
  //       },
  //       async () => {
  //         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //         await updateDoc(doc(db, "users", uid), {
  //           profile: downloadURL,
  //         });
  //         await updateProfile(auth.currentUser, {
  //           photoURL: downloadURL,
  //         });
  //         setUrl(downloadURL);
  //         resolve("downloadURL", downloadURL);
  //       }
  //     );
  //   });
  // }

  useEffect(() => {
    dispatch(getHeaderState({ title: "Account", type: "account" }));
  }, [dispatch]);

  return (
    <>
      <DetailHeader title={headerTitle} type={headerType} />

      <main className="settings">
        <div className="top">
          <label className="profile" htmlFor="profile-img">
            <div className="profile-thumb">
              {prevImages ? (
                <img src={prevImages} alt="" />
              ) : user.photoURL ? (
                <img src={user.photoURL} alt="" />
              ) : (
                <img src="https://placehold.co/400" alt="" />
              )}
              <button>편집</button>
            </div>
            <input
              type="file"
              accept="image/*"
              id="profile-img"
              className="input-hidden"
              ref={imageRef}
              onChange={onFileChange}
            />
          </label>
          <p className="email">{user.email}</p>
        </div>

        <div className="list-group">
          <div className="list">
            <p>닉네임</p>
            {/* <input>{user.displayName ? "" : "닉네임을 설정하세요"}</input> */}
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="list">
            <p>테마</p>
            <div className="list-inner">
              <h5>Thema Name</h5>
              <button className="btn-edit">변경</button>
            </div>
          </div>
        </div>

        {/* <button onClick={handleSubmit}>완료</button> */}
      </main>
    </>
  );
};
