export const TodayCard = ({ task, id }) => {
  return (
    <>
      <div id="TodayCard" className="content-item button-effect">
        <div className="card-top">
          {console.log("task[id]", task.tags)}
          <div className="tag">
            {/* {task.tags.map((tag, idx) => (
              <span className="label-rounded" key={idx}>
                {tag.name}
              </span>
            ))} */}

            <span className="label-rounded" >
              {task.tags.name}
            </span>
          </div>
          <p className="title">{task.title}</p>
          <p className="category">{task.category}</p>
        </div>

        <div className="card-bottom">
          <div className="create-date flex">
            <p className="pr-2">Date</p>
            <div className="date-item flex flex-1 justify-between">
              <p>00:00 A/PM - 00:00 A/PM</p>
              <p>11 July, 2023</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
