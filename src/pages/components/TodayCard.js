import { useEffect } from "react";

export const TodayCard = ({ task, id }) => {
  // const formatToDate = () => {
  //   const date = task.timestamp;
  //   const day = date.getFullYear();

  //   return day
  // };
  let date = task.createDate.toDate();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let stringified = task.createDate.toDate().toISOString();
  var split1 = stringified.split("T");
  var time = split1[1].split(".");

  const formatDate = `${year}/${month}/${day}`;
  const formatTime = time[0];

  return (
    <div id="TodayCard" className="content-item button-effect">
      <div className="card-top">
        <div className="tag">
          {Array.from(task.tags).map((tag, idx) => (
            <div className="chip" key={idx}>
              <p className="ellipsis-1">{tag.name}</p>
            </div>
          ))}
        </div>
        <p className="title">{task.title}</p>
        <p className="category">{task.category}</p>
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
