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

  const formatDate = `${year}/${month}/${day}`;

  useEffect(() => {
    console.log(year);
  }, []);

  return (
    <div id="TodayCard" className="content-item button-effect">
      <div className="card-top">
        <div className="tag">
          {Array.from(task.tags).map((tag, idx) => (
            <span className="chip" key={idx}>
              {tag.name}
            </span>
          ))}
        </div>
        <p className="title">{task.title}</p>
        <p className="category">{task.category}</p>
      </div>

      <div className="card-bottom">
        <div className="create-date flex">
          <p className="pr-2">Date</p>
          <div className="date-item flex flex-1 justify-between">
            <p>00:00 A/PM - 00:00 A/PM</p>
            <p>{formatDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
