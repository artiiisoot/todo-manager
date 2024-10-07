import React, { useState } from "react";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../utils/dateUtils";
import { setLoadingImage } from "../../redux/reducers/loadingReducer";

// COMPONENT
import Skeleton from "react-loading-skeleton"; // Skeleton 라이브러리

export const TodayCard = ({ todayItem, id, handleClickDetail }) => {
  const dispatch = useDispatch();
  const { loadingImage } = useSelector((state) => state.loading);

  return (
    <div
      id="TodayCard"
      className={`content-item button-effect ${todayItem.state.name}`}
      onClick={() => handleClickDetail(todayItem.category, id)}
    >
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
            {Array.from(todayItem.tags).map((tag, idx) => (
              <div className="chip" key={idx}>
                <p className="ellipsis-1">{tag.name}</p>
              </div>
            ))}
          </div>
          <h5>{todayItem.title}</h5>
          <p>{todayItem.category}</p>
        </div>
      )} */}
      <div className="card-top">
        <div className="tag">
          {Array.from(todayItem.tags).map((tag, idx) => (
            <div className="chip" key={idx}>
              <p className="ellipsis-1">{tag.name}</p>
            </div>
          ))}
        </div>
        <h5>{todayItem.title}</h5>
        <p>{todayItem.category}</p>
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
                {formatDate(todayItem.createDate.toDate())}
              </p>
              <p>{formatDate(todayItem.createDate.toDate())}</p>
            </div>
          </div>
        </div>
      )} */}
      <div className="card-bottom">
        <div className="create-date flex">
          <p className="pr-2">Date</p>
          <div className="date-item flex flex-1 justify-between">
            <p style={{ visibility: "hidden" }}>
              {formatDate(todayItem.createDate.toDate())}
            </p>
            <p>{formatDate(todayItem.createDate.toDate())}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
