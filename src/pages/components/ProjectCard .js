import { useEffect, useState } from "react";

import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import {
  getFirestore,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";

export const ProjectCard = ({ project, id }) => {
  let date = project.createDate.toDate();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let stringified = project.createDate.toDate().toISOString();
  var split1 = stringified.split("T");
  var time = split1[1].split(".");

  const formatDate = `${year}/${month}/${day}`;
  const formatTime = time[0];

  const db = getFirestore();
  const projects = collection(db, "projects");
  const storage = getStorage();
  const [imgUrl, setImageUrl] = useState([]);
  const [docIds, setDocIds] = useState([]);

  // async function getDocIdRef() {
  //   const querySnapShot = await getDocs(projects);
  //   const docIds = [];
  //   querySnapShot.forEach((doc) => {
  //     docIds.push(doc.id);
  //   });
  //   console.log("docIds", docIds);
  //   setDocIdRef(docIds);
  // }

  async function getStaticProps() {
    const imageRef = ref(storage, `${id}/`);
    const result = await listAll(imageRef);
    const urls = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);

        console.log(url);
        // return url;
      })
    );

    setImageUrl(urls);
  }

  // useEffect(() => {
  //   onSnapshot(projects, async (snapshot) => {
  //     const ids = await snapshot.docs.map((doc) => doc.id);
  //     return setDocIds(...docIds, ids);
  //   });
  // }, []);

  useEffect(() => {
    // const fetchDocumentIds = async () => {
    //   try {
    //     const snapshot = await getDocs(projects);
    //     const ids = snapshot.docs.map((doc) => doc.id);
    //     setDocIds(ids);
    //   } catch (error) {
    //     console.error("Error fetching document IDs: ", error);
    //   }
    // };

    // return () => fetchDocumentIds();
    getStaticProps();
  }, []);

  return (
    <div id="ProjectCard" className="content-item button-effect">
      <div className="card-img">
        <img src="https://placehold.co/1000" alt="project_img" />
      </div>
      <div className="card-top">
        <div className="tag">
          {Array.from(project.tags).map((tag, idx) => (
            <div className="chip">
              <p className="ellipsis-1" key={idx}>
                {tag.name}
              </p>
            </div>
          ))}
        </div>
        <p className="title">{project.title}</p>
        <p className="category">{project.category}</p>
      </div>

      <div className="card-bottom">
        <div className="create-date flex">
          <p className="pr-2">Date</p>
          <div className="date-item flex flex-1 justify-between">
            <p style={{ visibility: "hidden" }}>{formatTime}</p>
            <p>{formatDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
