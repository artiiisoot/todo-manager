import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectedDate } from "../../redux/reducers/dateReducer";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import styled from "styled-components";
import { formatDate } from "../../utils/dateUtils";

export const StyledCalendarWrapper = styled.div`
  position: relative;
  width: 100%;
  /* max-width: 21.875rem; */
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  padding-top: 4.5rem;
  border-radius: 0.25rem;
  background: #fff;
`;

export const StyledCalendar = styled(Calendar)`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: none;
  /* max-width: 21.875rem; */

  abbr {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 85%;
    height: 85%;
    text-decoration: none;
  }
  .react-calendar__navigation {
    display: flex;
    column-count: auto;
    gap: 0.5rem;
  }
  .react-calendar__tile {
    background: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: unset;

    &:focus,
    &:active {
      &::before {
        opacity: 0;
      }
    }

    &--active {
      > div {
        background: #fff;
      }
    }
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background: unset;
  }
  .react-calendar__tile--now {
    abbr {
      background: #777777;
      color: #fff;
      border-radius: 0.25rem;
    }
  }
  .react-calendar__year-view__months__month {
    &.react-calendar__tile--now {
      background: #be3455;
      abbr {
        background: unset;
        color: #fff;
        border-radius: 0.25rem;
      }
    }
  }

  .react-calendar__tile--active {
    abbr {
      background: #be3455;
      border-radius: 0.25rem;
    }
  }

  .react-calendar__navigation__label {
    text-align: left;
    order: 1;
    font-weight: 700;
    background: #efefef;

    &:after {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%);
      content: "";
      border-top: 6px solid #000;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
    }
  }
  .react-calendar__navigation__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    order: 2;
    background: #efefef;
    padding: 0;
    width: 3rem;
    height: 3rem;
  }
  .react-calendar__month-view__weekdays__weekday {
    color: #a0a0a0;
  }
`;

export const StyledToday = styled.button`
  position: absolute;
  left: 1rem;
  top: 1rem;
  display: flex;
  align-items: center;
  min-width: fit-content;
  height: 1.5rem;
  font-size: 0.875rem;
  color: #be3455;
  border-radius: 0.25rem;
  padding: 1rem;
  background: #efefef;
`;

export const StyledDot = styled.div`
  background-color: #a0a0a0;
  border-radius: 50%;
  width: 0.3rem;
  height: 0.3rem;
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
`;

export const BtnIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 1.5rem;
  }
`;

export const CalendarUI = ({ date, setDate, todaysData, projectsData }) => {
  const dispatch = useDispatch();
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [markToday, setMarkToday] = useState([]);
  const [markProject, setMarkProject] = useState([]);

  function handleDateChange(newDate) {
    dispatch(selectedDate(newDate));
    setDate(newDate);
  }
  function handleTodayClick() {
    const today = new Date();

    setActiveStartDate(today);
    setDate(today);
  }
  // function allTodayDate() {

  // }
  function formattedDate(date) {
    return moment(date).format("YYYY/MM/DD");
  }

  // 데이터를 로드하고 상태를 업데이트하는 함수
  useEffect(() => {
    const savedMarkToday = JSON.parse(localStorage.getItem("markToday")) || [];
    const savedMarkProject =
      JSON.parse(localStorage.getItem("markProject")) || [];

    const markedTodayDates = todaysData.map((today) => today.createDate);
    const markedProjectDates = projectsData.map(
      (project) => project.createDate
    );

    const updatedMarkToday = [
      ...new Set([...savedMarkToday, ...markedTodayDates]),
    ];
    const updatedMarkProject = [
      ...new Set([...savedMarkProject, ...markedProjectDates]),
    ];

    setMarkToday(updatedMarkToday);
    setMarkProject(updatedMarkProject);

    localStorage.setItem("markToday", JSON.stringify(updatedMarkToday));
    localStorage.setItem("markProject", JSON.stringify(updatedMarkProject));
  }, [todaysData, projectsData]);

  return (
    <StyledCalendarWrapper>
      <StyledCalendar
        value={date}
        onChange={handleDateChange}
        // onDrillDown={handleYearClick}
        formatDay={(locale, date) => moment(date).format("D")}
        formatYear={(locale, date) => moment(date).format("YYYY")} // 네비게이션 눌렀을때 숫자 년도만 보이게
        formatMonthYear={(locale, date) => moment(date).format("MMMM YYYY")} // 네비게이션에서 2023. 12 이렇게 보이도록 설정
        locale="en-US" // 로케일을 영어로 설정
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0)
        } // 요일 약자를 한 글자로 표시
        // 오늘 날짜로 돌아오는 기능을 위해 필요한 옵션 설정
        activeStartDate={activeStartDate === null ? undefined : activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }
        showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
        next2Label={null} // +1년 & +10년 이동 버튼 숨기기
        prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
        calendarType="gregory" // 일요일 부터 시작
        tileContent={({ date, view }) => {
          let html = [];
          if (
            markToday?.find((day) => day === moment(date).format("YYYY/MM/DD"))
          ) {
            html.push(<StyledDot key={`today-${formattedDate(date)}`} />);
          }
          if (
            markProject?.find(
              (day) => day === moment(date).format("YYYY/MM/DD")
            )
          ) {
            html.push(<StyledDot key={`project-${formattedDate}`} />);
          }
          return <>{html}</>;
        }}
        prevLabel={
          <BtnIcon>
            <i className="icons material-icons-outlined">chevron_left</i>
          </BtnIcon>
        }
        nextLabel={
          <BtnIcon>
            <i className="icons material-icons-outlined">chevron_right</i>
          </BtnIcon>
        }
      />
      <StyledToday onClick={handleTodayClick}>Today</StyledToday>
    </StyledCalendarWrapper>
  );
};
