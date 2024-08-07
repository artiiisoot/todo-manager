import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { DetailHeader } from "./components/DetailHeader";
import { getHeaderState } from "../redux/reducers/headerReducer";
import { addDoc, collection, getFirestore } from "firebase/firestore";

export const DataBase = () => {
  const dispatch = useDispatch();
  const headerTitle = useSelector((state) => state.header.value.title);
  const headerType = useSelector((state) => state.header.value.type);

  const db = getFirestore();
  const categories = collection(db, "categories");

  const [inputCategory, setInputCategory] = useState("");

  async function submitCategoryData() {
    await addDoc(categories, {
      name: inputCategory,
    });

    setInputCategory("");
  }

  useEffect(() => {
    dispatch(getHeaderState({ title: "Test" }));
  }, [dispatch]);

  return (
    <>
      <DetailHeader title={headerTitle} type={headerType} />

      <main className="document">
        <div className="flex flex-col flex-1 gap-2">
          <p>Category</p>
          <input
            className="test-input"
            type="text"
            placeholder="Enter the category name"
            onChange={(e) => setInputCategory(e.target.value)}
          />
        </div>

        <div className="button-group flex flex-row justify-end">
          <button onClick={submitCategoryData}>DONE</button>
        </div>
      </main>
    </>
  );
};
