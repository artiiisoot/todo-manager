import React, { useEffect, useState } from "react";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../utils/dateUtils";
import {
  setLoading,
  setLoadingImage,
} from "../../redux/reducers/loadingReducer";

// COMPONENT
import Skeleton from "react-loading-skeleton"; // Skeleton 라이브러리

export const ProjectCard = ({ projectItem, id, handleClickDetail }) => {
  const dispatch = useDispatch();
  const { loadingImage } = useSelector((state) => state.loading);

  return (
    <div
      id="ProjectCard"
      className={`content-item button-effect ${projectItem.state.name}`}
      onClick={() => handleClickDetail(projectItem.category, id)}
    >
      {!loadingImage && (
        <div className="card-img">
          <div className="card-img-inner">
            <Skeleton height="100%" width="100%" />
          </div>
        </div>
      )}
      <div
        className="card-img"
        style={{ display: loadingImage ? "block" : "none" }}
      >
        <div className="card-img-inner">
          <img
            src={
              projectItem.image
                ? projectItem.image
                : "https://placehold.co/600x400"
            }
            alt="project_img"
            style={{ display: loadingImage ? "block" : "none" }} // 이미지 로드 전에는 숨김
            onLoad={() => dispatch(setLoadingImage(true))} // 이미지가 로드되면 상태 변경
          />
        </div>
      </div>

      {/* {!loadingImage ? (
        <div className="card-top">
          <div className="card-top-inner">
            <Skeleton style={{ display: "flex" }} width="100%" />
            <Skeleton style={{ display: "flex" }} width="100%" />
            <Skeleton style={{ display: "flex" }} width="100%" />
          </div>
        </div>
      ) : (
        <div className="card-top">
          <div className="tag">
            {Array.from(projectItem.tags).map((tag, idx) => (
              <div className="chip" key={idx}>
                <p className="ellipsis-1">{tag.name}</p>
              </div>
            ))}
          </div>
          <h5>{projectItem.title}</h5>
          <p>{projectItem.category}</p>
        </div>
      )} */}
      <div className="card-top">
        <div className="tag">
          {Array.from(projectItem.tags).map((tag, idx) => (
            <div className="chip" key={idx}>
              <p className="ellipsis-1">{tag.name}</p>
            </div>
          ))}
        </div>
        <h5>{projectItem.title}</h5>
        <p>{projectItem.category}</p>
      </div>

      {/* {!loadingImage ? (
        <div className="card-bottom">
          <Skeleton style={{ display: "flex" }} width="100%" />
        </div>
      ) : (
        <div className="card-bottom">
          <div className="create-date flex">
            <p className="pr-2">Date</p>
            <div className="date-item flex flex-1 justify-between">
              <p style={{ visibility: "hidden" }}>
                {formatDate(projectItem.createDate.toDate())}
              </p>
              <p>{formatDate(projectItem.createDate.toDate())}</p>
            </div>
          </div>
        </div>
      )} */}
      <div className="card-bottom">
        <div className="create-date flex">
          <p className="pr-2">Date</p>
          <div className="date-item flex flex-1 justify-between">
            <p style={{ visibility: "hidden" }}>
              {formatDate(projectItem.createDate.toDate())}
            </p>
            <p>{formatDate(projectItem.createDate.toDate())}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
