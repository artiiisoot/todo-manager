import { useEffect } from "react";

export const TodayCard = ({ todayItem, id, handleClickDetail }) => {
  let date = todayItem.createDate.toDate();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let stringified = todayItem.createDate.toDate().toISOString();
  var split1 = stringified.split("T");
  var time = split1[1].split(".");

  const formatDate = `${year}/${month}/${day}`;
  const formatTime = time[0];

  return (
    <div
      id="TodayCard"
      className={`content-item button-effect ${todayItem.state.name}`}
      onClick={() => handleClickDetail(todayItem.category, id)}
    >
      <div className="card-top">
        <div className="tag">
          {Array.from(todayItem.tags).map((tag, idx) => (
            <div className="chip" key={idx}>
              <p className="ellipsis-1">{tag.name}</p>
            </div>
          ))}
        </div>
        <p className="title">{todayItem.title}</p>
        <p className="category">{todayItem.category}</p>
        <i className="icons material-icons">done</i>
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
