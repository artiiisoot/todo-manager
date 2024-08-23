import React from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import { enUS } from "date-fns/locale";

const customLocale = {
  ...enUS,
  localize: {
    ...enUS.localize,
    day: (n) => "SMTWTFS"[n], // 요일을 한 글자로 표시
  },
};

registerLocale("custom", customLocale);

export const StyledDatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    .react-datepicker__calendar-icon {
      top: 50%;
      transform: translateY(-50%);
      fill: #444;
    }
    .react-datepicker__view-calendar-icon {
      input {
        padding-left: 2rem;
        color: #777;
      }
    }
  }
  .react-datepicker {
    border: none;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
  .react-datepicker__header {
    display: flex;
    flex-direction: column;
    column-count: auto;
    gap: 0.75rem;
    .react-datepicker__header__dropdown {
      display: none;
    }
  }
  .react-datepicker__navigation {
    min-height: unset;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range {
    background: #be3455;
  }
`;

export const StyledDatePicker = styled(DatePicker)``;

export const DatePickerComponent = ({ value, setValue }) => {
  return (
    <StyledDatePickerWrapper>
      <StyledDatePicker
        showIcon
        dateFormat="yyy-MM-dd"
        onChange={setValue}
        selected={value}
        showPopperArrow={false}
        locale="custom"
      />
    </StyledDatePickerWrapper>
  );
};
